import { NextResponse } from "next/server";
import connectDB from "@/lib/connectDB";
import Treatment from "@/models/Treatment";

export async function GET(req, { params }) {
  try {
    await connectDB();

    // 1. You MUST await params in Next.js 15+
    const { slug } = await params;

    // 2. Log it to verify the slug is actually coming through
    console.log("Searching for slug:", slug);

    const treatment = await Treatment.findOne({ 
      slug: slug, 
      active: true 
    });

    // 3. Handle the case where the database returns nothing
    if (!treatment) {
      return NextResponse.json(
        { success: false, message: "Treatment not found or inactive" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, treatment });
  } catch (error) {
    console.error("GET Error:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}