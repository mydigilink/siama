'use client';

import { useState, useEffect } from 'react';
import styles from './PaymentModal.module.scss';

interface PaymentModalProps {
  orderId: string;
  amount: number;
  onSuccess: (paymentData: any) => void;
  onCancel: () => void;
}

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function PaymentModal({ orderId, amount, onSuccess, onCancel }: PaymentModalProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [invoiceOrderId, setInvoiceOrderId] = useState<string | null>(null);
  const [redirectCountdown, setRedirectCountdown] = useState<number>(10);

  // Load Razorpay script
  useEffect(() => {
    const loadRazorpay = async () => {
      if (window.Razorpay) {
        setRazorpayLoaded(true);
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => setRazorpayLoaded(true);
      script.onerror = () => console.error('Failed to load Razorpay script');
      document.body.appendChild(script);
    };

    loadRazorpay();
  }, []);

  const handlePayment = async () => {
    if (!razorpayLoaded) {
      alert('Payment system is loading. Please try again.');
      return;
    }

    setIsProcessing(true);

    try {
      // Create Razorpay order (this should be done on your backend)
      // Validate amount before creating order
      if (!amount || amount <= 0 || amount > 1000000) {
        throw new Error('Invalid payment amount');
      }

      const orderResponse = await fetch('/api/payment/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId,
          amount: Math.round(amount * 100), // Amount in paisa (convert rupees to paisa)
        }),
      });

      if (!orderResponse.ok) {
        throw new Error(`Failed to create payment order: ${orderResponse.status}`);
      }

      const orderData = await orderResponse.json();

      if (!orderData.success) {
        throw new Error(orderData.message || 'Failed to create payment order');
      }

      // Validate response structure
      if (!orderData.razorpayOrderId || !orderData.amount) {
        throw new Error('Invalid response from payment server');
      }

      // Initialize Razorpay
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "",
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'Siama Beauty Care',
        description: `Payment for Order ${orderId}`,
        order_id: orderData.razorpayOrderId,
        handler: async function (response: any) {
          // Payment successful
          console.log('[Razorpay Success]', response);

          try {
            // Verify payment on backend
            // Validate Razorpay response structure
            if (!response.razorpay_payment_id || !response.razorpay_order_id || !response.razorpay_signature) {
              throw new Error('Invalid payment response from Razorpay');
            }

            const verifyResponse = await fetch('/api/payment/verify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                orderId,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature,
              }),
            });

            if (!verifyResponse.ok) {
              throw new Error(`Payment verification failed: ${verifyResponse.status}`);
            }

            const verifyData = await verifyResponse.json();

            if (verifyData.success) {
              // Use orderId returned from server update if available
              const invoiceId = verifyData.update?.data?.orderId || orderId;
              setInvoiceOrderId(invoiceId);
              setShowSuccessModal(true);

              onSuccess({
                paymentId: response.razorpay_payment_id,
                orderId: response.razorpay_order_id,
                signature: response.razorpay_signature,
                status: 'paid',
              });
            } else {
              throw new Error('Payment verification failed');
            }
          } catch (error) {
            console.error('Payment verification error:', error);
            alert('Payment verification failed. Please contact support.');
          }
        },
        prefill: {
          name: 'Customer Name', // You can get this from user context
          email: 'customer@example.com',
          contact: '9999999999',
        },
        theme: {
          color: '#667eea',
        },
        modal: {
          ondismiss: function() {
            // Payment cancelled
            console.log('[Razorpay Cancelled]');
            handlePaymentFailure('cancelled');
          }
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch (error) {
      console.error('Payment initialization error:', error);
      alert('Failed to initialize payment. Please try again.');
      handlePaymentFailure('failed');
    } finally {
      setIsProcessing(false);
    }
  };

  const openInvoice = () => {
    if (!invoiceOrderId) return;
    // navigate to invoice page
    window.location.href = `/invoice?orderId=${encodeURIComponent(invoiceOrderId)}`;
  };

  // start countdown when success modal opens
  useEffect(() => {
    if (!showSuccessModal) return;
    setRedirectCountdown(10); // Fixed: was 1000, should be 10 seconds
    const timer = setInterval(() => {
      setRedirectCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [showSuccessModal]);

  // when countdown reaches 0, redirect automatically
  useEffect(() => {
    if (showSuccessModal && redirectCountdown <= 0) {
      openInvoice();
    }
  }, [redirectCountdown, showSuccessModal]);

  const handlePaymentFailure = async (status: string) => {
    try {
      // Update payment status as failed/cancelled
      await fetch('/api/payment/update-status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId,
          status,
        }),
      });
    } catch (error) {
      console.error('Failed to update payment status:', error);
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <div className={styles.headerContent}>
            <div className={styles.headerIcon}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="2" y="5" width="20" height="14" rx="2" ry="2"></rect>
                <line x1="2" y1="10" x2="22" y2="10"></line>
              </svg>
            </div>
            <div>
              <h2>Secure Payment</h2>
              <p className={styles.headerSubtitle}>Complete your booking with Razorpay</p>
            </div>
          </div>
          <button onClick={onCancel} className={styles.closeButton} disabled={isProcessing}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className={styles.modalBody}>
          <div className={styles.orderSummary}>
            <div className={styles.summaryHeader}>
              <h3>Order Summary</h3>
            </div>
            <div className={styles.summaryDetails}>
              <div className={styles.summaryRow}>
                <span>Order ID</span>
                <span className={styles.orderId}>{orderId}</span>
              </div>
              <div className={styles.summaryRow}>
                <span>Total Amount</span>
                <span className={styles.amount}>₹{amount.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div className={styles.paymentSection}>
            <div className={styles.paymentHeader}>
              <div className={styles.secureBadge}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                  <circle cx="12" cy="16" r="1"></circle>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                </svg>
                <span>SSL Secured</span>
              </div>
              <div className={styles.razorpayBadge}>
                <span>Powered by</span>
                <div className={styles.razorpayLogo}>
                  <img src="/images/razorpay-logo.png" alt="Razorpay" onError={(e) => {
                    e.currentTarget.parentElement!.innerHTML = '<span>Razorpay</span>';
                  }} />
                </div>
              </div>
            </div>

            <div className={styles.paymentMethods}>
              <h4>Payment Methods</h4>
              <div className={styles.methodGrid}>
                <div className={styles.methodItem}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="2" y="5" width="20" height="14" rx="2"></rect>
                    <line x1="2" y1="10" x2="22" y2="10"></line>
                  </svg>
                  <span>Credit/Debit Cards</span>
                </div>
                <div className={styles.methodItem}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="2" y="2" width="20" height="20" rx="2"></rect>
                    <rect x="6" y="6" width="12" height="12" rx="1"></rect>
                    <path d="M10 10h4v4h-4z"></path>
                  </svg>
                  <span>UPI</span>
                </div>
                <div className={styles.methodItem}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="2" y="3" width="20" height="14" rx="2"></rect>
                    <line x1="8" y1="21" x2="8" y2="17"></line>
                    <line x1="12" y1="21" x2="12" y2="17"></line>
                    <line x1="16" y1="21" x2="16" y2="17"></line>
                  </svg>
                  <span>Net Banking</span>
                </div>
                <div className={styles.methodItem}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"></circle>
                    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
                    <line x1="12" y1="17" x2="12.01" y2="17"></line>
                  </svg>
                  <span>Other Methods</span>
                </div>
              </div>
            </div>

            <div className={styles.paymentNote}>
              
              <p>
                You will be redirected to Razorpay&apos;s secure payment gateway to complete your transaction.
                Your payment information is encrypted and secure.
              </p>
            </div>
          </div>
        </div>

        <div className={styles.modalFooter}>
          <button
            onClick={onCancel}
            className={styles.cancelButton}
            disabled={isProcessing}
          >
            Cancel
          </button>
          <button
            onClick={handlePayment}
            disabled={isProcessing || !razorpayLoaded}
            className={styles.payButton}
          >
            {isProcessing ? (
              <>
                <div className={styles.spinner}></div>
                Processing...
              </>
            ) : razorpayLoaded ? (
              <>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="2" y="5" width="20" height="14" rx="2" ry="2"></rect>
                  <line x1="2" y1="10" x2="22" y2="10"></line>
                </svg>
                Pay ₹{amount.toFixed(2)}
              </>
            ) : (
              <>
                <div className={styles.spinner}></div>
                Loading...
              </>
            )}
          </button>
        </div>
        {showSuccessModal && (
          <div className={styles.successOverlay}>
            <div className={styles.successModal} onClick={e => e.stopPropagation()}>
              <h3>Thank you — payment successful!</h3>
              <p>We will contact you shortly. You will be redirected to your invoice in <strong>{redirectCountdown}</strong> seconds. You can also view or print your invoice below.</p>
              {invoiceOrderId && (
                <p style={{ marginTop: 8, fontSize: 14 }}>
                  Invoice: <strong>Order #{invoiceOrderId}</strong>
                </p>
              )}
              <div className={styles.successActions}>
                <button onClick={openInvoice} className={styles.payButton}>View Invoice</button>
                <button onClick={() => setShowSuccessModal(false)} className={styles.cancelButton}>Close</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}