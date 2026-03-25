import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/lib/mongodb";
import Blog from "@/models/Blogs";

    export async function GET(request, { params }) {


  try {
    await connectDB();
  const { slug } = await params; // ✅ await the params
    
    console.log("FETCHING BLOG WITH SLUG/ID:", slug);

    if (!slug) {
      return NextResponse.json(
        {
          success: false,
          message: "Blog slug is required",
        },
        { status: 400 }
      );
    }

    // Find by slug first
    let blog = await Blog.findOne({
      slug,
      status: "published",
    })
      .select(
        "title slug excerpt content featuredImage tags author createdAt updatedAt seo views"
      )
      .lean();

    // Fallback by ObjectId
    if (!blog && mongoose.Types.ObjectId.isValid(slug)) {
      blog = await Blog.findOne({
        _id: slug,
        status: "published",
      })
        .select(
          "title slug excerpt content featuredImage tags author createdAt updatedAt seo views"
        )
        .lean();
    }

    if (!blog) {
      return NextResponse.json(
        {
          success: false,
          message: "Blog not found",
        },
        { status: 404 }
      );
    }

    // Increase views in background
    Blog.updateOne({ _id: blog._id }, { $inc: { views: 1 } }).catch((err) =>
      console.error("VIEW COUNT ERROR:", err)
    );

    // Related blogs
    const relatedQuery = {
      _id: { $ne: blog._id },
      status: "published",
    };

    if (blog.tags?.length > 0) {
      relatedQuery.tags = { $in: blog.tags };
    }

    const relatedBlogs = await Blog.find(relatedQuery)
      .select("title slug featuredImage createdAt excerpt")
      .sort({ createdAt: -1 })
      .limit(3)
      .lean();

    return NextResponse.json(
      {
        success: true,
        data: blog,
        relatedBlogs,
      },
      {
        status: 200,
        headers: {
          "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
        },
      }
    );
  } catch (error) {
    console.error("GET SINGLE BLOG ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch blog",
        error: error.message,
      },
      { status: 500 }
    );
  }
}