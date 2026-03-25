import { NextResponse } from "next/server";
import { createToken } from "@/lib/auth";

export async function POST(req) {
  try {
    const { email, password } = await req.json();

    if (
      email === process.env.ADMIN_EMAIL &&
      password === process.env.ADMIN_PASSWORD
    ) {
      const token = createToken({
        email,
        role: "admin",
      });

      const response = NextResponse.json({
        success: true,
        message: "Login successful",
      });

      response.cookies.set("admin_token", token, {
        httpOnly: true,
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
        sameSite: "lax",
      });

      return response;
    }

    return NextResponse.json(
      { success: false, message: "Invalid credentials" },
      { status: 401 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}// import { NextResponse } from "next/server";

// export async function POST(req) {
//   try {
//     const { username, password } = await req.json();

//     // Static admin credentials
//     if (username === "admin" && password === "admin123") {
//       const response = NextResponse.json({
//         success: true,
//         message: "Login successful",
//       });

//       response.cookies.set("admin_token", "secure_admin_session", {
//         httpOnly: true,
//         path: "/",
//         maxAge: 60 * 60 * 24, // 1 day
//       });

//       return response;
//     }

//     return NextResponse.json(
//       { success: false, message: "Invalid credentials" },
//       { status: 401 }
//     );
//   } catch (error) {
//     return NextResponse.json(
//       { success: false, message: "Server error" },
//       { status: 500 }
//     );
//   }
// }