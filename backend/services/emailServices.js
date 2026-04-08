// import { Resend } from "resend";

// const resend = new Resend(process.env.RESEND_API_KEY);

// export const sendOTPEmail = async (email, otp) => {
//   try {
//     const data = await resend.emails.send({
//       from: "Taar <onboarding@resend.dev>",
//       to: email,
//       subject: "Your OTP",
//       html: `<p>Your OTP is <strong>${otp}</strong>. It expires in 5 minutes.</p>`,
//     });

//     console.log("Email sent:", data);
//   } catch (error) {
//     console.error("Resend error:", error);
//     throw new Error("Email sending failed");
//   }
// };

import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendOTPEmail = async (email, otp) => {
  console.log("📨 Sending OTP to:", email);

  const info = await transporter.sendMail({
    from: `"Taar" <${process.env.BREVO_USER}>`,
    to: email,
    subject: "Your OTP",
    text: `Your OTP is ${otp}`,
  });

  console.log("Email sent:", info.response);
};