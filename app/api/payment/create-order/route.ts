import { NextRequest, NextResponse } from 'next/server';
import Razorpay from 'razorpay';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { orderId, amount } = body;

    // Input validation - CRITICAL SECURITY
    if (!orderId || typeof orderId !== 'string' || orderId.trim().length === 0) {
      return NextResponse.json(
        { success: false, message: 'Invalid orderId' },
        { status: 400 }
      );
    }

    if (!amount || typeof amount !== 'number' || amount <= 0 || amount > 100000000) {
      return NextResponse.json(
        { success: false, message: 'Invalid amount. Must be between 1 and 100000000 paisa (₹1 to ₹10,00,000)' },
        { status: 400 }
      );
    }

    // Sanitize orderId
    const sanitizedOrderId = orderId.trim();
    const sanitizedAmount = Math.round(amount); // Ensure integer

    console.log('[Create Order] Request:', { 
      orderId: sanitizedOrderId,
      amount: sanitizedAmount 
    });

    // Initialize Razorpay with validation
    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      throw new Error('Razorpay keys not configured');
    }

    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    // Create Razorpay order
    const options = {
      amount: sanitizedAmount, // Amount in paisa
      currency: 'INR',
      receipt: sanitizedOrderId,
      payment_capture: 1, // Auto capture
    };

    const order = await razorpay.orders.create(options);

    console.log('[Create Order] Success:', {
      orderId: order.id,
      amount: order.amount,
      status: order.status
    });

    return NextResponse.json({
      success: true,
      razorpayOrderId: order.id,
      amount: order.amount,
      currency: order.currency,
      orderId: sanitizedOrderId,
    });
  } catch (error) {
    console.error('[Create Order] Error:', error);
    console.error('[Create Order] Error message:', error instanceof Error ? error.message : 'Unknown error');
    console.error('[Create Order] Error stack:', error instanceof Error ? error.stack : 'No stack');
    return NextResponse.json(
      { success: false, message: 'Failed to create payment order', error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}