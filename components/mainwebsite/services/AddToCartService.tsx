'use client';

import { useState, useEffect } from 'react';
import { useCart } from '@/contexts/CartContext';
import { getPublicProductSessions, type PublicProductSession } from '@/utils/api/productSessions';
import styles from './AddToCartService.module.scss';

interface AddToCartServiceProps {
  service: {
    _id: string;
    name: string;
    service_charge?: number;
    consult_charge?: number;
    estimate_time?: string;
    image?: string;
  };
  verifiedMobile: string;
}

export default function AddToCartService({ service, verifiedMobile }: AddToCartServiceProps) {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [sessionOptions, setSessionOptions] = useState<PublicProductSession[]>([]);
  const [selectedSession, setSelectedSession] = useState<PublicProductSession | null>(null);
  const [loadingSessions, setLoadingSessions] = useState(false);

  // Fetch session pricing options if productId is available
  useEffect(() => {
    const fetchSessions = async () => {
      // Use service._id directly as productId (MongoDB ObjectId string)
      const productId = service._id;
      
      if (productId) {
        setLoadingSessions(true);
        try {
          const sessions = await getPublicProductSessions(productId);
          setSessionOptions(sessions);
          // Auto-select first session if available
          if (sessions.length > 0) {
            setSelectedSession(sessions[0]);
          }
        } catch (error) {
          console.error('Failed to load session options:', error);
          // Silently fail - will show regular pricing
        } finally {
          setLoadingSessions(false);
        }
      }
    };

    fetchSessions();
  }, [service._id]);

  const handleAddToCart = () => {
    setIsAdding(true);
    
    try {
      // Prepare cart item
      const originalPrice = getOriginalPrice();
      const finalPrice = getCurrentPrice();
      const discountAmount = getDiscountAmount();

      const cartItem = {
        serviceId: service._id,
        serviceName: service.name,
        sessionId: selectedSession?.sessionId.toString() || 'single',
        sessionName: selectedSession
          ? `${selectedSession.count} Session${selectedSession.count > 1 ? 's' : ''}`
          : 'Single Session',
        quantity: quantity,
        originalPrice: originalPrice,
        discount: discountAmount,
        finalPrice: finalPrice,
        price: finalPrice, // Keep for backward compatibility
        image: service.image,
      };

      // Add to cart using CartContext
      addToCart(cartItem);
      
      // Show success modal
      setIsAdding(false);
      setShowSuccessModal(true);
    } catch (error) {
      console.error('Error adding to cart:', error);
      setIsAdding(false);
    }
  };

  const incrementQuantity = () => {
    setQuantity(prev => prev + 1);
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  const handleGoToCart = () => {
    setShowSuccessModal(false);
    window.location.href = '/cart';
  };

  const handleContinueAdding = () => {
    setShowSuccessModal(false);
    // Reset quantity and allow adding another session
    setQuantity(1);
    // Optionally reset selected session to first option
    if (sessionOptions.length > 0) {
      setSelectedSession(sessionOptions[0]);
    }
  };

  const handleCloseModal = () => {
    setShowSuccessModal(false);
  };

  // Calculate price based on selected session or regular pricing
  const getCurrentPrice = () => {
    if (selectedSession) {
      return parseFloat(selectedSession.finalPrice);
    }
    return service.service_charge || 0;
  };

  const getOriginalPrice = () => {
    if (selectedSession) {
      return parseFloat(selectedSession.price);
    }
    return service.service_charge || 0;
  };

  const getDiscountAmount = () => {
    if (selectedSession) {
      return parseFloat(selectedSession.discountPrice) || 0;
    }
    return 0;
  };

  const totalPrice = getCurrentPrice() * quantity;

  return (
    <div className={styles.addToCartSection}>
      <div className={styles.container}>
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h2 className={styles.title}>Book Your Service</h2>
            <p className={styles.subtitle}>Add to cart and complete your booking</p>
          </div>

          <div className={styles.cardBody}>
            {/* Session Options */}
            {sessionOptions.length > 0 && (
              <div className={styles.sessionOptions}>
                <h3 className={styles.sessionOptionsTitle}>Choose Your Package</h3>
                <div className={styles.sessionGrid}>
                  {sessionOptions.map((session) => (
                    <div
                      key={session.sessionId}
                      className={`${styles.sessionCard} ${selectedSession?.sessionId === session.sessionId ? styles.sessionCardActive : ''}`}
                      onClick={() => setSelectedSession(session)}
                    >
                      <div className={styles.sessionCardHeader}>
                        <span className={styles.sessionCount}>{session.count} Session{session.count > 1 ? 's' : ''}</span>
                        {session.discount > 0 && (
                          <span className={styles.sessionDiscount}>-{session.discount}%</span>
                        )}
                      </div>
                      <div className={styles.sessionPricing}>
                        {session.discount > 0 && (
                          <span className={styles.sessionOriginalPrice}>₹{parseFloat(session.price).toLocaleString('en-IN')}</span>
                        )}
                        <span className={styles.sessionFinalPrice}>₹{parseFloat(session.finalPrice).toLocaleString('en-IN')}</span>
                      </div>
                      <div className={styles.sessionPerSession}>
                        ₹{session.perSession.toLocaleString('en-IN')} per session
                      </div>
                      {selectedSession?.sessionId === session.sessionId && (
                        <div className={styles.sessionSelected}>
                          <svg width="14" height="14" viewBox="0 0 20 20" fill="none">
                            <path d="M16.6667 5L7.50004 14.1667L3.33337 10" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {loadingSessions && (
              <div className={styles.sessionOptionsLoader}>
                <div className={styles.spinner}></div>
                <span>Loading package options...</span>
              </div>
            )}

            <div className={styles.priceSection}>
              <div className={styles.priceInfo}>
                <span className={styles.priceLabel}>
                  {selectedSession ? `Package Price (${selectedSession.count} sessions)` : 'Service Price'}
                </span>
                <span className={styles.priceAmount}>
                  {selectedSession 
                    ? `₹${parseFloat(selectedSession.finalPrice).toLocaleString('en-IN')}`
                    : service.service_charge ? `₹${service.service_charge}` : 'Price on request'
                  }
                </span>
                {selectedSession && selectedSession.discount > 0 && (
                  <span className={styles.priceSavings}>
                    You save ₹{parseFloat(selectedSession.discountPrice).toLocaleString('en-IN')} ({selectedSession.discount}%)
                  </span>
                )}
              </div>
              
              {service.consult_charge && (
                <div className={styles.consultInfo}>
                  <span className={styles.consultLabel}>Consultation Fee</span>
                  <span className={styles.consultAmount}>₹{service.consult_charge}</span>
                </div>
              )}
            </div>

            <div className={styles.quantitySection}>
              <label className={styles.quantityLabel}>
                {selectedSession ? 'Number of Packages' : 'Number of Sessions'}
              </label>
              <div className={styles.quantityControls}>
                <button 
                  className={styles.quantityButton}
                  onClick={decrementQuantity}
                  disabled={quantity <= 1}
                  aria-label="Decrease quantity"
                >
                  <svg width="14" height="14" viewBox="0 0 20 20" fill="none">
                    <path d="M5 10H15" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
                  </svg>
                </button>
                <span className={styles.quantityValue}>{quantity}</span>
                <button 
                  className={styles.quantityButton}
                  onClick={incrementQuantity}
                  aria-label="Increase quantity"
                >
                  <svg width="14" height="14" viewBox="0 0 20 20" fill="none">
                    <path d="M10 5V15M5 10H15" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
                  </svg>
                </button>
              </div>
            </div>

            <div className={styles.totalSection}>
              <div className={styles.totalRow}>
                <span className={styles.totalLabel}>Total Amount</span>
                <span className={styles.totalAmount}>
                  {totalPrice > 0 ? `₹${totalPrice.toLocaleString('en-IN')}` : 'N/A'}
                </span>
              </div>
              {service.estimate_time && (
                <div className={styles.estimateRow}>
                  <span className={styles.estimateLabel}>Estimated Duration</span>
                  <span className={styles.estimateValue}>{service.estimate_time}</span>
                </div>
              )}
            </div>

            <button 
              className={`${styles.addToCartButton} ${isAdding ? styles.loading : ''}`}
              onClick={handleAddToCart}
              disabled={isAdding || (getCurrentPrice() === 0)}
            >
              {isAdding ? (
                <>
                  <svg className={styles.spinner} width="20" height="20" viewBox="0 0 20 20">
                    <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="2" fill="none" strokeDasharray="50" strokeDashoffset="25" />
                  </svg>
                  Adding...
                </>
              ) : (
                <>
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M2.5 3.33334H4.16667L6.40001 13.9917C6.47637 14.3753 6.68509 14.72 6.98975 14.9653C7.29441 15.2105 7.6752 15.3408 8.06667 15.3333H15.5C15.8915 15.3408 16.2723 15.2105 16.5769 14.9653C16.8816 14.72 17.0903 14.3753 17.1667 13.9917L18.3333 7.50001H5M8.33334 18.3333C8.33334 18.7936 7.96024 19.1667 7.50001 19.1667C7.03977 19.1667 6.66667 18.7936 6.66667 18.3333C6.66667 17.8731 7.03977 17.5 7.50001 17.5C7.96024 17.5 8.33334 17.8731 8.33334 18.3333ZM16.6667 18.3333C16.6667 18.7936 16.2936 19.1667 15.8333 19.1667C15.3731 19.1667 15 18.7936 15 18.3333C15 17.8731 15.3731 17.5 15.8333 17.5C16.2936 17.5 16.6667 17.8731 16.6667 18.3333Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Add to Cart
                </>
              )}
            </button>

            <div className={styles.features}>
              <div className={styles.feature}>
                <svg className={styles.featureIcon} width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span>100% Safe & Hygienic</span>
              </div>
              <div className={styles.feature}>
                <svg className={styles.featureIcon} width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M12 8V12L15 15M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span>Flexible Scheduling</span>
              </div>
              <div className={styles.feature}>
                <svg className={styles.featureIcon} width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M17 8L21 12M21 12L17 16M21 12H9M9 16L5 20M5 20L1 16M5 20L5 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span>Easy Cancellation</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className={styles.modalOverlay} onClick={handleCloseModal}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <div className={styles.successIcon}>
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="#10B981" strokeWidth="2"/>
                  <path d="M8 12L11 15L16 9" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h3 className={styles.modalTitle}>Added to Cart Successfully!</h3>
              <p className={styles.modalSubtitle}>
                {selectedSession 
                  ? `${selectedSession.count} Session${selectedSession.count > 1 ? 's' : ''} package added to your cart`
                  : 'Service added to your cart'
                }
              </p>
            </div>

            <div className={styles.modalBody}>
              <div className={styles.cartSummary}>
                <div className={styles.summaryItem}>
                  <span>Service:</span>
                  <span>{service.name}</span>
                </div>
                <div className={styles.summaryItem}>
                  <span>Package:</span>
                  <span>{selectedSession ? `${selectedSession.count} Sessions` : 'Single Session'}</span>
                </div>
                <div className={styles.summaryItem}>
                  <span>Quantity:</span>
                  <span>{quantity}</span>
                </div>
                <div className={styles.summaryTotal}>
                  <span>Total:</span>
                  <span>₹{totalPrice.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>

            <div className={styles.modalActions}>
              <button 
                className={styles.continueButton}
                onClick={handleContinueAdding}
              >
                <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
                  <path d="M10 5V15M5 10H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
                Continue Adding More
              </button>
              <button 
                className={styles.goToCartButton}
                onClick={handleGoToCart}
              >
                <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
                  <path d="M2.5 3.33334H4.16667L6.40001 13.9917C6.47637 14.3753 6.68509 14.72 6.98975 14.9653C7.29441 15.2105 7.6752 15.3408 8.06667 15.3333H15.5C15.8915 15.3408 16.2723 15.2105 16.5769 14.9653C16.8816 14.72 17.0903 14.3753 17.1667 13.9917L18.3333 7.50001H5M8.33334 18.3333C8.33334 18.7936 7.96024 19.1667 7.50001 19.1667C7.03977 19.1667 6.66667 18.7936 6.66667 18.3333C6.66667 17.8731 7.03977 17.5 7.50001 17.5C7.96024 17.5 8.33334 17.8731 8.33334 18.3333ZM16.6667 18.3333C16.6667 18.7936 16.2936 19.1667 15.8333 19.1667C15.3731 19.1667 15 18.7936 15 18.3333C15 17.8731 15.3731 17.5 15.8333 17.5C16.2936 17.5 16.6667 17.8731 16.6667 18.3333Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Go to Cart
              </button>
            </div>

            <button 
              className={styles.modalClose}
              onClick={handleCloseModal}
              aria-label="Close modal"
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M15 5L5 15M5 5L15 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
