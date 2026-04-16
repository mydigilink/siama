'use client';

import { useState } from 'react';
import PaymentModal from '@/components/mainwebsite/checkout/PaymentModal';

export default function PaymentTestPage() {
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [testAmount, setTestAmount] = useState(100); // Amount in rupees

  const handlePaymentSuccess = (paymentData: any) => {
    console.log('Payment Success:', paymentData);
    alert(`Payment Successful!\nPayment ID: ${paymentData.paymentId}\nOrder ID: ${paymentData.orderId}`);
    setShowPaymentModal(false);
  };

  const handlePaymentCancel = () => {
    console.log('Payment Cancelled');
    setShowPaymentModal(false);
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '600px', margin: '0 auto' }}>
      <h1>Razorpay Payment Test</h1>
      <p>This page is for testing the Razorpay payment integration.</p>

      <div style={{ marginBottom: '2rem', padding: '1rem', border: '1px solid #ddd', borderRadius: '8px' }}>
        <h3>Test Configuration</h3>
        <p><strong>Mode:</strong> Test/Sandbox</p>
        <p><strong>Key ID:</strong> {process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID }</p>

        <div style={{ marginTop: '1rem' }}>
          <label>
            Test Amount (₹):
            <input
              type="number"
              value={testAmount}
              onChange={(e) => setTestAmount(Number(e.target.value))}
              min="1"
              max="10000"
              style={{ marginLeft: '0.5rem', padding: '0.5rem', width: '100px' }}
            />
          </label>
        </div>
      </div>

      <div style={{ marginBottom: '2rem', padding: '1rem', backgroundColor: '#f0f9ff', border: '1px solid #0ea5e9', borderRadius: '8px' }}>
        <h3>Test Cards</h3>
        <ul style={{ fontSize: '0.9rem' }}>
          <li><strong>Success Card:</strong> 4111 1111 1111 1111</li>
          <li><strong>Failure Card:</strong> 4000 0000 0000 0002</li>
          <li><strong>CVV:</strong> 123</li>
          <li><strong>Expiry:</strong> Any future date (MM/YY)</li>
        </ul>
      </div>

      <button
        onClick={() => setShowPaymentModal(true)}
        style={{
          backgroundColor: '#667eea',
          color: 'white',
          padding: '1rem 2rem',
          border: 'none',
          borderRadius: '8px',
          fontSize: '1.1rem',
          cursor: 'pointer',
          marginBottom: '2rem'
        }}
      >
        Test Payment - ₹{testAmount}
      </button>

      <div style={{ padding: '1rem', backgroundColor: '#fefce8', border: '1px solid #fde047', borderRadius: '8px' }}>
        <h4>Instructions:</h4>
        <ol style={{ fontSize: '0.9rem' }}>
          <li>Click the &quot;Test Payment&quot; button above</li>
          <li>The payment modal will open</li>
          <li>Use the test card numbers provided</li>
          <li>Complete the payment flow</li>
          <li>Check the console for payment data</li>
        </ol>
      </div>

      {showPaymentModal && (
        <PaymentModal
          orderId={`TEST-${Date.now()}`}
          amount={testAmount}
          onSuccess={handlePaymentSuccess}
          onCancel={handlePaymentCancel}
        />
      )}
    </div>
  );
}