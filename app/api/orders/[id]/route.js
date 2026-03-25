import { NextResponse } from "next/server";
import connectDB from "@/lib/connectDB";
import Order from "@/models/Order";

export async function GET(_, { params }) {
  try {
    await connectDB();
    const order = await Order.findById(params.id);

    return NextResponse.json({ success: true, order });
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

    const order = await Order.findByIdAndUpdate(params.id, body, { new: true });

    return NextResponse.json({
      success: true,
      message: "Order updated",
      order,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}