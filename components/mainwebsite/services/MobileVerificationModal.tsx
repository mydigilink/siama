"use client";

import React, { useState, useEffect, useRef } from 'react';
import styles from './MobileVerificationModal.module.scss';

// OTP API: same-domain Next.js routes (app/api/otp/send, app/api/otp/verify)
interface MobileVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onVerified: (mobile: string) => void;
  userType?: 'guest' | 'logged-in';
}

type Step = 'mobile' | 'otp';

export default function MobileVerificationModal({
  isOpen,
  onClose,
  onVerified,
  userType = 'guest',
}: MobileVerificationModalProps) {
  const [step, setStep] = useState<Step>('mobile');
  const [mobile, setMobile] = useState('');
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [resendCountdown, setResendCountdown] = useState(0);
  const modalRef = useRef<HTMLDivElement>(null);

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setStep('mobile');
      setMobile('');
      setOtp('');
      setError('');
      setResendCountdown(0);
    }
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  // Resend countdown timer
  useEffect(() => {
    if (resendCountdown > 0) {
      const timer = setTimeout(() => setResendCountdown(resendCountdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCountdown]);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
     // onClose();
    }
  };

  const validateMobile = (value: string): boolean => {
    const mobileRegex = /^[6-9]\d{9}$/;
    return mobileRegex.test(value);
  };

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validateMobile(mobile)) {
      setError('Please enter a valid 10-digit mobile number starting with 6-9');
      return;
    }

    setIsLoading(true);

    try {
      // Get browser/device info
      const browser = typeof navigator !== 'undefined' ? navigator.userAgent : '';
      const device = typeof navigator !== 'undefined' ? (navigator.platform || '') : '';
      // Get IP (optional, fallback to empty string)
      let ip = '';
      try {
        const ipRes = await fetch('https://api.ipify.org?format=json');
        const ipData = await ipRes.json();
        ip = ipData.ip || '';
      } catch {}

      // Only call backend to send OTP; backend will handle usermobilesession API
      const response = await fetch(`/api/otp/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mobile }),
      });
      const data = await response.json();

      if (data.status === 'success') {
        setStep('otp');
        setResendCountdown(60); // 60 seconds countdown
      } else {
        setError(data.message || 'Failed to send OTP. Please try again.');
      }
    } catch (err) {
      setError('Network error. Please check your connection and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (otp.length !== 6) {
      setError('Please enter a valid 6-digit OTP');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`/api/otp/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mobile, otp }),
      });

      const data = await response.json();

      if (data.status === 'success') {
        // Only call onVerified - parent will handle showing the cart modal
        onVerified(mobile);
        // Don't call onClose() here - let parent control the modal flow
      } else {
        setError(data.message || 'Invalid OTP. Please try again.');
        setOtp('');
      }
    } catch (err) {
      setError('Network error. Please check your connection and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (resendCountdown > 0) return;

    setError('');
    setOtp('');
    setIsLoading(true);

    try {
      const response = await fetch(`/api/otp/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mobile }),
      });

      const data = await response.json();

      if (data.status === 'success') {
        setResendCountdown(60);
      } else {
        setError(data.message || 'Failed to resend OTP. Please try again.');
      }
    } catch (err) {
      setError('Network error. Please check your connection and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleMobileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 10);
    setMobile(value);
    setError('');
  };

  const handleOTPChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 6);
    setOtp(value);
    setError('');
  };

  const handleBack = () => {
    setStep('mobile');
    setOtp('');
    setError('');
  };

  if (!isOpen) return null;

  return (
    <div className={styles.backdrop} onClick={handleBackdropClick}>
      <div className={styles.modal} ref={modalRef}>
        <button className={styles.closeButton} onClick={onClose} aria-label="Close">
          ×
        </button>

        <div className={styles.content}>
          {step === 'mobile' ? (
            <>
              <h2 className={styles.title}>Verify Mobile Number</h2>
              <p className={styles.subtitle}>
                {userType === 'guest'
                  ? 'Please enter your mobile number to continue'
                  : 'Add your mobile number to your profile'}
              </p>

              <form onSubmit={handleSendOTP} className={styles.form}>
                <div className={styles.inputGroup}>
                  <label htmlFor="mobile" className={styles.label}>
                    Mobile Number
                  </label>
                  <div className={styles.phoneInput}>
                    <span className={styles.countryCode}>+91</span>
                    <input
                      type="tel"
                      id="mobile"
                      value={mobile}
                      onChange={handleMobileChange}
                      placeholder="Enter 10-digit mobile number"
                      className={styles.input}
                      maxLength={10}
                      autoFocus
                      disabled={isLoading}
                    />
                  </div>
                </div>

                {error && <div className={styles.error}>{error}</div>}

                <button
                  type="submit"
                  className={styles.submitButton}
                  disabled={isLoading || mobile.length !== 10}
                >
                  {isLoading ? 'Sending...' : 'Send OTP'}
                </button>
              </form>
            </>
          ) : (
            <>
              <button className={styles.backButton} onClick={handleBack} aria-label="Back">
                ← Back
              </button>

              <h2 className={styles.title}>Enter OTP</h2>
              <p className={styles.subtitle}>
                We&apos;ve sent a 6-digit OTP to <strong>+91 {mobile}</strong>
              </p>

              <form onSubmit={handleVerifyOTP} className={styles.form}>
                <div className={styles.inputGroup}>
                  <label htmlFor="otp" className={styles.label}>
                    OTP
                  </label>
                  <input
                    type="tel"
                    id="otp"
                    value={otp}
                    onChange={handleOTPChange}
                    placeholder="Enter 6-digit OTP"
                    className={styles.otpInput}
                    maxLength={6}
                    autoFocus
                    disabled={isLoading}
                  />
                </div>

                {error && <div className={styles.error}>{error}</div>}

                <button
                  type="submit"
                  className={styles.submitButton}
                  disabled={isLoading || otp.length !== 6}
                >
                  {isLoading ? 'Verifying...' : 'Verify OTP'}
                </button>

                <div className={styles.resendSection}>
                  {resendCountdown > 0 ? (
                    <p className={styles.resendText}>
                      Resend OTP in <strong>{resendCountdown}s</strong>
                    </p>
                  ) : (
                    <button
                      type="button"
                      className={styles.resendButton}
                      onClick={handleResendOTP}
                      disabled={isLoading}
                    >
                      Resend OTP
                    </button>
                  )}
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
