import axios from 'axios';
import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setAuthUser } from '@/redux/authSlice';
import { toast } from 'sonner';

const VerificationPage = () => {
    const [otp, setOtp] = React.useState('');

    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();

    const email = location.state?.email;

    useEffect(() => {
        if (!email) {
            toast.error("Session expired. Please signup again.");
            navigate("/signup");
        }
    }, [email, navigate]);

    const submitHandler = async (e) => {
        e.preventDefault();

        if (!otp) return toast.error("Please enter OTP");

        try {
            const res = await axios.post(
                `https://taar-server.onrender.com/api/v1/user/verify-otp`,
                { email, otp },
                {
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true
                }
            );

            if (res.data.success) {
                dispatch(setAuthUser(res.data.user));

                localStorage.removeItem("otpEmail");

                toast.success(res.data.message);
                navigate('/');
            }
        } catch (err) {
            console.log("Error response:", err.response?.data);
            const errorMessage =
                err.response?.data?.message || "Something went wrong";
            toast.error(errorMessage);
        }
    };

    const resendOTP = async () => {
        try {
            const res = await axios.post(
                "https://taar-server.onrender.com/api/v1/user/resend-otp",
                { email }
            );

            toast.success(res.data.message);
        } catch {
            toast.error("Failed to resend OTP");
        }
    };

    console.log("VERIFY PAGE EMAIL:", email);
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
            <div className="p-8 bg-white shadow-lg rounded-lg w-full max-w-md">
                <form onSubmit={submitHandler} className="flex flex-col gap-4">
                    <h3 className="text-xl font-bold text-center">Verify OTP</h3>

                    <p className="text-sm text-gray-600 text-center">
                        Sent to:
                        <span className="font-semibold">
                            {email || "your email"}
                        </span>
                    </p>

                    <input
                        type="text"
                        placeholder="Enter 6-digit OTP"
                        className="border p-2 rounded outline-none focus:ring-2 focus:ring-blue-400 text-center tracking-widest text-lg"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        maxLength={6}
                    />

                    <button
                        type="submit"
                        className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 rounded transition-all"
                    >
                        Verify & Login
                    </button>

                    <button
                        type="button"
                        onClick={resendOTP}
                        className="text-blue-500 underline text-sm"
                    >
                        Resend OTP
                    </button>
                </form>
            </div>
        </div>
    );
};

export default VerificationPage;