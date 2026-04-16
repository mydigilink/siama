// /app/api/admin/coupons/create/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Coupon from '@/models/Coupon';

export async function POST(req: NextRequest) {
  await connectDB();

  try {
    const body = await req.json();

    const coupon = await Coupon.create({
      code: body.code.toUpperCase(),
      type: body.type,
      value: body.value,
      maxDiscount: body.maxDiscount || null,
      minCartValue: body.minCartValue || 0,
      validTill: body.validTill || null,
      isActive: true,
    });

    return NextResponse.json({
      status: 'success',
      data: coupon,
    });
  } catch (error) {
    return NextResponse.json({
      status: 'error',
      message: 'Failed to create coupon',
    });
  }
}