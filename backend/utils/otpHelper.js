import { sendOTPEmail } from "../services/emailServices.js";

export const otpGenerateAndSend = async (email) => {
     const otp = Math.floor(100000 + Math.random() * 900000).toString(); //generating random 6 digit otp
    const otpExpiry = new Date(Date.now() + 5 * 60 * 1000); //otp valid for 5 minutes

    await sendOTPEmail(email, otp);
    return { otp, otpExpiry };
}