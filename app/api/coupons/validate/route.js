import { NextResponse } from "next/server";
import connectDB from "@/lib/connectDB";
import Coupon from "@/models/Coupon";

export async function POST(req) {
  try {
    await connectDB();

    const body = await req.json();
    const code = body.code?.trim()?.toUpperCase();
    const subtotal = Number(body.subtotal || 0);

    if (!code) {
      return NextResponse.json(
        { success: false, message: "Coupon code is required" },
        { status: 400 }
      );
    }

    const coupon = await Coupon.findOne({ code });

    if (!coupon) {
      return NextResponse.json(
        { success: false, message: "Invalid coupon code" },
        { status: 404 }
      );
    }

    if (!coupon.isActive) {
      return NextResponse.json(
        { success: false, message: "This coupon is inactive" },
        { status: 400 }
      );
    }

    if (coupon.expiresAt && new Date(coupon.expiresAt) < new Date()) {
      return NextResponse.json(
        { success: false, message: "This coupon has expired" },
        { status: 400 }
      );
    }

    if (coupon.usageLimit > 0 && coupon.usedCount >= coupon.usageLimit) {
      return NextResponse.json(
        { success: false, message: "Coupon usage limit reached" },
        { status: 400 }
      );
    }

    if (subtotal < coupon.minCartValue) {
      return NextResponse.json(
        {
          success: false,
          message: `Minimum cart value should be ₹${coupon.minCartValue}`,
        },
        { status: 400 }
      );
    }

    let discount = 0;

    if (coupon.discountType === "flat") {
      discount = coupon.discountValue;
    }

    if (coupon.discountType === "percent") {
      discount = Math.round((subtotal * coupon.discountValue) / 100);

      if (coupon.maxDiscount > 0) {
        discount = Math.min(discount, coupon.maxDiscount);
      }
    }

    discount = Math.min(discount, subtotal);

    return NextResponse.json({
      success: true,
      message: "Coupon applied successfully",
      coupon: {
        _id: coupon._id.toString(),
        code: coupon.code,
        title: coupon.title,
        description: coupon.description,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
        minCartValue: coupon.minCartValue,
        maxDiscount: coupon.maxDiscount,
        discount,
      },
    });
  } catch (error) {
    console.error("Coupon validate error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Server error" },
      { status: 500 }
    );
  }
}