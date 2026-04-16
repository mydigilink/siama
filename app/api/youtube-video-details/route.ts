import { NextResponse } from "next/server";
// import bcrypt from "bcrypt";

// const saltRounds = 10; // from your env
// const password = "Admin@123"; // your new password

// async function generateHash() {
//   const hashedPassword = await bcrypt.hash(password, saltRounds);
//   console.log("Hashed Password:", hashedPassword);
// }

export async function GET(request: Request) {
  
// generateHash();
  try {
    const { searchParams } = new URL(request.url);
    const videoId = searchParams.get("videoId");

    if (!videoId) {
      return NextResponse.json(
        { error: "Video ID is required" },
        { status: 400 }
      );
    }

    const apiKey = process.env.YOUTUBE_API_KEY;

    if (!apiKey) {
      return NextResponse.json({
        video: {
          name: "Client",
          text: "Watch this testimonial video",
          title: "",
        },
      });
    }

    // Fetch video details from YouTube API
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoId}&key=${apiKey}`
    );

    if (!response.ok) {
      return NextResponse.json({
        video: {
          name: "Client",
          text: "Watch this testimonial video",
          title: "",
        },
      });
    }

    const data = await response.json();

    if (!data.items || data.items.length === 0) {
      return NextResponse.json({
        video: {
          name: "Client",
          text: "Watch this testimonial video",
          title: "",
        },
      });
    }

    const video = data.items[0];
    const snippet = video.snippet;

    // Extract name from title
    let name = "Client";
    const namePatterns = [
      /(?:by|from|with|by\s+)([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)/i,
      /([A-Z][a-z]+\s+[A-Z][a-z]+)(?:\s+(?:says|shares|testimonial))/i,
      /^([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*):/,
    ];

    for (const pattern of namePatterns) {
      const match = snippet.title.match(pattern);
      if (match && match[1]) {
        name = match[1].trim();
        break;
      }
    }

    // Extract text from description or title
    let text = "";
    if (snippet.description && snippet.description.trim().length > 0) {
      const firstSentence = snippet.description
        .split(/[.!?]\s+/)
        .find((s: string) => s.length > 20) || snippet.description.split("\n")[0];
      text = firstSentence.substring(0, 120).trim();
      if (firstSentence.length > 120) text += "...";
    } else {
      text = snippet.title.substring(0, 100).trim();
      if (snippet.title.length > 100) text += "...";
    }

    return NextResponse.json({
      video: {
        name,
        text: text || "Watch this testimonial video",
        title: snippet.title,
      },
    });
  } catch (error) {
    console.error("Error fetching video details:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

