// /app/api/admin/coupons/update/[id]/route.ts

import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Coupon from '@/models/Coupon';

export async function PUT(req: Request, context: any) {
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

    const body = await req.json();

    const updated = await Coupon.findByIdAndUpdate(
      id,
      {
        code: body.code?.toUpperCase(),
        type: body.type,
        value: body.value,
        maxDiscount: body.maxDiscount ?? null,
        minCartValue: body.minCartValue ?? 0,
        validTill: body.validTill ?? null,
      },
      { new: true }
    );

    if (!updated) {
      return NextResponse.json(
        {
          status: 'error',
          message: 'Coupon not found',
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      status: 'success',
      message: 'Coupon updated successfully',
      data: updated,
    });
  } catch (error) {
    console.error('UPDATE ERROR:', error);

    return NextResponse.json(
      {
        status: 'error',
        message: 'Update failed',
      },
      { status: 500 }
    );
  }
}