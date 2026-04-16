// /app/api/admin/coupons/delete/[id]/route.ts

import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Coupon from '@/models/Coupon';

export async function DELETE(req: Request, context: any) {
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

    const deletedCoupon = await Coupon.findByIdAndDelete(id);

    if (!deletedCoupon) {
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
      message: 'Coupon deleted successfully',
      data: deletedCoupon,
    });
  } catch (error) {
    console.error('DELETE COUPON ERROR:', error);

    return NextResponse.json(
      {
        status: 'error',
        message: 'Failed to delete coupon',
      },
      { status: 500 }
    );
  }
}