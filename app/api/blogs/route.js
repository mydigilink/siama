import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Blog from "@/models/Blogs";

export async function GET(request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);

    const page = Math.max(parseInt(searchParams.get("page")) || 1, 1);
    const limit = Math.max(parseInt(searchParams.get("limit")) || 6, 1);
    const skip = (page - 1) * limit;

    // Manual refresh support
    const refresh = searchParams.get("refresh") === "true";

    // Detect hard refresh / bypass cache headers from browser
    const cacheControl = request.headers.get("cache-control") || "";
    const pragma = request.headers.get("pragma") || "";

    const isHardRefresh =
      cacheControl.includes("no-cache") ||
      cacheControl.includes("max-age=0") ||
      pragma.includes("no-cache");

    // Query data
    const [blogs, total] = await Promise.all([
      Blog.find({ status: "published" })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Blog.countDocuments({ status: "published" }),
    ]);

    const totalPages = Math.ceil(total / limit);

    const response = NextResponse.json({
      success: true,
      count: blogs.length,
      total,
      page,
      limit,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
      data: blogs,
    });

    /**
     * Cache Strategy:
     * - Normal request: cache for 5 minutes in browser/CDN
     * - Hard refresh or ?refresh=true: bypass cache
     */
    if (refresh || isHardRefresh) {
      response.headers.set(
        "Cache-Control",
        "no-store, no-cache, must-revalidate, proxy-revalidate"
      );
      response.headers.set("Pragma", "no-cache");
      response.headers.set("Expires", "0");
      response.headers.set("Surrogate-Control", "no-store");
    } else {
      response.headers.set(
        "Cache-Control",
        "public, max-age=300, s-maxage=300, stale-while-revalidate=60"
      );
    }

    return response;
  } catch (error) {
    console.error("GET BLOGS ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch blogs",
        error: error.message,
      },
      { status: 500 }
    );
  }
}