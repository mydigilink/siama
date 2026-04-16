import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { customer, items, sessionDateTime, subtotal, tax, total } = body;

    // Validate required fields
    if (!customer || !items || !sessionDateTime || !customer.phone) {
      return NextResponse.json(
        {
          status: 'error',
          message: 'Missing required fields',
        },
        { status: 400 }
      );
    }

    // Validate session date/time is in the future
    const sessionDate = new Date(sessionDateTime);
    const now = new Date();

    if (sessionDate <= now) {
      return NextResponse.json(
        {
          status: 'error',
          message: 'Session date and time must be in the future',
        },
        { status: 400 }
      );
    }

    // Generate order ID
    const orderId = `SIAMA${Date.now()}${Math.random().toString(36).substr(2, 5).toUpperCase()}`;

    // Here you would typically save the order to your database
    // For now, we'll just return success with the order ID

    console.log('[Checkout Create] Order created:', {
      orderId,
      customer,
      items,
      sessionDateTime,
      total,
    });

    return NextResponse.json({
      status: 'success',
      message: 'Order created successfully',
      data: {
        orderId,
        customer,
        items,
        sessionDateTime,
        subtotal,
        tax,
        total,
      },
    });

  } catch (error) {
    console.error('[Checkout Create] Error:', error);
    return NextResponse.json(
      {
        status: 'error',
        message: 'Internal server error',
      },
      { status: 500 }
    );
  }
}