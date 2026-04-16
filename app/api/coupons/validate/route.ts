import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { connectDB } from '@/lib/db';
import Coupon from '@/models/Coupon';

/* ================= MOCK MODEL (replace with real DB later) ================= */
const coupons = [
  {
    code: 'WELCOME50',
    type: 'percentage',
    value: 50,
    maxDiscount: 300,
    minCartValue: 500,
    isActive: true,
    validTill: new Date('2026-12-31'),
  },
  {
    code: 'FLAT200',
    type: 'flat',
    value: 200,
    minCartValue: 1000,
    isActive: true,
  },
];

// /* ================= POST API ================= */
// export async function POST(req: NextRequest) {
//   try {
//     const body = await req.json();
//     const { code, cartTotal } = body;

//     if (!code) {
//       return NextResponse.json({
//         status: 'error',
//         message: 'Coupon code is required',
//       });
//     }

//     const coupon = coupons.find(
//       (c) => c.code === code.toUpperCase()
//     );

//     if (!coupon || !coupon.isActive) {
//       return NextResponse.json({
//         status: 'error',
//         message: 'Invalid coupon',
//       });
//     }

//     // expiry check
//     if (coupon.validTill && new Date() > coupon.validTill) {
//       return NextResponse.json({
//         status: 'error',
//         message: 'Coupon expired',
//       });
//     }

//     // minimum cart value
//     if (coupon.minCartValue && cartTotal < coupon.minCartValue) {
//       return NextResponse.json({
//         status: 'error',
//         message: `Minimum order ₹${coupon.minCartValue}`,
//       });
//     }

//     // ✅ SUCCESS RESPONSE
//     return NextResponse.json({
//       status: 'success',
//       data: {
//         code: coupon.code,
//         type: coupon.type,
//         value: coupon.value,
//         maxDiscount: coupon.maxDiscount || null,
//       },
//     });

//   } catch (error) {
//     return NextResponse.json({
//       status: 'error',
//       message: 'Server error',
//     });
//   }
// }
export async function POST(req: NextRequest) {
  await connectDB();

  const { code, cartTotal } = await req.json();

  const coupon = await Coupon.findOne({
    code: code.toUpperCase(),
    isActive: true,
  });

  if (!coupon) {
    return NextResponse.json({
      status: 'error',
      message: 'Invalid coupon',
    });
  }

  if (coupon.validTill && new Date() > coupon.validTill) {
    return NextResponse.json({
      status: 'error',
      message: 'Coupon expired',
    });
  }

  if (cartTotal < coupon.minCartValue) {
    return NextResponse.json({
      status: 'error',
      message: `Minimum order ₹${coupon.minCartValue}`,
    });
  }

  return NextResponse.json({
    status: 'success',
    data: {
      code: coupon.code,
      type: coupon.type,
      value: coupon.value,
      maxDiscount: coupon.maxDiscount || null,
    },
  });
}