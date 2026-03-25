import { NextResponse } from "next/server";
import { OAuth2Client } from "google-auth-library";
import connectDB from "@/lib/connectDB";
import User from "@/models/User"; // Ensure you have a User model
import jwt from "jsonwebtoken";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export async function POST(req) {
  try {
    await connectDB();
    const { token } = await req.json();

    // 1. Verify the Google Token
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { email, name, picture, sub: googleId } = payload;

    // 2. Find or Create User in Database
    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        name,
        email,
        image: picture,
        googleId,
        role: "user", // Default role
      });
    }

    // 3. Create a Custom JWT for your app
    const appToken = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // 4. Return success and token
    const response = NextResponse.json({
      success: true,
      message: "Login successful",
      user: { name: user.name, email: user.email, image: user.image },
    });

    // 5. Set HTTP-Only Cookie for Security (Optional but recommended)
    response.cookies.set("user_session", appToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Google Auth Error:", error);
    return NextResponse.json(
      { success: false, message: "Authentication failed" },
      { status: 401 }
    );
  }
}