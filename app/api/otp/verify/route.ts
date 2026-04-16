import fetch from 'node-fetch';
import { NextRequest, NextResponse } from 'next/server';

// Use fallback chain to ensure API URL is always available
const PUBLIC_API_BASE_URL = 
  process.env.NEXT_PUBLIC_PUBLIC_API_BASE_URL || 
  process.env.PUBLIC_API_BASE_URL;// || 
//  'https://api.siama.in/api/v1/public';
import { validateMobileFormat, validateOTPFormat, verifyOTP, isOTPExpired } from '@/utils/otp';

// Import the same otpStore from send route (in production, use Redis or database)
// For now, we'll use a module-level map that's shared
const otpStore = new Map<string, { hash: string; expiry: number; attempts: number; verifyAttempts: number }>();

// Get reference to the send route's store
// In production, this would be a shared Redis/database connection
if (typeof global !== 'undefined') {
  if (!(global as any).otpStore) {
    (global as any).otpStore = otpStore;
  }
}

const getOTPStore = () => {
  return (global as any).otpStore || otpStore;
};

// Max verification attempts per OTP
const MAX_VERIFY_ATTEMPTS = 3;

/**
 * POST /api/otp/verify
 * Verify OTP for mobile number
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { mobile, otp } = body;

    // Validate mobile number
    if (!mobile || !validateMobileFormat(mobile)) {
      return NextResponse.json(
        {
          status: 'error',
          message: 'Invalid mobile number.',
        },
        { status: 400 }
      );
    }

    // Validate OTP format
    if (!otp || !validateOTPFormat(otp)) {
      return NextResponse.json(
        {
          status: 'error',
          message: 'Invalid OTP format. Please enter a 6-digit OTP.',
        },
        { status: 400 }
      );
    }

    const store = getOTPStore();
    const storedOTP = store.get(mobile);

    // Check if OTP exists
    if (!storedOTP) {
      return NextResponse.json(
        {
          status: 'error',
          message: 'OTP not found or expired. Please request a new OTP.',
        },
        { status: 404 }
      );
    }

    // Check if OTP has expired
    if (isOTPExpired(storedOTP.expiry)) {
      store.delete(mobile);
      return NextResponse.json(
        {
          status: 'error',
          message: 'OTP has expired. Please request a new OTP.',
        },
        { status: 410 }
      );
    }

    // Check verification attempts
    const verifyAttempts = storedOTP.verifyAttempts || 0;
    if (verifyAttempts >= MAX_VERIFY_ATTEMPTS) {
      store.delete(mobile);
      return NextResponse.json(
        {
          status: 'error',
          message: 'Maximum verification attempts exceeded. Please request a new OTP.',
        },
        { status: 429 }
      );
    }

    // Verify OTP
    const isValid = await verifyOTP(otp, storedOTP.hash);

    if (!isValid) {
      // Increment verify attempts
      storedOTP.verifyAttempts = verifyAttempts + 1;
      store.set(mobile, storedOTP);

      const remainingAttempts = MAX_VERIFY_ATTEMPTS - (verifyAttempts + 1);
      return NextResponse.json(
        {
          status: 'error',
          message: `Invalid OTP. ${remainingAttempts} attempt(s) remaining.`,
        },
        { status: 401 }
      );
    }

    // OTP verified successfully - remove from store
    store.delete(mobile);

    // Call public usermobilesession/verify API (server-side)
    try {
      const browser = request.headers.get('user-agent') || '';
      const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || '';
      const device = '';
      await fetch(`${PUBLIC_API_BASE_URL}/usermobilesession/verify`, {
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
      console.error('[OTP Verify] Failed to call public usermobilesession/verify API:', err);
    }

    return NextResponse.json({
      status: 'success',
      message: 'OTP verified successfully.',
      data: {
        mobile,
        verified: true,
      },
    });
  } catch (error) {
    console.error('Error in OTP verify API:', error);
    return NextResponse.json(
      {
        status: 'error',
        message: 'An error occurred while verifying OTP. Please try again.',
      },
      { status: 500 }
    );
  }
}
