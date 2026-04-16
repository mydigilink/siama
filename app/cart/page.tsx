'use client';

import { useState } from 'react';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import Image from 'next/image';
import Header from '@/components/mainwebsite/header';
import Footer from '@/components/mainwebsite/footer';
import MobileVerificationModal from '@/components/mainwebsite/services/MobileVerificationModal';
import styles from './cart.module.scss';

export default function CartPage() {
  const { cart, userMobile, removeFromCart, updateQuantity, getCartTotal, getCartCount, clearCart, setUserMobile } = useCart();
  const { user } = useAuth();
  const [showMobileVerification, setShowMobileVerification] = useState(false);

  // Handle potential undefined functions
  const safeGetCartCount = getCartCount || (() => 0);
  const safeGetCartTotal = getCartTotal || (() => 0);

  const handleQuantityChange = (serviceId: string, sessionId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(serviceId, sessionId);
    } else {
      updateQuantity(serviceId, sessionId, newQuantity);
    }
  };

  const handleRemoveItem = (serviceId: string, sessionId: string) => {
    removeFromCart(serviceId, sessionId);
  };

  const handleCheckout = () => {
    if (!userMobile) {
      // Show mobile verification modal if not verified
      setShowMobileVerification(true);
    } else {
      // Proceed to checkout if already verified
      window.location.href = '/checkout';
    }
  };

  const handleMobileVerified = (mobile: string) => {
    setUserMobile(mobile);
    setShowMobileVerification(false);
    // After verification, proceed to checkout
    setTimeout(() => {
      window.location.href = '/checkout';
    }, 500);
  };

  if (cart.length === 0) {
    return (
      <div>
        <Header />
        <div className={styles.emptyCart}>
          <div className={styles.emptyCartContent}>
            <div className={styles.emptyCartIcon}>
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                <circle cx="9" cy="21" r="1"></circle>
                <circle cx="20" cy="21" r="1"></circle>
                <path d="m1 1 4 4h15l-1 7H6"></path>
              </svg>
            </div>
            <h2>Your cart is empty</h2>
            <p>Add some services to get started</p>
            <Link href="/services" className={styles.browseServicesBtn}>
              Browse Services
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div>
      <Header />
      <div className={styles.cartPage}>
        <div className={styles.container}>
          <div className={styles.header}>
            <div className={styles.headerMain}>
              <h1>Your Cart</h1>
              <div className={styles.cartStats}>
                <span className={styles.itemCount}>{safeGetCartCount()} items</span>
                <div className={styles.priceBreakdown}>
                  <span className={styles.subtotal}>₹{safeGetCartTotal().toLocaleString()}</span>
                  <span className={styles.taxInfo}>+ GST 18%</span>
                  <span className={styles.totalAmount}>₹{(safeGetCartTotal() * 1.18).toFixed(0)}</span>
                </div>
              </div>
            </div>

            {cart.length > 0 && (
              <div className={styles.cartPreview}>
                <div className={styles.previewItems}>
                  {cart.slice(0, 5).map((item, index) => (
                    <div key={`${item.serviceId}-${item.sessionId}`} className={styles.previewItem}>
                      <div className={styles.previewImage}>
                        {item.image ? (
                          <Image
                            src={item.image}
                            alt={item.serviceName}
                            width={32}
                            height={32}
                            style={{ objectFit: 'cover' }}
                          />
                        ) : (
                          <div className={styles.previewPlaceholder}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                              <circle cx="9" cy="9" r="2"></circle>
                              <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"></path>
                            </svg>
                          </div>
                        )}
                      </div>
                      <div className={styles.previewInfo}>
                        <span className={styles.previewName}>{item.serviceName}</span>
                        <span className={styles.previewQty}>x{item.quantity}</span>
                      </div>
                    </div>
                  ))}
                  {cart.length > 5 && (
                    <div className={styles.moreItems}>
                      +{cart.length - 5} more
                    </div>
                  )}
                </div>
              </div>
            )}

            {userMobile ? (
              <div className={styles.userInfo}>
                <span className={styles.verified}>✅ Mobile: {userMobile}</span>
                {user?.name && <span className={styles.userName}>👤 {user.name}</span>}
              </div>
            ) : (
              <div className={styles.userInfo}>
                <span className={styles.warning}>⚠️ Mobile verification required</span>
                {user?.name && <span className={styles.userName}>👤 {user.name}</span>}
              </div>
            )}
          </div>

          <div className={styles.cartContent}>
            <div className={styles.cartItems}>
              {cart.map((item) => (
                <div key={`${item.serviceId}-${item.sessionId}`} className={styles.cartItem}>
                  <div className={styles.itemImage}>
                    {item.image ? (
                      <Image
                        src={item.image}
                        alt={item.serviceName}
                        width={60}
                        height={60}
                        style={{ objectFit: 'cover' }}
                      />
                    ) : (
                      <div className={styles.placeholderImage}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                          <circle cx="9" cy="9" r="2"></circle>
                          <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"></path>
                        </svg>
                      </div>
                    )}
                  </div>

                  <div className={styles.itemDetails}>
                    <h3 className={styles.itemTitle}>{item.serviceName}</h3>
                    <p className={styles.sessionInfo}>
                      {item.sessionName}
                    </p>
                    <div className={styles.itemPricing}>
                      <div className={styles.priceBreakdown}>
                        <span className={styles.originalPrice}>₹{(item.originalPrice || item.price || 0).toLocaleString()}</span>
                        {(item.discount || 0) > 0 && (
                          <span className={styles.discountAmount}>-₹{(item.discount || 0).toLocaleString()}</span>
                        )}
                        <span className={styles.finalPrice}>₹{(item.finalPrice || item.price || 0).toLocaleString()}</span>
                      </div>
                      <span className={styles.itemTotal}>₹{((item.finalPrice || item.price || 0) * item.quantity).toLocaleString()}</span>
                    </div>
                  </div>

                  <div className={styles.itemControls}>
                    <div className={styles.quantityControls}>
                      <button
                        onClick={() => handleQuantityChange(item.serviceId, item.sessionId, item.quantity - 1)}
                        className={styles.quantityBtn}
                        disabled={item.quantity <= 1}
                        aria-label="Decrease quantity"
                      >
                        <svg width="12" height="12" viewBox="0 0 20 20" fill="none">
                          <path d="M5 10H15" stroke="currentColor" strokeWidth="2"/>
                        </svg>
                      </button>
                      <span className={styles.quantity}>{item.quantity}</span>
                      <button
                        onClick={() => handleQuantityChange(item.serviceId, item.sessionId, item.quantity + 1)}
                        className={styles.quantityBtn}
                        aria-label="Increase quantity"
                      >
                        <svg width="12" height="12" viewBox="0 0 20 20" fill="none">
                          <path d="M10 5V15M5 10H15" stroke="currentColor" strokeWidth="2"/>
                        </svg>
                      </button>
                    </div>

                    <div className={styles.itemActions}>
                      <div className={styles.itemTotal}>
                        ₹{((item.finalPrice || item.price || 0) * item.quantity).toLocaleString()}
                      </div>
                      <button
                        onClick={() => handleRemoveItem(item.serviceId, item.sessionId)}
                        className={styles.removeBtn}
                        aria-label="Remove item"
                      >
                        <svg width="14" height="14" viewBox="0 0 20 20" fill="none">
                          <path d="M6 6L14 14M6 14L14 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className={styles.cartSummary}>
              <div className={styles.summaryCard}>
                <h3>Order Summary</h3>

                <div className={styles.summaryRow}>
                  <span>Subtotal ({safeGetCartCount()} items)</span>
                  <span>₹{safeGetCartTotal().toLocaleString()}</span>
                </div>

                <div className={styles.summaryRow}>
                  <span>Discount</span>
                  <span className={styles.discountAmount}>-₹{cart.reduce((total, item) => total + ((item.discount || 0) * item.quantity), 0).toLocaleString()}</span>
                </div>

                <div className={styles.summaryRow}>
                  <span>Delivery</span>
                  <span>Free</span>
                </div>

                <hr />

                <div className={styles.summaryRow}>
                  <span>Amount before tax</span>
                  <span>₹{safeGetCartTotal().toLocaleString()}</span>
                </div>

                <div className={styles.summaryRow}>
                  <span>GST (18%)</span>
                  <span>₹{(safeGetCartTotal() * 0.18).toFixed(0)}</span>
                </div>

                <hr />

                <div className={`${styles.summaryRow} ${styles.total}`}>
                  <span>Total Amount</span>
                  <span>₹{(safeGetCartTotal() * 1.18).toFixed(0)}</span>
                </div>

                <div className={styles.checkoutSection}>
                  <button onClick={handleCheckout} className={styles.checkoutBtn}>
                    Proceed to Checkout
                  </button>

                  <button
                    onClick={clearCart}
                    className={styles.clearCartBtn}
                  >
                    Clear Cart
                  </button>
                </div>
              </div>

              {userMobile ? (
                <div className={styles.mobileInfo}>
                  <p>📱 Mobile: {userMobile}</p>
                  <small>✅ OTP verified for this session</small>
                </div>
              ) : (
                <div className={styles.mobileInfo}>
                  <p>📱 Mobile verification required</p>
                  <small>⚠️ Please verify your mobile to proceed with checkout</small>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />

      {/* Mobile Verification Modal */}
      <MobileVerificationModal
        isOpen={showMobileVerification}
        onClose={() => setShowMobileVerification(false)}
        onVerified={handleMobileVerified}
        userType={user ? 'logged-in' : 'guest'}
      />
    </div>
  );
}