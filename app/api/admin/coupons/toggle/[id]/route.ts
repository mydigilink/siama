// /app/api/admin/coupons/toggle/[id]/route.ts

import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Coupon from '@/models/Coupon';

export async function PATCH(req: Request, context: any) {
  await connectDB();

  try {
    const { id } = context.params as { id: string };

    if (!id) {
      return NextResponse.json(
        {
          status: 'error',
          message: 'Coupon ID is required',
        },
        { status: 400 }
      );
    }

    const coupon = await Coupon.findById(id);

    if (!coupon) {
      return NextResponse.json(
        {
          status: 'error',
          message: 'Coupon not found',
        },
        { status: 404 }
      );
    }

    coupon.isActive = !coupon.isActive;
    await coupon.save();

    return NextResponse.json({
      status: 'success',
      message: 'Coupon status toggled',
      data: coupon,
    });
  } catch (error) {
    console.error('TOGGLE ERROR:', error);

    return NextResponse.json(
      {
        status: 'error',
        message: 'Toggle failed',
      },
      { status: 500 }
    );
  }
}