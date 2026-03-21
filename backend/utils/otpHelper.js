import { sendOTPEmail } from "../services/emailServices.js";

export const otpGenerateAndSend = async (email) => {
  try {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = new Date(Date.now() + 5 * 60 * 1000);
    
    console.log("🔢 Generated OTP:", otp, "for", email);
    
    await sendOTPEmail(email, otp);
    
    return { otp, otpExpiry };
  } catch (error) {
    console.error("💥 OTP HELPER ERROR:", error.message);
    throw error; // Re-throw for controller to catch
  }
};