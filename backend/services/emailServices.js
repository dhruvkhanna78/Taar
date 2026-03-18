import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    service : 'gmail',
    auth : {
        user : process.env.EMAIL_USER,
        pass : process.env.EMAIL_PASS
    }
});

export const sendOTPEmail = async (email, otp) => {
    try{
        const info = await transporter.sendMail({
            from : process.env.EMAIL_USER,
            to : email,
            subject : 'Your OTP',
            text : `Your OTP is ${otp}. It will expire in 5 minutes.`
        })

        console.log("Email sent: " + info.response);
    } catch(error){
        console.log(error); 
        return res.status(500).json({
            message: "Server error, please try again",
            success: false
        });
    }
}