import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Blog from "@/models/Blog";

export async function GET(req, { params }) {
  try {
    await connectDB();
    const blog = await Blog.findById(params.id);

    if (!blog) {
      return NextResponse.json(
        { success: false, message: "Blog not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, blog });
  } catch {
    return NextResponse.json(
      { success: false, message: "Failed to fetch blog" },
      { status: 500 }
    );
  }
}

export async function PUT(req, { params }) {
  try {
    await connectDB();
    const body = await req.json();

    const blog = await Blog.findByIdAndUpdate(params.id, body, { new: true });

    return NextResponse.json({
      success: true,
      blog,
      message: "Blog updated successfully",
    });
  } catch {
    return NextResponse.json(
      { success: false, message: "Failed to update blog" },
      { status: 500 }
    );
  }
}

export async function DELETE(req, { params }) {
  try {
    await connectDB();
    await Blog.findByIdAndDelete(params.id);

    return NextResponse.json({
      success: true,
      message: "Blog deleted successfully",
    });
  } catch {
    return NextResponse.json(
      { success: false, message: "Failed to delete blog" },
      { status: 500 }
    );
  }
}