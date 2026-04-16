import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { sendBookingConfirmationSMS } from '@/utils/sms';

const PUBLIC_API_BASE_URL =
  process.env.NEXT_PUBLIC_PUBLIC_API_BASE_URL ||
  process.env.PUBLIC_API_BASE_URL ||
  'https://api.siama.in/api/v1/public';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      orderId,
      razorpay_payment_id,
      razorpay_order_id,
      razorpay_signature
    } = body;

    // Input validation - CRITICAL SECURITY
    if (!orderId || typeof orderId !== 'string' || orderId.trim().length === 0) {
      return NextResponse.json(
        { success: false, message: 'Invalid orderId' },
        { status: 400 }
      );
    }

    if (!razorpay_payment_id || typeof razorpay_payment_id !== 'string' || !razorpay_payment_id.startsWith('pay_')) {
      return NextResponse.json(
        { success: false, message: 'Invalid payment ID' },
        { status: 400 }
      );
    }

    if (!razorpay_order_id || typeof razorpay_order_id !== 'string' || !razorpay_order_id.startsWith('order_')) {
      return NextResponse.json(
        { success: false, message: 'Invalid Razorpay order ID' },
        { status: 400 }
      );
    }

    if (!razorpay_signature || typeof razorpay_signature !== 'string' || razorpay_signature.length < 32) {
      return NextResponse.json(
        { success: false, message: 'Invalid signature' },
        { status: 400 }
      );
    }

    // Sanitize inputs
    const sanitizedOrderId = orderId.trim();
    const sanitizedPaymentId = razorpay_payment_id.trim();
    const sanitizedOrderIdRazorpay = razorpay_order_id.trim();
    const sanitizedSignature = razorpay_signature.trim();

    // console.log('[Verify Payment] Request:', {
    //   orderId: sanitizedOrderId,
    //   paymentId: sanitizedPaymentId.substring(0, 10) + '...', // Log only partial ID
    //   razorpayOrderId: sanitizedOrderIdRazorpay.substring(0, 10) + '...'
    // });

    // Validate Razorpay keys
    if (!process.env.RAZORPAY_KEY_SECRET) {
      throw new Error('Razorpay key secret not configured');
    }

    // Verify signature using constant-time comparison to prevent timing attacks
    const sign = sanitizedOrderIdRazorpay + '|' + sanitizedPaymentId;
    const expectedSign = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(sign)
      .digest('hex');

    // Use crypto.timingSafeEqual for constant-time comparison (prevents timing attacks)
    const receivedBuffer = Buffer.from(sanitizedSignature, 'hex');
    const expectedBuffer = Buffer.from(expectedSign, 'hex');
    
    // If lengths don't match, signature is invalid
    if (receivedBuffer.length !== expectedBuffer.length) {
      console.error('[Verify Payment] FAILED - Signature length mismatch');
      return NextResponse.json(
        { success: false, message: 'Payment verification failed' },
        { status: 400 }
      );
    }

    const signatureMatch = crypto.timingSafeEqual(receivedBuffer, expectedBuffer);

    // console.log('[Verify Payment] Signature check:', {
    //   match: signatureMatch,
    //   orderId: sanitizedOrderId
    // });

    if (signatureMatch) {
      // Payment verified successfully
      // console.log('[Verify Payment] SUCCESS:', {
      //   orderId: sanitizedOrderId,
      //   paymentId: sanitizedPaymentId.substring(0, 10) + '...',
      //   razorpayOrderId: sanitizedOrderIdRazorpay.substring(0, 10) + '...',
      // });

      // After successful verification, call public API to update payment
      // TODO: Add idempotency check - verify order hasn't already been paid
      try {
        const apiBase = PUBLIC_API_BASE_URL.replace(/\/$/, '');
        const updateUrl = `${apiBase}/checkout/update-payment`;

        // Add timeout to prevent hanging requests
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

        const updateResp = await fetch(updateUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            orderId: sanitizedOrderId,
            paymentId: sanitizedPaymentId,
            razorpayOrderId: sanitizedOrderIdRazorpay,
            razorpaySignature: sanitizedSignature,
            paymentStatus: 'paid',
          }),
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        const updateJson = await updateResp.json().catch(() => null);

        if (updateResp.ok && (updateJson?.status === 'success' || updateJson?.success)) {
          //console.log('[Verify Payment] update-payment success:', updateJson);

          try {
            // Fetch order with timeout
            const orderController = new AbortController();
            const orderTimeoutId = setTimeout(() => orderController.abort(), 5000); // 5 second timeout

            const orderResp = await fetch(`${apiBase}/order/${encodeURIComponent(sanitizedOrderId)}`, {
              method: 'GET',
              headers: { 'Content-Type': 'application/json' },
              signal: orderController.signal,
            });

            clearTimeout(orderTimeoutId);
            const orderJson = await orderResp.json().catch(() => null);
            const mobile =
              orderJson?.data?.customerPhone ||
              orderJson?.data?.customerMobile ||
              orderJson?.customerPhone ||
              orderJson?.customerPhoneNumber ||
              null;

            if (orderResp.ok && mobile) {
              // Use existing approved DLT booking template (already working)
              const smsResult = await sendBookingConfirmationSMS(String(mobile));
              if (smsResult.status !== 'success') {
                console.error('[Verify Payment] Payment SMS failed:', smsResult);
              } else {
                console.log('[Verify Payment] Payment SMS sent:', smsResult);
              }
            } else {
              console.error('[Verify Payment] Could not determine mobile for payment SMS:', {
                orderFetchOk: orderResp.ok,
                mobilePresent: Boolean(mobile),
                orderId,
              });
            }
          } catch (smsErr) {
            console.error('[Verify Payment] Error sending payment SMS:', smsErr);
          }

          return NextResponse.json({
            success: true,
            message: 'Payment verified and order updated successfully',
            paymentId: sanitizedPaymentId,
            orderId: sanitizedOrderIdRazorpay,
            update: updateJson,
          });
        } else {
          console.error('[Verify Payment] update-payment failed:', updateResp.status, updateJson);
          return NextResponse.json(
            {
              success: true,
              message: 'Payment verified but updating order failed',
              paymentId: sanitizedPaymentId,
              orderId: sanitizedOrderIdRazorpay,
              update: updateJson,
            },
            { status: 502 }
          );
        }
      } catch (err) {
        console.error('[Verify Payment] Error calling update-payment API:', err);
        return NextResponse.json(
          {
            success: true,
            message: 'Payment verified but updating order failed due to internal error',
            paymentId: sanitizedPaymentId,
            orderId: sanitizedOrderIdRazorpay,
            error: err instanceof Error ? (err.name === 'AbortError' ? 'Request timeout' : err.message) : String(err),
          },
          { status: 502 }
        );
      }
    } else {
      // Payment verification failed - don't log sensitive data
      console.error('[Verify Payment] FAILED - Signature mismatch');
      return NextResponse.json(
        { success: false, message: 'Payment verification failed' },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('[Verify Payment] Error:', error);
    return NextResponse.json(
      { success: false, message: 'Payment verification error', error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}