import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

export const sendOTPEmail = async (email, otp) => {
    try {
        const info = await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: "Your OTP",
            text: `Your OTP is ${otp}. It will expire in 5 minutes.`,
        });

        console.log("Email sent:", info.response);
    } catch (error) {
        console.log("Email sending failed:", error);
        throw error; // controller handle karega error
    }
};