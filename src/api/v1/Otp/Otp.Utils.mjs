import Crypto from 'crypto';

class OtpUtils {
  /**
   * Generate a 6-digit OTP using Crypto.
   * @returns {string} A 6-digit OTP as a string.
   */
  static async generateOTP() {
    const otp = Crypto.randomInt(100000, 999999).toString();
    return otp;
  }

  /**
   * Get the expiry time for the OTP.
   * @param {number} minutes - The number of minutes before the OTP expires.
   * @returns {Date} The expiry time as a Date object.
   */
  static getExpiryTime(minutes = 5) {
    const expiryDuration = minutes * 60 * 1000; // Convert minutes to milliseconds
    return new Date(Date.now() + expiryDuration);
  }
}

export default OtpUtils;
