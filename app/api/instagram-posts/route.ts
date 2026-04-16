import { NextResponse } from "next/server";
import { manualInstagramPosts } from "@/config/instagram-posts";

interface InstagramPost {
  id: string;
  imageUrl: string;
  caption: string;
  likes: number;
  comments: number;
  timestamp: string;
  permalink: string;
  topComments: {
    username: string;
    text: string;
    likes: number;
  }[];
}

export async function GET() {
  try {
    // Check for manual posts first (easier to set up)
    if (manualInstagramPosts && manualInstagramPosts.length > 0) {
      return NextResponse.json({
        posts: manualInstagramPosts,
        source: "manual"
      });
    }

    // Note: Instagram's public API is very limited
    // For production, you'll need to use Instagram Basic Display API or Instagram Graph API
    // which requires authentication and app approval from Facebook
    
    const accessToken = process.env.INSTAGRAM_ACCESS_TOKEN;
    const userId = process.env.INSTAGRAM_USER_ID;

    if (!accessToken || !userId) {
      // Return empty array if no credentials are configured
      return NextResponse.json({
        posts: [],
        error: "Instagram API credentials not configured. Please add INSTAGRAM_ACCESS_TOKEN and INSTAGRAM_USER_ID to your environment variables, or add posts manually in config/instagram-posts.ts"
      });
    }

    // Try to fetch from Instagram Graph API
    try {
      const response = await fetch(
        `https://graph.instagram.com/${userId}/media?fields=id,caption,media_type,media_url,permalink,thumbnail_url,timestamp,like_count,comments_count&access_token=${accessToken}&limit=12`
      );

      if (!response.ok) {
        throw new Error(`Instagram API error: ${response.status}`);
      }

      const data = await response.json();

      if (data.data && data.data.length > 0) {
        // Fetch comments for each post
        const postsWithComments = await Promise.all(
          data.data.map(async (post: any) => {
            try {
              const commentsResponse = await fetch(
                `https://graph.instagram.com/${post.id}/comments?fields=username,text,like_count&access_token=${accessToken}&limit=5`
              );
              
              let topComments: { username: string; text: string; likes: number }[] = [];
              if (commentsResponse.ok) {
                const commentsData = await commentsResponse.json();
                topComments = (commentsData.data || []).map((comment: any) => ({
                  username: comment.username || "user",
                  text: comment.text || "",
                  likes: comment.like_count || 0,
                }));
              }

              return {
                id: post.id,
                imageUrl: post.media_url || post.thumbnail_url || "",
                caption: post.caption || "",
                likes: post.like_count || 0,
                comments: post.comments_count || 0,
                timestamp: formatTimestamp(post.timestamp),
                permalink: post.permalink || "",
                topComments: topComments.sort((a, b) => b.likes - a.likes).slice(0, 3),
              };
            } catch (error) {
              console.error(`Error fetching comments for post ${post.id}:`, error);
              return {
                id: post.id,
                imageUrl: post.media_url || post.thumbnail_url || "",
                caption: post.caption || "",
                likes: post.like_count || 0,
                comments: post.comments_count || 0,
                timestamp: formatTimestamp(post.timestamp),
                permalink: post.permalink || "",
                topComments: [],
              };
            }
          })
        );

        return NextResponse.json({ posts: postsWithComments });
      }
    } catch (error) {
      console.error("Error fetching from Instagram API:", error);
    }

    // Return empty array if API fails
    return NextResponse.json({
      posts: [],
      error: "Failed to fetch Instagram posts. Please check your API credentials."
    });
  } catch (error) {
    console.error("Error in Instagram API route:", error);
    return NextResponse.json({
      posts: [],
      error: "Internal server error"
    });
  }
}

function formatTimestamp(timestamp: string): string {
  try {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) {
      return "just now";
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes} ${minutes === 1 ? "minute" : "minutes"} ago`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours} ${hours === 1 ? "hour" : "hours"} ago`;
    } else if (diffInSeconds < 604800) {
      const days = Math.floor(diffInSeconds / 86400);
      return `${days} ${days === 1 ? "day" : "days"} ago`;
    } else if (diffInSeconds < 2592000) {
      const weeks = Math.floor(diffInSeconds / 604800);
      return `${weeks} ${weeks === 1 ? "week" : "weeks"} ago`;
    } else {
      const months = Math.floor(diffInSeconds / 2592000);
      return `${months} ${months === 1 ? "month" : "months"} ago`;
    }
  } catch (error) {
    return "recently";
  }
}

