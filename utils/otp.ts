/**
 * OTP Utility Functions
 * Handles OTP generation, validation, and hashing
 */

/**
 * Generate a random 6-digit OTP
 */
export const generateOTP = (): string => {
  const otp = Math.floor(100000 + Math.random() * 900000);
  return otp.toString();
};

/**
 * Validate OTP format (6 digits)
 */
export const validateOTPFormat = (otp: string): boolean => {
  const otpRegex = /^\d{6}$/;
  return otpRegex.test(otp);
};

/**
 * Validate mobile number format (10 digits for India)
 */
export const validateMobileFormat = (mobile: string): boolean => {
  const mobileRegex = /^[6-9]\d{9}$/;
  return mobileRegex.test(mobile);
};

/**
 * Format mobile number with country code (adds +91 prefix if not present)
 */
export const formatMobileWithCountryCode = (mobile: string): string => {
  const cleaned = mobile.replace(/\D/g, '');
  if (cleaned.startsWith('91') && cleaned.length === 12) {
    return `+${cleaned}`;
  }
  if (cleaned.length === 10) {
    return `+91${cleaned}`;
  }
  return mobile;
};

/**
 * Simple hash function for OTP (uses crypto API in Node.js environment)
 * For production, consider using bcrypt or similar
 */
export const hashOTP = async (otp: string): Promise<string> => {
  if (typeof window === 'undefined') {
    // Server-side: use Node.js crypto
    const crypto = await import('crypto');
    return crypto.createHash('sha256').update(otp).digest('hex');
  } else {
    // Client-side: use Web Crypto API
    const encoder = new TextEncoder();
    const data = encoder.encode(otp);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }
};

/**
 * Verify OTP against hash
 */
export const verifyOTP = async (otp: string, hash: string): Promise<boolean> => {
  const otpHash = await hashOTP(otp);
  return otpHash === hash;
};

/**
 * Generate OTP expiry timestamp (default: 5 minutes from now)
 */
export const generateOTPExpiry = (minutes: number = 5): number => {
  return Date.now() + minutes * 60 * 1000;
};

/**
 * Check if OTP has expired
 */
export const isOTPExpired = (expiryTimestamp: number): boolean => {
  return Date.now() > expiryTimestamp;
};
