import { NextResponse } from "next/server";
import connectDB from "@/lib/connectDB";
import Treatment from "@/models/Treatment";

export async function GET(_, { params }) {
  try {
    await connectDB();
    const treatment = await Treatment.findById(params.id);

    return NextResponse.json({ success: true, treatment });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(req, { params }) {
  try {
    await connectDB();
    const body = await req.json();

    const treatment = await Treatment.findByIdAndUpdate(params.id, body, {
      new: true,
    });

    return NextResponse.json({
      success: true,
      message: "Treatment updated",
      treatment,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(_, { params }) {
  try {
    await connectDB();
    await Treatment.findByIdAndDelete(params.id);

    return NextResponse.json({
      success: true,
      message: "Treatment deleted",
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}