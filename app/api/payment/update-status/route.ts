import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { orderId, status } = await request.json();

    // Here you would typically update your database with the payment status
    // For now, we'll just log it and return success
    console.log('Payment status update:', {
      orderId,
      status, // 'paid', 'failed', 'cancelled', etc.
      timestamp: new Date().toISOString(),
    });

    // TODO: Update order in database with payment status
    // This would typically involve calling your backend API to update the order

    return NextResponse.json({
      success: true,
      message: 'Payment status updated successfully',
      orderId,
      status,
    });
  } catch (error) {
    console.error('Payment status update error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to update payment status' },
      { status: 500 }
    );
  }
}