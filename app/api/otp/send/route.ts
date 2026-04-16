import { NextRequest, NextResponse } from 'next/server';
import { generateOTP, validateMobileFormat, hashOTP, generateOTPExpiry } from '@/utils/otp';
import { sendOTPSMS } from '@/utils/sms';
import fetch from 'node-fetch';

// Use fallback chain to ensure API URL is always available
const PUBLIC_API_BASE_URL = 
  process.env.NEXT_PUBLIC_PUBLIC_API_BASE_URL || 
  process.env.PUBLIC_API_BASE_URL
   ||   'https://api.siama.in/api/v1/public';

// Simple in-memory store for OTPs (use Redis or database in production)
// Structure: { mobile: { hash: string, expiry: number, attempts: number, lastAttempt: number, verifyAttempts: number } }
const otpStore = new Map<string, { hash: string; expiry: number; attempts: number; lastAttempt: number; verifyAttempts: number }>();

// Share store globally for verify route access
if (typeof global !== 'undefined') {
  if (!(global as any).otpStore) {
    (global as any).otpStore = otpStore;
  }
}

const getOTPStore = () => {
  return (global as any).otpStore || otpStore;
};

// Rate limiting: max 3 OTP requests per mobile per 10 minutes
const MAX_OTP_REQUESTS = 300;
const RATE_LIMIT_WINDOW = 10 * 60 * 1000; // 10 minutes

/**
 * GET /api/otp/send - Method not allowed (avoids SPA fallback returning HTML)
 */
export async function GET() {
  return NextResponse.json(
    { status: 'error', message: 'Method not allowed. Use POST with body: { "mobile": "10-digit number" }' },
    { status: 405, headers: { Allow: 'POST' } }
  );
}

/**
 * POST /api/otp/send
 * Send OTP to mobile number
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { mobile } = body;


    // Validate mobile number
    if (!mobile || !validateMobileFormat(mobile)) {
      return NextResponse.json(
        {
          status: 'error',
          message: 'Invalid mobile number. Please enter a valid 10-digit Indian mobile number.',
        },
        { status: 400 }
      );
    }

    // Check rate limiting
    const store = getOTPStore();
    const existingOTP = store.get(mobile);
    if (existingOTP) {
      const timeSinceLastAttempt = Date.now() - existingOTP.lastAttempt;
      
      // If within rate limit window and max attempts reached
      if (timeSinceLastAttempt < RATE_LIMIT_WINDOW && existingOTP.attempts >= MAX_OTP_REQUESTS) {
        const remainingTime = Math.ceil((RATE_LIMIT_WINDOW - timeSinceLastAttempt) / 60000);
        return NextResponse.json(
          {
            status: 'error',
            message: `Too many OTP requests. Please try again after ${remainingTime} minutes.`,
          },
          { status: 429 }
        );
      }

      // Reset attempts if outside rate limit window
      if (timeSinceLastAttempt >= RATE_LIMIT_WINDOW) {
        existingOTP.attempts = 0;
      }
    }

    // Generate OTP
    const otp = generateOTP();
    const otpHash = await hashOTP(otp);
    const expiry = generateOTPExpiry(5); // 5 minutes

    // For development/testing, log OTP
    console.log(`[OTP Send] Generated OTP for ${mobile}: ${otp}`);

    // Store OTP
    store.set(mobile, {
      hash: otpHash,
      expiry,
      attempts: (existingOTP?.attempts || 0) + 1,
      lastAttempt: Date.now(),
      verifyAttempts: 0,
    });

    // Send OTP via SMS
    const smsResult = await sendOTPSMS(mobile, otp);

    console.log('[OTP Send] SMS Result:', smsResult);

    // Call public usermobilesession API to log the session (server-side, not client)
    try {
      const browser = request.headers.get('user-agent') || '';
      const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || '';
      // Device info can be parsed from user-agent if needed, here just pass empty string
      const device = '';
      await fetch(`${PUBLIC_API_BASE_URL}/usermobilesession`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mobile,
          otp,
          browser,
          ip,
          device,
        }),
      });
    } catch (err) {
      console.error('[OTP Send] Failed to call public usermobilesession API:', err);
    }

    if (smsResult.status === 'error') {
      console.error('[OTP Send] SMS provider error details:', smsResult);
      // Show actual error message from SMS provider for debugging
      const actualError = smsResult.message || 'Unknown SMS error';
      return NextResponse.json(
        {
          status: 'error',
          message: `SMS provider error: ${actualError}`,
          // Include detailed error info
          error: actualError,
          smsResult
        },
        { status: 502 }
      );
    }

    return NextResponse.json({
      status: 'success',
      message: 'OTP sent successfully to your mobile number.',
    });
  } catch (error) {
    console.error('Error in OTP send API:', error);
    return NextResponse.json(
      {
        status: 'error',
        message: 'An error occurred while sending OTP. Please try again.',
      },
      { status: 500 }
    );
  }
}

// Clean up expired OTPs periodically (optional optimization)
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now();
    const store = getOTPStore();
    for (const [mobile, data] of store.entries()) {
      if (data.expiry < now) {
        store.delete(mobile);
      }
    }
  }, 60000); // Clean up every minute
}
