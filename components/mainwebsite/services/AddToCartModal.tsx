'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { updateProfile } from '@/utils/api/public';
import AddToCartService from './AddToCartService';
import MobileVerificationModal from './MobileVerificationModal';
import styles from './AddToCartModal.module.scss';

interface AddToCartModalProps {
  isOpen: boolean;
  onClose: () => void;
  service: {
    _id: string;
    name: string;
    service_charge?: number;
    consult_charge?: number;
    estimate_time?: string;
    image?: string;
  };
}

export default function AddToCartModal({ isOpen, onClose, service }: AddToCartModalProps) {
  const { user, token, refreshUser } = useAuth();
  const { userMobile, setUserMobile } = useCart();
  const [showMobileVerification, setShowMobileVerification] = useState(false);
  const [showMobileChoice, setShowMobileChoice] = useState(false);
  const [existingMobile, setExistingMobile] = useState<string | null>(null);
  const [verifiedMobile, setVerifiedMobile] = useState<string | null>(null);
  
  // Check if mobile verification is needed when modal opens
  useEffect(() => {
    if (isOpen) {
      console.log('[AddToCartModal] Modal opened, user:', user?.phone || 'no phone', 'userMobile:', userMobile);
      // Check if user is logged in and has phone, or if userMobile is stored in context
      const mobile = user?.phone || userMobile || null;
      setExistingMobile(mobile);

      if (mobile) {
        // Mobile already available - ask user to use it or change
        setVerifiedMobile(null);
        setShowMobileVerification(false);
        setShowMobileChoice(true);
      } else {
        // No stored mobile - show verification modal
        setVerifiedMobile(null);
        setShowMobileChoice(false);
        setShowMobileVerification(true);
      }
    } else {
      // Reset state when modal closes
      setShowMobileVerification(false);
      setShowMobileChoice(false);
      setExistingMobile(null);
      setVerifiedMobile(null);
    }
  }, [isOpen, user?.phone, userMobile]);

  const handleUseExistingMobile = () => {
    if (!existingMobile) return;
    setVerifiedMobile(existingMobile);
    setShowMobileChoice(false);
    setShowMobileVerification(false);
  };

  const handleChangeMobile = () => {
    setVerifiedMobile(null);
    setShowMobileChoice(false);
    setShowMobileVerification(true);
  };

  const handleMobileVerified = async (mobile: string) => {
    console.log('[AddToCartModal] Mobile verified:', mobile);
    setVerifiedMobile(mobile);
    setShowMobileVerification(false);
    setShowMobileChoice(false);
    
    // Store mobile in cart context (this will also save to localStorage)
    setUserMobile(mobile);
    
    // If user is logged in, update their profile with the mobile number
    if (user && token && !user.phone) {
      try {
        console.log('[AddToCartModal] Updating user profile with mobile');
        const result = await updateProfile(token, { phone: mobile });
        if (result.status === 'success') {
          console.log('[AddToCartModal] Profile updated successfully');
          // Refresh user data in AuthContext
          await refreshUser();
        }
      } catch (error) {
        console.error('[AddToCartModal] Failed to update profile:', error);
        // Continue anyway - user can still add to cart
      }
    }
    // Body scroll will remain locked as we're transitioning to cart modal
  };

  const handleCloseMobileVerification = () => {
    setShowMobileVerification(false);
    onClose(); // Close the entire modal if user cancels verification
  };

  // Handle escape key press
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  console.log('[AddToCartModal] Rendering:', {
    showMobileVerification,
    showMobileChoice,
    existingMobile,
    verifiedMobile,
    shouldShowCart: !showMobileVerification && !showMobileChoice && !!verifiedMobile,
  });

  // Handle backdrop click
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
     // onClose();
    }
  };

  return (
    <>
      {/* Mobile Verification Modal - shown first if needed */}
      <MobileVerificationModal
        isOpen={showMobileVerification}
        onClose={handleCloseMobileVerification}
        onVerified={handleMobileVerified}
        userType={user ? 'logged-in' : 'guest'}
      />

      {/* Mobile Choice Modal - shown if mobile already exists */}
      {!showMobileVerification && showMobileChoice && existingMobile && (
        <div className={styles.modalOverlay} onClick={handleBackdropClick}>
          <div className={styles.modalContainer}>
            <div className={styles.modalHeader}>
              <button
                className={styles.closeButton}
                onClick={onClose}
                aria-label="Close modal"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className={styles.choiceBody}>
              <h3 className={styles.choiceTitle}>Mobile number already verified</h3>
              <p className={styles.choiceSubtitle}>
                We found a verified mobile number for this session. You can use it, or change to a different number.
              </p>
              <div className={styles.choiceNumber}>
                +91 <strong>{existingMobile}</strong>
              </div>
              <div className={styles.choiceActions}>
                <button className={styles.primaryButton} onClick={handleUseExistingMobile}>
                  Use this number
                </button>
                <button className={styles.secondaryButton} onClick={handleChangeMobile}>
                  Change number
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add to Cart Modal - shown after mobile selection/verification */}
      {!showMobileVerification && !showMobileChoice && verifiedMobile && (
        <div className={styles.modalOverlay} onClick={handleBackdropClick}>
          <div className={styles.modalContainer}>
            <div className={styles.modalHeader}>
              <button 
                className={styles.closeButton} 
                onClick={onClose}
                aria-label="Close modal"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className={styles.modalContent}>
              <AddToCartService service={service} verifiedMobile={verifiedMobile} />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
