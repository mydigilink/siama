import { NextResponse } from "next/server";

/**
 * Helper endpoint to exchange short-lived token for long-lived token
 * 
 * Usage: GET /api/instagram/exchange-token?short_token=TOKEN&app_id=APP_ID&app_secret=APP_SECRET
 * 
 * This will exchange a short-lived token (1 hour) for a long-lived token (60 days)
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const shortToken = searchParams.get("short_token");
    const appId = searchParams.get("app_id");
    const appSecret = searchParams.get("app_secret");

    if (!shortToken || !appId || !appSecret) {
      return NextResponse.json(
        { 
          error: "Missing required parameters",
          required: ["short_token", "app_id", "app_secret"]
        },
        { status: 400 }
      );
    }

    // Exchange short-lived token for long-lived token
    const response = await fetch(
      `https://graph.facebook.com/v19.0/oauth/access_token?grant_type=fb_exchange_token&client_id=${appId}&client_secret=${appSecret}&fb_exchange_token=${shortToken}`
    );

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json(
        { 
          error: "Failed to exchange token",
          details: errorText 
        },
        { status: response.status }
      );
    }

    const data = await response.json();

    if (!data.access_token) {
      return NextResponse.json(
        { error: "No access token in response" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      access_token: data.access_token,
      token_type: data.token_type || "bearer",
      expires_in: data.expires_in || "Unknown",
      instructions: {
        step1: "Copy the 'access_token' value",
        step2: "Add it to your .env.local as: INSTAGRAM_ACCESS_TOKEN=access_token",
        step3: "Restart your development server",
        note: "This token is valid for approximately 60 days. You'll need to refresh it before it expires."
      }
    });
  } catch (error) {
    console.error("Error in exchange-token route:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

