import { NextResponse } from "next/server";
import mongoose from "mongoose";
import connectDB from "@/lib/connectDB";
import Order from "@/models/Order";
import Treatment from "@/models/Treatment";
import Coupon from "@/models/Coupon";

export async function POST(req) {
  try {
    await connectDB();

    const body = await req.json();

    const {
      customerName,
      phone,
      email,
      gender,
      appointmentDate,
      timeSlot,
      concern,
      address,
      paymentMethod,
      items,
      couponCode,
    } = body;

    if (!customerName || !phone) {
      return NextResponse.json(
        { success: false, message: "Name and phone are required" },
        { status: 400 }
      );
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { success: false, message: "Cart is empty" },
        { status: 400 }
      );
    }

    const formattedItems = [];
    let subtotal = 0;

    // Revalidate treatment ids + prices from DB
    for (const item of items) {
      const treatmentId = item.treatmentId || item._id;
      const quantity = Number(item.quantity || item.qty || 1);

      if (!treatmentId || !mongoose.Types.ObjectId.isValid(treatmentId)) {
        return NextResponse.json(
          {
            success: false,
            message: "Invalid treatment in cart",
            invalidItem: item,
          },
          { status: 400 }
        );
      }

      const treatment = await Treatment.findById(treatmentId);

      if (!treatment || !treatment.isActive) {
        return NextResponse.json(
          {
            success: false,
            message: "Treatment not found or inactive",
            invalidItem: item,
          },
          { status: 400 }
        );
      }

      const finalPrice =
        treatment.salePrice > 0 ? treatment.salePrice : treatment.price;

      formattedItems.push({
        treatmentId: treatment._id,
        title: treatment.title,
        price: finalPrice,
        quantity,
        image: treatment.image || "",
      });

      subtotal += finalPrice * quantity;
    }

    // Coupon revalidation from DB
    let discount = 0;
    let couponDoc = null;
    let couponType = "";
    let couponValue = 0;

    if (couponCode && couponCode.trim()) {
      const code = couponCode.trim().toUpperCase();

      couponDoc = await Coupon.findOne({ code });

      if (!couponDoc) {
        return NextResponse.json(
          { success: false, message: "Invalid coupon code" },
          { status: 400 }
        );
      }

      if (!couponDoc.isActive) {
        return NextResponse.json(
          { success: false, message: "Coupon is inactive" },
          { status: 400 }
        );
      }

      if (couponDoc.expiresAt && new Date(couponDoc.expiresAt) < new Date()) {
        return NextResponse.json(
          { success: false, message: "Coupon has expired" },
          { status: 400 }
        );
      }

      if (
        couponDoc.usageLimit > 0 &&
        couponDoc.usedCount >= couponDoc.usageLimit
      ) {
        return NextResponse.json(
          { success: false, message: "Coupon usage limit reached" },
          { status: 400 }
        );
      }

      if (subtotal < couponDoc.minCartValue) {
        return NextResponse.json(
          {
            success: false,
            message: `Minimum cart value should be ₹${couponDoc.minCartValue}`,
          },
          { status: 400 }
        );
      }

      if (couponDoc.discountType === "flat") {
        discount = couponDoc.discountValue;
      }

      if (couponDoc.discountType === "percent") {
        discount = Math.round((subtotal * couponDoc.discountValue) / 100);

        if (couponDoc.maxDiscount > 0) {
          discount = Math.min(discount, couponDoc.maxDiscount);
        }
      }

      discount = Math.min(discount, subtotal);
      couponType = couponDoc.discountType;
      couponValue = couponDoc.discountValue;
    }

    const consultationFee = formattedItems.length > 0 ? 199 : 0;
    const total = subtotal - discount + consultationFee;

    const order = await Order.create({
      customerName,
      phone,
      email: email || "",
      gender: gender || "women",
      appointmentDate: appointmentDate || "",
      timeSlot: timeSlot || "",
      concern: concern || "",
      address: address || "",
      paymentMethod: paymentMethod || "cod",
      items: formattedItems,
      couponCode: couponDoc?.code || "",
      couponId: couponDoc?._id || null,
      couponType,
      couponValue,
      subtotal,
      discount,
      consultationFee,
      total,
      status: "pending",
    });

    // Increment coupon usage only after successful order
    if (couponDoc) {
      await Coupon.findByIdAndUpdate(couponDoc._id, {
        $inc: { usedCount: 1 },
      });
    }

    return NextResponse.json({
      success: true,
      message: "Order placed successfully",
      order,
    });
  } catch (error) {
    console.error("Order create error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Server error" },
      { status: 500 }
    );
  }
}
// import { NextResponse } from "next/server";
// import mongoose from "mongoose";
// import connectDB from "@/lib/connectDB";
// import Order from "@/models/Order";

// export async function POST(req) {
//   try {
//     await connectDB();

//     const body = await req.json();

//     const {
//       customerName,
//       phone,
//       email,
//       gender,
//       appointmentDate,
//       timeSlot,
//       concern,
//       items,
//       subtotal,
//       discount,
//       consultationFee,
//       total,
//     } = body;

//     // Basic validation
//     if (!customerName || !phone) {
//       return NextResponse.json(
//         { success: false, message: "Name and phone are required" },
//         { status: 400 }
//       );
//     }

//     if (!items || !Array.isArray(items) || items.length === 0) {
//       return NextResponse.json(
//         { success: false, message: "Cart is empty" },
//         { status: 400 }
//       );
//     }

//     // Validate & normalize items
//     const formattedItems = [];

//     for (const item of items) {
//       const treatmentId = item.treatmentId || item._id;
//       const quantity = Number(item.quantity || item.qty || 1);
//       const price = Number(item.price || 0);

//       if (
//         !treatmentId ||
//         !mongoose.Types.ObjectId.isValid(treatmentId) ||
//         !item.title ||
//         price <= 0 ||
//         quantity <= 0
//       ) {
//         return NextResponse.json(
//           {
//             success: false,
//             message: "Invalid treatment in cart",
//             invalidItem: item,
//           },
//           { status: 400 }
//         );
//       }

//       formattedItems.push({
//         treatmentId,
//         title: item.title,
//         price,
//         quantity,
//         image: item.image || "",
//       });
//     }

//     const order = await Order.create({
//       customerName,
//       phone,
//       email: email || "",
//       gender: gender || "women",
//       appointmentDate: appointmentDate || "",
//       timeSlot: timeSlot || "",
//       concern: concern || "",
//       items: formattedItems,
//       subtotal: Number(subtotal || 0),
//       discount: Number(discount || 0),
//       consultationFee: Number(consultationFee || 0),
//       total: Number(total || 0),
//       status: "pending",
//     });

//     return NextResponse.json({
//       success: true,
//       message: "Order placed successfully",
//       order,
//     });
//   } catch (error) {
//     console.error("Order create error:", error);
//     return NextResponse.json(
//       { success: false, message: error.message },
//       { status: 500 }
//     );
//   }
// }