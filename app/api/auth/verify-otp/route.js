import { NextResponse } from "next/server";

const otpStore = global.otpStore || new Map();

if (!global.otpStore) {
  global.otpStore = otpStore;
}

export async function POST(req) {
  try {
    const { phone, otp } = await req.json();

    if (!phone || !otp) {
      return NextResponse.json(
        { success: false, message: "Phone and OTP are required" },
        { status: 400 }
      );
    }

    const stored = otpStore.get(phone);

    if (!stored) {
      return NextResponse.json(
        { success: false, message: "OTP not found. Please request again." },
        { status: 400 }
      );
    }

    if (stored.isUsed) {
      return NextResponse.json(
        { success: false, message: "OTP already used" },
        { status: 400 }
      );
    }

    if (Date.now() > stored.expiresAt) {
      otpStore.delete(phone);
      return NextResponse.json(
        { success: false, message: "OTP expired" },
        { status: 400 }
      );
    }

    if (stored.otp !== otp) {
      return NextResponse.json(
        { success: false, message: "Invalid OTP" },
        { status: 400 }
      );
    }

    // Mark used
    stored.isUsed = true;
    otpStore.set(phone, stored);

    // Optional: remove after successful verification
    otpStore.delete(phone);

    // Set login cookie
    const response = NextResponse.json({
      success: true,
      message: "OTP verified successfully",
    });

    response.cookies.set("siama_user", phone, {
      httpOnly: false, // true if you only need server-side
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("VERIFY OTP ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong while verifying OTP",
      },
      { status: 500 }
    );
  }
}