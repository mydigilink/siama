import { NextResponse } from "next/server";

interface YouTubeVideo {
  id: {
    videoId?: string;
    kind?: string;
  } | string;
  snippet: {
    title: string;
    description: string;
    thumbnails: {
      default: { url: string };
    };
    channelId?: string;
  };
}

interface YouTubeResponse {
  items: YouTubeVideo[];
}

export async function GET() {
  try {
    const channelHandle = "Siamaskincare"; // Channel handle without @
    const apiKey = process.env.YOUTUBE_API_KEY;
    
    // If no API key, return empty array (fallback to hardcoded data in component)
    if (!apiKey) {
      return NextResponse.json({ 
        videos: [],
        error: "YouTube API key not configured. Using fallback data." 
      });
    }

    let channelId: string | null = null;

    // Method 1: Try using forHandle (for @handle format)
    try {
      const handleResponse = await fetch(
        `https://www.googleapis.com/youtube/v3/channels?part=id,contentDetails&forHandle=${channelHandle}&key=${apiKey}`
      );

      if (handleResponse.ok) {
        const handleData = await handleResponse.json();
        if (handleData.items && handleData.items.length > 0) {
          channelId = handleData.items[0].id;
        }
      }
    } catch (error) {
      console.log("forHandle method failed, trying alternatives...");
    }

    // Method 2: Try using forUsername (for older channels)
    if (!channelId) {
      try {
        const usernameResponse = await fetch(
          `https://www.googleapis.com/youtube/v3/channels?part=id&forUsername=${channelHandle}&key=${apiKey}`
        );

        if (usernameResponse.ok) {
          const usernameData = await usernameResponse.json();
          if (usernameData.items && usernameData.items.length > 0) {
            channelId = usernameData.items[0].id;
          }
        }
      } catch (error) {
        console.log("forUsername method failed, trying search...");
      }
    }

    // Method 3: Search for channel by name
    if (!channelId) {
      try {
        const searchResponse = await fetch(
          `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${channelHandle}&type=channel&key=${apiKey}&maxResults=1`
        );

        if (searchResponse.ok) {
          const searchData = await searchResponse.json();
          if (searchData.items && searchData.items.length > 0) {
            channelId = searchData.items[0].snippet.channelId;
          }
        }
      } catch (error) {
        console.log("Search method failed");
      }
    }

    if (!channelId) {
      return NextResponse.json({ 
        videos: [],
        error: "Channel not found. Please check the channel handle." 
      });
    }

    // Fetch Shorts videos from the channel
    // Note: videoDuration=short parameter may not work for all cases
    // We'll fetch recent videos and filter if needed
    const videosResponse = await fetch(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${channelId}&type=video&maxResults=20&order=date&key=${apiKey}`
    );

    if (!videosResponse.ok) {
      const errorText = await videosResponse.text();
      console.error("YouTube API Error:", errorText);
      return NextResponse.json({ 
        videos: [],
        error: `Failed to fetch videos: ${videosResponse.status}` 
      });
    }

    const videosData: YouTubeResponse = await videosResponse.json();
    
    if (!videosData.items || videosData.items.length === 0) {
      return NextResponse.json({ 
        videos: [],
        error: "No videos found" 
      });
    }

    // Map videos and remove duplicates
    const videoMap = new Map<string, { videoId: string; title: string; description: string; thumbnail: string }>();
    
    videosData.items.forEach((item) => {
      const videoId = typeof item.id === 'string' 
        ? item.id 
        : item.id.videoId || '';
      
      if (videoId && !videoMap.has(videoId)) {
        videoMap.set(videoId, {
          videoId,
          title: item.snippet.title,
          description: item.snippet.description,
          thumbnail: item.snippet.thumbnails.default.url,
        });
      }
    });

    // Convert map to array and limit to 12 unique videos
    const videos = Array.from(videoMap.values()).slice(0, 12);

    return NextResponse.json({ videos });
  } catch (error) {
    console.error("Error fetching YouTube videos:", error);
    return NextResponse.json(
      { videos: [], error: "Internal server error" },
      { status: 500 }
    );
  }
}

