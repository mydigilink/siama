'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import Image from 'next/image';
import Header from '@/components/mainwebsite/header';
import Footer from '@/components/mainwebsite/footer';
import PaymentModal from '@/components/mainwebsite/checkout/PaymentModal';
import styles from './checkout.module.scss';

interface CheckoutFormData {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  sessionDate: string;
  sessionTime: string;
}

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, userMobile, getCartTotal, getCartCount, clearCart } = useCart();
  const { user } = useAuth();

  // Fallback to ensure API URL is always available
  const PUBLIC_API_BASE_URL = process.env.NEXT_PUBLIC_PUBLIC_API_BASE_URL || 'https://api.siama.in/api/v1/public';

  const [formData, setFormData] = useState<CheckoutFormData>({
    name: user?.name || '',
    email: user?.email || '',
    phone: userMobile || user?.phone || '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    sessionDate: '',
    sessionTime: '',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [orderId, setOrderId] = useState<string>('');
  const [errors, setErrors] = useState<Partial<CheckoutFormData>>({});
const [couponCode, setCouponCode] = useState('');
const [appliedCoupon, setAppliedCoupon] = useState<any>(null);
const [couponError, setCouponError] = useState('');
const [couponLoading, setCouponLoading] = useState(false);
const applyCoupon = async () => {
  if (!couponCode.trim()) {
    setCouponError('Please enter coupon code');
    return;
  }

  setCouponLoading(true);
  setCouponError('');

  try {
    const res = await fetch(`/api/coupons/validate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        code: couponCode,
        cartTotal: getCartTotal(),
        items: cart,
      }),
    });

    const data = await res.json();

    if (data.status === 'success') {
      setAppliedCoupon(data.data);
    } else {
      setCouponError(data.message || 'Invalid coupon');
    }
  } catch {
    setCouponError('Failed to apply coupon');
  } finally {
    setCouponLoading(false);
  }
};

const removeCoupon = () => {
  setAppliedCoupon(null);
  setCouponCode('');
};

const getCouponDiscount = () => {
  if (!appliedCoupon) return 0;

  let discount = 0;

  if (appliedCoupon.type === 'percentage') {
    discount = (getCartTotal() * appliedCoupon.value) / 100;

    if (appliedCoupon.maxDiscount) {
      discount = Math.min(discount, appliedCoupon.maxDiscount);
    }
  } else {
    discount = appliedCoupon.value;
  }

  return Math.min(discount, getCartTotal());
};
const subtotal = getCartTotal();
const couponDiscount = getCouponDiscount();
const discountedTotal = subtotal - couponDiscount;
const tax = discountedTotal * 0.18;
const finalTotal = discountedTotal + tax;
  const formatNumber = (value: number) => {
    // deterministic Indian grouping for integers/amounts
    try {
      const str = Math.round(value).toString();
      if (str.length <= 3) return str;
      const lastThree = str.slice(-3);
      const rest = str.slice(0, -3);
      const restWithCommas = rest.replace(/\B(?=(?:\d{2})+(?!\d))/g, ',');
      return restWithCommas + ',' + lastThree;
    } catch (e) {
      return String(value);
    }
  };

  // Redirect if no items in cart
  useEffect(() => {
    // Only redirect to cart when there are no items and payment modal is not open
    if (cart.length === 0 && !showPaymentModal) {
      router.push('/cart');
    }
  }, [cart.length, router, showPaymentModal]);

  // Get minimum date (today)
  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  // Get minimum time for today
  const getMinTime = () => {
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();

    // If it's after 8 PM, don't allow today
    if (currentHour >= 20) {
      return null; // No time slots available for today
    }

    // Minimum time is 9 AM or current time + 2 hours, whichever is later
    const minHour = Math.max(9, currentHour + 2);
    return `${minHour.toString().padStart(2, '0')}:${currentMinute.toString().padStart(2, '0')}`;
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<CheckoutFormData> = {};

    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    // Phone is pre-filled and verified, no validation needed
    if (!formData.address.trim()) newErrors.address = 'Address is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.state.trim()) newErrors.state = 'State is required';
    if (!formData.pincode.trim()) newErrors.pincode = 'Pincode is required';
    if (!formData.sessionDate) newErrors.sessionDate = 'Session date is required';
    if (!formData.sessionTime) newErrors.sessionTime = 'Session time is required';

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Phone validation removed - phone is pre-filled and verified

    // Pincode validation
    const pincodeRegex = /^\d{6}$/;
    if (formData.pincode && !pincodeRegex.test(formData.pincode)) {
      newErrors.pincode = 'Please enter a valid 6-digit pincode';
    }

    // Date/Time validation
    if (formData.sessionDate && formData.sessionTime) {
      const selectedDateTime = new Date(`${formData.sessionDate}T${formData.sessionTime}`);
      const now = new Date();

      if (selectedDateTime <= now) {
        newErrors.sessionTime = 'Session time must be in the future';
      }

      // Check if selected date is today and time is valid
      const today = new Date().toISOString().split('T')[0];
      if (formData.sessionDate === today) {
        const minTime = getMinTime();
        if (minTime && formData.sessionTime < minTime) {
          newErrors.sessionTime = `Session time must be at least 2 hours from now (minimum: ${minTime})`;
        }
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Clear error when user starts typing
    if (errors[name as keyof CheckoutFormData]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // Prepare order data
      const orderData = {
        customer: {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          address: {
            street: formData.address,
            city: formData.city,
            state: formData.state,
            pincode: formData.pincode,
          },
        },
        items: cart.map(item => ({
          serviceId: item.serviceId,
          serviceName: item.serviceName,
          sessionId: item.sessionId,
          sessionName: item.sessionName,
          quantity: item.quantity,
          originalPrice: item.originalPrice || item.price || 0,
          discount: item.discount || 0,
          finalPrice: item.finalPrice || item.price || 0,
          price: item.finalPrice || item.price || 0, // Final price for backward compatibility
          total: (item.finalPrice || item.price || 0) * item.quantity,
        })),
        sessionDateTime: `${formData.sessionDate}T${formData.sessionTime}:00`,
        paymentType: 'Online', // Razorpay payment
        paymentStatus: 'pending', // Will be updated after payment
        subtotal: getCartTotal(),
        tax: getCartTotal() * 0.18,
        total: getCartTotal() * 1.18,
      };
      
      // Call checkout API
      const response = await fetch(`${PUBLIC_API_BASE_URL}/checkout/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
      });

      const data = await response.json();

      if (data.status === 'success') {
        setOrderId(data.data.orderId);
        setShowPaymentModal(true);
      } else {
        alert(data.message || 'Failed to create order. Please try again.');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      alert('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePaymentSuccess = async (paymentData: any) => {
    // The server `/api/payment/verify` handles updating the public API.
    // Here we only clear the cart and keep the user on the page so the
    // `PaymentModal` can show the thank-you modal and redirect to invoice.
    try {
      clearCart();
    } catch (err) {
      console.error('Error clearing cart after payment:', err);
    }
  };

  const handlePaymentCancel = () => {
    setShowPaymentModal(false);
  };

  // If cart is empty and payment modal is not open, don't render checkout
  if (cart.length === 0 && !showPaymentModal) {
    return null; // Will redirect in useEffect
  }

  return (
    <div>
      <Header />
      <div className={styles.checkoutPage}>
        <div className={styles.container}>
          <div className={styles.checkoutHeader}>
            <h1>Checkout</h1>
            <Link href="/cart" className={styles.backToCart}>
              ← Back to Cart
            </Link>
          </div>

          <div className={styles.checkoutContent}>
            <form onSubmit={handleSubmit} className={styles.checkoutForm}>
              {/* Customer Information */}
              <div className={styles.formSection}>
                <h2>Customer Information</h2>

                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label htmlFor="name">Full Name *</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className={errors.name ? styles.error : ''}
                      placeholder="Enter your full name"
                    />
                    {errors.name && <span className={styles.errorText}>{errors.name}</span>}
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="email">Email Address *</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={errors.email ? styles.error : ''}
                      placeholder="Enter your email"
                    />
                    {errors.email && <span className={styles.errorText}>{errors.email}</span>}
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="phone">Phone Number (Verified) *</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className={`${errors.phone ? styles.error : ''} ${styles.readOnly}`}
                    placeholder="Enter your phone number"
                    readOnly
                  />
                  {errors.phone && <span className={styles.errorText}>{errors.phone}</span>}
                  <small className={styles.verifiedNote}>📱 Mobile number verified for this order</small>
                </div>
              </div>

              {/* Address Information */}
              <div className={styles.formSection}>
                <h2>Address Information</h2>

                <div className={styles.formGroup}>
                  <label htmlFor="address">Street Address *</label>
                  <textarea
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className={errors.address ? styles.error : ''}
                    placeholder="Enter your complete address"
                    rows={3}
                  />
                  {errors.address && <span className={styles.errorText}>{errors.address}</span>}
                </div>

                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label htmlFor="city">City *</label>
                    <input
                      type="text"
                      id="city"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      className={errors.city ? styles.error : ''}
                      placeholder="Enter city"
                    />
                    {errors.city && <span className={styles.errorText}>{errors.city}</span>}
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="state">State *</label>
                    <input
                      type="text"
                      id="state"
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      className={errors.state ? styles.error : ''}
                      placeholder="Enter state"
                    />
                    {errors.state && <span className={styles.errorText}>{errors.state}</span>}
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="pincode">Pincode *</label>
                    <input
                      type="text"
                      id="pincode"
                      name="pincode"
                      value={formData.pincode}
                      onChange={handleInputChange}
                      className={errors.pincode ? styles.error : ''}
                      placeholder="Enter pincode"
                      maxLength={6}
                    />
                    {errors.pincode && <span className={styles.errorText}>{errors.pincode}</span>}
                  </div>
                </div>
              </div>

              {/* Session Scheduling */}
              <div className={styles.formSection}>
                <h2>Session Scheduling</h2>

                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label htmlFor="sessionDate">Preferred Date *</label>
                    <input
                      type="date"
                      id="sessionDate"
                      name="sessionDate"
                      value={formData.sessionDate}
                      onChange={handleInputChange}
                      min={getMinDate()}
                      className={errors.sessionDate ? styles.error : ''}
                    />
                    {errors.sessionDate && <span className={styles.errorText}>{errors.sessionDate}</span>}
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="sessionTime">Preferred Time *</label>
                    <select
                      id="sessionTime"
                      name="sessionTime"
                      value={formData.sessionTime}
                      onChange={handleInputChange}
                      className={errors.sessionTime ? styles.error : ''}
                    >
                      <option value="">Select time</option>
                      <option value="09:00">9:00 AM</option>
                      <option value="10:00">10:00 AM</option>
                      <option value="11:00">11:00 AM</option>
                      <option value="12:00">12:00 PM</option>
                      <option value="13:00">1:00 PM</option>
                      <option value="14:00">2:00 PM</option>
                      <option value="15:00">3:00 PM</option>
                      <option value="16:00">4:00 PM</option>
                      <option value="17:00">5:00 PM</option>
                      <option value="18:00">6:00 PM</option>
                      <option value="19:00">7:00 PM</option>
                      <option value="20:00">8:00 PM</option>
                    </select>
                    {errors.sessionTime && <span className={styles.errorText}>{errors.sessionTime}</span>}
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className={styles.submitButton}
                disabled={isLoading}
              >
                {isLoading ? 'Processing...' : 'Proceed to Payment'}
              </button>
            </form>

            {/* Order Summary */}
            <div className={styles.orderSummary}>
              <h3>Order Summary</h3>

              <div className={styles.orderItems}>
                {cart.map((item) => (
                  <div key={`${item.serviceId}-${item.sessionId}`} className={styles.orderItem}>
                    <div className={styles.itemInfo}>
                      <h4>{item.serviceName}</h4>
                      <p>{item.sessionName}</p>
                      <div className={styles.itemPricing}>
                        <div className={styles.priceBreakdown}>
                          <span className={styles.originalPrice}>₹{formatNumber(item.originalPrice || item.price || 0)}</span>
                          {(item.discount || 0) > 0 && (
                            <span className={styles.discountAmount}>-₹{formatNumber(item.discount || 0)}</span>
                          )}
                          <span className={styles.finalPrice}>₹{formatNumber(item.finalPrice || item.price || 0)}</span>
                        </div>
                        <span className={styles.quantity}>Qty: {item.quantity}</span>
                      </div>
                    </div>
                    <div className={styles.itemPrice}>
                      ₹{formatNumber((item.finalPrice || item.price || 0) * item.quantity)}
                    </div>
                  </div>
                ))}
              </div>
            <div>


  <div className={styles.priceBlock}>
    <div className={styles.row}>
      <span>Subtotal ({getCartCount()} items)</span>
      <span>₹{formatNumber(subtotal)}</span>
    </div>

    {appliedCoupon && (
      <div className={`${styles.row} ${styles.discountRow}`}>
        <span>Coupon ({appliedCoupon.code})</span>
        <span>-₹{formatNumber(couponDiscount)}</span>
      </div>
    )}

    <div className={styles.row}>
      <span>Delivery</span>
      <span className={styles.free}>Free</span>
    </div>

    <div className={styles.divider} />

    <div className={styles.row}>
      <span>GST (18%)</span>
      <span>₹{formatNumber(tax)}</span>
    </div>

    <div className={styles.divider} />

    <div className={`${styles.row} ${styles.total}`}>
      <span>Total Amount</span>
      <span>₹{formatNumber(finalTotal)}</span>
    </div>
  </div>

  {/* Coupon Section */}
  <div className={styles.couponCard}>
    <h4>Apply Coupon</h4>

    {!appliedCoupon ? (
      <div className={styles.couponInput}>
        <input
          type="text"
          placeholder="Enter coupon code"
          value={couponCode}
          onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
        />
        <button onClick={applyCoupon} disabled={couponLoading}>
          {couponLoading ? 'Applying...' : 'Apply'}
        </button>
      </div>
    ) : (
      <div className={styles.couponApplied}>
        <div>
          <strong>{appliedCoupon.code}</strong>
          <p>
            {appliedCoupon.type === 'percentage'
              ? `${appliedCoupon.value}% OFF`
              : `₹${appliedCoupon.value} OFF`}
          </p>
        </div>
        <button onClick={removeCoupon}>✕</button>
      </div>
    )}

    {couponError && <p className={styles.error}>{couponError}</p>}
  </div>
</div>
            </div>
          </div>
        </div>
      </div>
      <Footer />

      {/* Payment Modal */}
      {showPaymentModal && (
        <PaymentModal
  orderId={orderId}
  amount={finalTotal}
  onSuccess={handlePaymentSuccess}
  onCancel={handlePaymentCancel}
/>
        // <PaymentModal
        //   orderId={orderId}
        //   amount={getCartTotal() * 1.18}
        //   onSuccess={handlePaymentSuccess}
        //   onCancel={handlePaymentCancel}
        // />
      )}
    </div>
  );
}