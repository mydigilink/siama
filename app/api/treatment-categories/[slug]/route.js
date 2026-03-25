import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import TreatmentCategory from "@/models/TreatmentCategory";

export async function GET(req, { params }) {
  try {
    await connectDB();

    const { slug } = await params;

    const category = await TreatmentCategory.findOne({
      slug,
      status: "active",
    }).lean();

    if (!category) {
      return NextResponse.json(
        {
          success: false,
          message: "Category not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: category,
    });
  } catch (error) {
    console.error("GET CATEGORY ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch category",
        error: error.message,
      },
      { status: 500 }
    );
  }
}