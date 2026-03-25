import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Treatment from "@/models/Treatment";

export async function GET(req, { params }) {
  try {
    await connectDB();

    const { slug } = await params;

    const fullSlug = Array.isArray(slug) ? slug.join("/") : slug;

    const treatment = await Treatment.findOne({
      fullSlug,
      status: "published",
    }).lean();

    if (!treatment) {
      return NextResponse.json(
        {
          success: false,
          message: "Treatment not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: treatment,
    });
  } catch (error) {
    console.error("GET TREATMENT ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch treatment",
        error: error.message,
      },
      { status: 500 }
    );
  }
}