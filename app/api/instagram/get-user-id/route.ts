import { NextResponse } from "next/server";

/**
 * Helper endpoint to get Instagram User ID from access token
 * 
 * Usage: GET /api/instagram/get-user-id?access_token=YOUR_TOKEN
 * 
 * This will help you find your Instagram User ID which you need
 * to add to INSTAGRAM_USER_ID in your .env.local 
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const accessToken = searchParams.get("access_token");

    if (!accessToken) {
      return NextResponse.json(
        { error: "access_token parameter is required" },
        { status: 400 }
      );
    }

    // Step 1: Get Facebook Pages associated with the token
    const pagesResponse = await fetch(
      `https://graph.facebook.com/v19.0/me/accounts?access_token=${accessToken}`
    );

    if (!pagesResponse.ok) {
      const errorText = await pagesResponse.text();
      return NextResponse.json(
        { 
          error: "Failed to fetch Facebook Pages",
          details: errorText 
        },
        { status: pagesResponse.status }
      );
    }

    const pagesData = await pagesResponse.json();

    if (!pagesData.data || pagesData.data.length === 0) {
      return NextResponse.json(
        { error: "No Facebook Pages found. Make sure your Instagram account is connected to a Facebook Page." },
        { status: 404 }
      );
    }

    // Step 2: For each page, check if it has an Instagram Business Account
    const results = [];
    
    for (const page of pagesData.data) {
      try {
        const instagramResponse = await fetch(
          `https://graph.facebook.com/v19.0/${page.id}?fields=instagram_business_account&access_token=${accessToken}`
        );

        if (instagramResponse.ok) {
          const instagramData = await instagramResponse.json();
          
          if (instagramData.instagram_business_account) {
            results.push({
              pageName: page.name,
              pageId: page.id,
              instagramAccountId: instagramData.instagram_business_account.id,
              instagramUsername: instagramData.instagram_business_account.username || "Unknown",
            });
          }
        }
      } catch (error) {
        console.error(`Error checking page ${page.id}:`, error);
      }
    }

    if (results.length === 0) {
      return NextResponse.json(
        { 
          error: "No Instagram Business Account found. Make sure your Instagram account is a Business/Creator account and connected to a Facebook Page.",
          pages: pagesData.data.map((p: any) => ({ id: p.id, name: p.name }))
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      accounts: results,
      instructions: {
        step1: "Copy the 'instagramAccountId' value",
        step2: "Add it to your .env.local as: INSTAGRAM_USER_ID=instagramAccountId",
        step3: "Restart your development server"
      }
    });
  } catch (error) {
    console.error("Error in get-user-id route:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

