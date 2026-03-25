import { NextResponse } from "next/server";

// Temporary in-memory OTP store
// Key = phone number
// Value = { otp, expiresAt, isUsed }
const otpStore = global.otpStore || new Map();

if (!global.otpStore) {
  global.otpStore = otpStore;
}

export async function POST(req) {
  try {
    const { phone } = await req.json();

    // Validate Indian mobile number
    if (!phone || !/^[6-9]\d{9}$/.test(phone)) {
      return NextResponse.json(
        { success: false, message: "Invalid phone number" },
        { status: 400 }
      );
    }

    // Generate random 4-digit OTP
    const otp = Math.floor(1000 + Math.random() * 9000).toString();

    // Save OTP in memory for 5 minutes
    otpStore.set(phone, {
      otp,
      expiresAt: Date.now() + 5 * 60 * 1000,
      isUsed: false,
    });

    // Your SMS text
    const smsText = `${otp} is your OTP for access to Siama Skincare.\nThank you for choosing Siama Skincare`;

    // Encode SMS
    const encodedText = encodeURIComponent(smsText);

    // Build CommNestSMS URL
    const smsUrl = `http://www.commnestsms.com/api/push.json?apikey=${process.env.COMMNESTSMS_API_KEY}&route=${process.env.COMMNESTSMS_ROUTE}&sender=${process.env.COMMNESTSMS_SENDER}&mobileno=${phone}&text=${encodedText}`;

    // Send SMS
    const smsResponse = await fetch(smsUrl, {
      method: "GET",
      cache: "no-store",
    });

    const smsData = await smsResponse.json().catch(() => null);

    if (!smsResponse.ok) {
      return NextResponse.json(
        {
          success: false,
          message: "Failed to send OTP",
          providerResponse: smsData,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "OTP sent successfully",
      providerResponse: smsData,

      // remove in production
      debugOtp: otp,
    });
  } catch (error) {
    console.error("SEND OTP ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong while sending OTP",
      },
      { status: 500 }
    );
  }
}