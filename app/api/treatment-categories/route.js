import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import TreatmentCategory from "@/models/TreatmentCategory";

export async function GET(req) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    console.log("SEARCH PARAMS:", Object.fromEntries(searchParams.entries()));
    const type = searchParams.get("type");
    const parentSlug = searchParams.get("parentSlug");

    const query = { status: "active" };

    // if (type) query.type = type;
    // if (parentSlug) query.parentSlug = parentSlug;

    const categories = await TreatmentCategory.find(query)
    //   .sort({ order: 1, createdAt: -1 })
      .lean();
console.log("CATEGORIES FOUND:", categories.length);
    return NextResponse.json({
      success: true,
      count: categories.length,
      data: categories,
    });
  } catch (error) {
    console.error("GET TREATMENT CATEGORIES ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch treatment categories",
        error: error.message,
      },
      { status: 500 }
    );
  }
}