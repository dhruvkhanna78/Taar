import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
//   host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendOTPEmail = async (email, otp) => {
    console.log("📨 Sending OTP to:", email);
  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Your OTP",
      text: `Your OTP is ${otp}. It will expire in 5 minutes.`,
    });

    console.log("Email sent: " + info.response);
  } catch (error) {
    console.log(error);
    throw new Error("Email sending failed");
  }
};

// import { Resend } from "resend";
// const resend = new Resend('re_EXcxWhax_MUWCvNoio1uqL49H1Jefgiua');

// export const sendOTPEmail = async (email, otp) => {
//   try {
//     const data = await resend.emails.send({
//       from: "onboarding@resend.dev",
//       to: email,
//       subject: "OTP",
//       html: `<p>Your OTP is <strong>${otp}</strong>. It will expire in 5 minutes.</p>`,
//     });
//     return data;
//   } catch (error) {
//     console.error("Resend Error:", error);
//     throw new Error("Email sending failed via Resend");
//   }
// };
