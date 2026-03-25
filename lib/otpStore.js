const otpStore = global.otpStore || new Map();

if (!global.otpStore) {
  global.otpStore = otpStore;
}

export default otpStore;