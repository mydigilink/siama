/**
 * SMS Utility Functions
 * Handles SMS sending via CommNest API
 */

interface CommNestSMSParams {
  apikey: string;
  route: string;
  sender: string;
  mobileno: string;
  text: string;
}

interface CommNestResponse {
  status: string;
  message?: string;
  data?: any;
}

const fillDLTTemplate = (template: string, vars: string[]): string => {
  const parts = template.split('{#var#}');
  if (parts.length === 1) return template;
  const needed = parts.length - 1;
  if (vars.length < needed) {
    throw new Error(`DLT template requires ${needed} variables, but got ${vars.length}`);
  }

  let out = parts[0];
  for (let i = 0; i < needed; i++) {
    const value = vars[i] ?? '';
    if (value.length > 30) {
      throw new Error(`DLT variable value too long (max 30 chars): "${value.slice(0, 35)}..."`);
    }
    out += value + parts[i + 1];
  }
  return out;
};

/**
 * URL encode message text for SMS API
 * Replaces newlines with %0A and special characters
 */
export const encodeMessageForSMS = (message: string): string => {
  return message
    .replace(/\n/g, '%0A')
    .replace(/&/g, '%26')
    .replace(/ /g, '%20')
    .replace(/,/g, '%2C');
};

/**
 * Build CommNest API URL with parameters
 */
export const buildCommNestURL = (params: CommNestSMSParams): string => {
  const { apikey, route, sender, mobileno, text } = params;
  const baseURL = process.env.COMMNEST_API_URL || 'http://www.commnestsms.com/api/push.json';
  
  return `${baseURL}?apikey=${apikey}&route=${route}&sender=${sender}&mobileno=${mobileno}&text=${text}`;
};

/**
 * Send OTP via CommNest SMS API
 * Uses OTP template: {#var#} is your OTP for access to Siama Skincare. Thank you for choosing Siama Skincare
 */
export const sendOTPSMS = async (mobile: string, otp: string): Promise<CommNestResponse> => {
  try {
    const apiKey = process.env.COMMNEST_API_KEY;
    const sender = process.env.COMMNEST_SENDER_ID;
    const route = process.env.COMMNEST_ROUTE || 'transactional';

    

    // Development bypass mode - skip actual SMS sending
    // if (process.env.NODE_ENV === 'development') {
    //   console.log('[SMS] BYPASS MODE: Skipping actual SMS send');
    //   console.log('[SMS] Would send OTP:', otp, 'to mobile:', mobile);
    //   return {
    //     status: 'success',
    //     message: 'OTP sent successfully',
    //   };
    // }

    if (!apiKey || !sender) {
      throw new Error('CommNest API credentials not configured in environment variables');
    }

    // Clean mobile number (remove +91 or any non-digits)
    const cleanMobile = mobile.replace(/\D/g, '');
    const finalMobile = cleanMobile.startsWith('91') && cleanMobile.length === 12 
      ? cleanMobile.slice(2) 
      : cleanMobile;

    // Build OTP message using DLT approved template
    const message = `${otp} is your OTP for access to Siama Skincare.%0AThank you for choosing Siama Skincare`;

    const url = buildCommNestURL({
      apikey: apiKey,
      route: route,
      sender: sender,
      mobileno: finalMobile,
      text: message,
    });

    // Always log for debugging (mask API key)
    console.log('[SMS] Calling CommNest API');
    console.log('[SMS] Mobile:', finalMobile);
    console.log('[SMS] URL (masked):', url.replace(apiKey, 'MASKED_KEY'));

    const response = await fetch(url, {
      method: 'GET',
    });

    console.log('[SMS] Response Status:', response.status);
    console.log('[SMS] Response Headers:', Object.fromEntries(response.headers.entries()));

    // Try to parse response as JSON
    let data;
    const responseText = await response.text();
    console.log('[SMS] Response Text:', responseText);
    
    try {
      data = JSON.parse(responseText);
      console.log('[SMS] Parsed Response Data:', JSON.stringify(data, null, 2));
    } catch (e) {
      console.log('[SMS] Failed to parse response as JSON');
      data = { rawResponse: responseText };
    }

    // Check if API returned an error in response body
    if (!response.ok || data.status === 'error' || data.ErrorCode) {
      // CommNest returns 'description' (lowercase), also check other possible fields
      const errorMsg = data.description || data.message || data.ErrorMessage || data.Description || `SMS API request failed with status ${response.status}`;
      console.error('[SMS] Error:', errorMsg);
      console.error('[SMS] Full error data:', data);
      throw new Error(errorMsg);
    }

    return {
      status: 'success',
      message: 'OTP sent successfully',
      data,
    };
  } catch (error) {
    console.error('[SMS] Exception caught:', error);
    console.error('[SMS] Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
    });
    return {
      status: 'error',
      message: error instanceof Error ? error.message : 'Failed to send OTP',
    };
  }
};

/**
 * Send booking confirmation SMS
 * Uses template: Thank you for booking your services with Siama Skincare...
 */
export const sendBookingConfirmationSMS = async (mobile: string): Promise<CommNestResponse> => {
  try {
    const apiKey = process.env.COMMNEST_API_KEY;
    const sender = process.env.COMMNEST_SENDER_ID;
    const route = process.env.COMMNEST_ROUTE || 'transactional';

    if (!apiKey || !sender) {
      throw new Error('CommNest API credentials not configured in environment variables');
    }

    // Clean mobile number
    const cleanMobile = mobile.replace(/\D/g, '');
    const finalMobile = cleanMobile.startsWith('91') && cleanMobile.length === 12 
      ? cleanMobile.slice(2) 
      : cleanMobile;

    // Build booking confirmation message using DLT approved template
    const message = `Thank%20you%20for%20booking%20your%20services%20with%20Siama%20Skincare.%0AWe%20are%20looking%20forward%20to%20serve%20you.%0AIf%20you%20have%20any%20query,%20please%20call%20us%20on%208287795045`;

    const url = buildCommNestURL({
      apikey: apiKey,
      route: route,
      sender: sender,
      mobileno: finalMobile,
      text: message,
    });

    if (process.env.NODE_ENV === 'development') {
      console.log('[SMS] Calling CommNest API for booking confirmation:', url.replace(apiKey, 'MASKED'));
    }
    console.log('[SMS] URL:____________________________________', url);
    const response = await fetch(url, {
      method: 'GET',
    });

    const data = await response.json();
    
    if (process.env.NODE_ENV === 'development') {
      console.log('[SMS] CommNest API Response:', data, url);
    }

    if (!response.ok || data.status === 'error' || data.ErrorCode) {
      const errorMsg = data.message || data.ErrorMessage || `SMS API request failed with status ${response.status}`;
      throw new Error(errorMsg);
    }

    return {
      status: 'success',
      message: 'Booking confirmation sent successfully',
      data,
    };
  } catch (error) {
    console.error('Error sending booking confirmation SMS:', error);
    return {
      status: 'error',
      message: error instanceof Error ? error.message : 'Failed to send confirmation SMS',
    };
  }
};

export const sendPaymentSuccessSMS = async (
  mobile: string,
  paymentId: string,
  orderId: string
): Promise<CommNestResponse> => {
  try {
    const apiKey = process.env.COMMNEST_API_KEY;
    const sender = process.env.COMMNEST_SENDER_ID;
    const route = process.env.COMMNEST_ROUTE || 'transactional';
    const paymentTemplate = process.env.COMMNEST_PAYMENT_SUCCESS_TEMPLATE;

    if (!apiKey || !sender) {
      throw new Error('CommNest API credentials not configured in environment variables');
    }
    if (!paymentTemplate) {
      return {
        status: 'error',
        message:
          'Payment SMS DLT template not configured. Set COMMNEST_PAYMENT_SUCCESS_TEMPLATE to your approved DLT text (use {#var#} placeholders).',
      };
    }

    const cleanMobile = mobile.replace(/\D/g, '');
    const finalMobile =
      cleanMobile.startsWith('91') && cleanMobile.length === 12 ? cleanMobile.slice(2) : cleanMobile;

    const rawMessage = fillDLTTemplate(paymentTemplate, [orderId, paymentId]);

    const url = buildCommNestURL({
      apikey: apiKey,
      route: route,
      sender: sender,
      mobileno: finalMobile,
      text: encodeMessageForSMS(rawMessage),
    });

    console.log('[SMS] Calling CommNest API for payment success');
    console.log('[SMS] Mobile:', finalMobile);
    console.log('[SMS] URL (masked):', url.replace(apiKey, 'MASKED_KEY'));

    const response = await fetch(url, { method: 'GET' });
    const responseText = await response.text();

    let data: any;
    try {
      data = JSON.parse(responseText);
    } catch {
      data = { rawResponse: responseText };
    }

    if (!response.ok || data.status === 'error' || data.ErrorCode) {
      const errorMsg =
        data.description ||
        data.message ||
        data.ErrorMessage ||
        data.Description ||
        `SMS API request failed with status ${response.status}`;
      throw new Error(errorMsg);
    }

    return {
      status: 'success',
      message: 'Payment success SMS sent successfully',
      data,
    };
  } catch (error) {
    console.error('Error sending payment success SMS:', error);
    return {
      status: 'error',
      message: error instanceof Error ? error.message : 'Failed to send payment success SMS',
    };
  }
};
