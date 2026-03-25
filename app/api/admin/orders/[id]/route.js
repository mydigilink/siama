import { NextResponse } from "next/server";
import connectDB from "@/lib/connectDB";
import Order from "@/models/Order";
import mongoose from "mongoose";

export async function GET(req, { params }) {
  try {
    await connectDB();

    const { id } = await params;

    // if (!mongoose.Types.ObjectId.isValid(id)) {
    //   return NextResponse.json(
    //     { success: false, message: "Invalid order ID" },
    //     { status: 400 }
    //   );
    // }

    const order = await Order.findById(id)
      .populate("items.treatmentId")
      .lean();

    if (!order) {
      return NextResponse.json(
        { success: false, message: "Order not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      order,
    });
  } catch (error) {
    console.error("Admin order fetch error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch order" },
      { status: 500 }
    );
  }
}