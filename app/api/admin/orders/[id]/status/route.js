import { NextResponse } from "next/server";
import connectDB from "@/lib/connectDB";
import Order from "@/models/Order";
import mongoose from "mongoose";

export async function PATCH(req, { params }) {
  try {
    await connectDB();

    const { id } = await params;
    const body = await req.json();
    const { status, paymentStatus } = body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: "Invalid order ID" },
        { status: 400 }
      );
    }

    const updateData = {};

    if (status) {
      const allowedStatuses = ["pending", "confirmed", "completed", "cancelled"];
      if (!allowedStatuses.includes(status)) {
        return NextResponse.json(
          { success: false, message: "Invalid order status" },
          { status: 400 }
        );
      }
      updateData.status = status;
    }

    if (paymentStatus) {
      const allowedPaymentStatuses = ["pending", "paid", "failed"];
      if (!allowedPaymentStatuses.includes(paymentStatus)) {
        return NextResponse.json(
          { success: false, message: "Invalid payment status" },
          { status: 400 }
        );
      }
      updateData.paymentStatus = paymentStatus;
    }

    const order = await Order.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    if (!order) {
      return NextResponse.json(
        { success: false, message: "Order not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Order updated successfully",
      order,
    });
  } catch (error) {
    console.error("Order status update error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update order" },
      { status: 500 }
    );
  }
}