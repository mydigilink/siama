import { NextResponse } from "next/server";
import connectDB from "@/lib/connectDB";
import Treatment from "@/models/Treatment";

export async function GET(req) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const gender = searchParams.get("gender");
    const category = searchParams.get("category");
    const active = searchParams.get("active");

    let query = {};

    if (gender) query.gender = gender;
    if (category) query.category = category;
    if (active !== null) query.active = active === "true";

    const treatments = await Treatment.find(query).sort({ createdAt: -1 });

    return NextResponse.json({ success: true, treatments });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    await connectDB();
    const body = await req.json();

    const treatment = await Treatment.create(body);

    return NextResponse.json({
      success: true,
      message: "Treatment created",
      treatment,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
// import { NextResponse } from "next/server";
// import { connectDB } from "@/lib/mongodb";
// import Treatment from "@/models/Treatment";

// export async function GET(req) {
//   try {
//     await connectDB();

//     const { searchParams } = new URL(req.url);

//     const gender = searchParams.get("gender");
//     const category = searchParams.get("category");
//     const page = parseInt(searchParams.get("page") || "1");
//     const limit = parseInt(searchParams.get("limit") || "12");
//     const skip = (page - 1) * limit;

//     const query = {
//       status: "published",
//     };

//     if (gender) query.mainCategorySlug = gender;
//     if (category) query.subCategorySlug = category;

//     const [treatments, total] = await Promise.all([
//       Treatment.find(query)
//         .sort({ order: 1, createdAt: -1 })
//         .skip(skip)
//         .limit(limit)
//         .lean(),
//       Treatment.countDocuments(query),
//     ]);

//     return NextResponse.json({
//       success: true,
//       count: treatments.length,
//       total,
//       currentPage: page,
//       totalPages: Math.ceil(total / limit),
//       hasMore: skip + treatments.length < total,
//       data: treatments,
//     });
//   } catch (error) {
//     console.error("GET TREATMENTS ERROR:", error);

//     return NextResponse.json(
//       {
//         success: false,
//         message: "Failed to fetch treatments",
//         error: error.message,
//       },
//       { status: 500 }
//     );
//   }
// }