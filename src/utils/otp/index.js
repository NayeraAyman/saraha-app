/**
 * 
 * @param {*} expireTime - in milliseconds
 * @returns {otp, otpExpire}
 */
export const generateOtp = (expireTime = 15 * 60 * 1000) => {
  const otp = Math.floor(10000 + Math.random() * 90000);
  const otpExpire = Date.now() + expireTime;
  return { otp, otpExpire };
};
