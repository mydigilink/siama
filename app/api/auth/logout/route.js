import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json({
    success: true,
    message: "Logged out successfully",
  });

  response.cookies.set("siama_user", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });

  return response;
}
// import { NextResponse } from "next/server";
// import otpStore from "@/lib/otpStore";

// export async function POST(req) {
//   try {
//     const { phone, otp } = await req.json();

//     if (!phone || !otp) {
//       return NextResponse.json(
//         { success: false, message: "Phone and OTP are required" },
//         { status: 400 }
//       );
//     }

//     const record = otpStore.get(phone);

//     if (!record) {
//       return NextResponse.json(
//         { success: false, message: "OTP not found. Please request again." },
//         { status: 400 }
//       );
//     }

//     if (Date.now() > record.expiresAt) {
//       otpStore.delete(phone);
//       return NextResponse.json(
//         { success: false, message: "OTP expired. Please request again." },
//         { status: 400 }
//       );
//     }

//     if (record.otp !== otp) {
//       return NextResponse.json(
//         { success: false, message: "Invalid OTP" },
//         { status: 400 }
//       );
//     }

//     otpStore.delete(phone);

//     // TODO: Find or create user in DB
//     const user = {
//       id: phone, // use real DB user id
//       phone,
//     };

//     const response = NextResponse.json({
//       success: true,
//       message: "Login successful",
//       user,
//     });

//     // Create secure login cookie
//     response.cookies.set("siama_user", JSON.stringify(user), {
//       httpOnly: true,
//       secure: process.env.NODE_ENV === "production",
//       sameSite: "lax",
//       path: "/",
//       maxAge: 60 * 60 * 24 * 7, // 7 days
//     });

//     return response;
//   } catch (error) {
//     return NextResponse.json(
//       { success: false, message: "Something went wrong" },
//       { status: 500 }
//     );
//   }
// }