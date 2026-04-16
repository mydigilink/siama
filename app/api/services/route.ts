// app/api/services/route.ts

import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { ServiceService } from "@/services/service.service";

const service = new ServiceService();


// ✅ GET (list services)
export async function GET(req: NextRequest) {
  await connectDB();

  try {
    const { searchParams } = new URL(req.url);

    const filters = {
      status: searchParams.get("status") === "true"
        ? true
        : searchParams.get("status") === "false"
        ? false
        : undefined,

      category: searchParams.get("category") || undefined,
      sub_category: searchParams.get("sub_category") || undefined,

      bestTreatment:
        searchParams.get("bestTreatment") === "true"
          ? true
          : undefined,

      popularProduct:
        searchParams.get("popularProduct") === "true"
          ? true
          : undefined,
    };

    const data = await service.getAllServices(filters);

    return NextResponse.json({
      status: "success",
      data,
    });
  } catch (error: any) {
    return NextResponse.json(
      { status: "error", message: error.message },
      { status: 500 }
    );
  }
}


// ✅ POST (create service)
export async function POST(req: NextRequest) {
  await connectDB();

  try {
    const body = await req.json();

    const data = await service.createService(body);

    return NextResponse.json({
      status: "success",
      data,
    });
  } catch (error: any) {
    return NextResponse.json(
      { status: "error", message: error.message },
      { status: 500 }
    );
  }
}