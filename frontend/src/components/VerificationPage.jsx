import axios from 'axios';
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setAuthUser } from '@/redux/authSlice'; // Path check kar lena apne project ke hisab se
import { toast } from 'sonner';

const VerificationPage = () => {
    const [otp, setOtp] = React.useState('');
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();
    
    const email = location.state?.email; 

    const submitHAndler = async (e) => {
        e.preventDefault();
        
        if(!otp) return toast.error("Please enter OTP");

        try {
            const res = await axios.post('http://localhost:8000/api/v1/user/verify-otp', 
                { email, otp }, 
                { 
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true // Cookie set karne ke liye zaroori hai
                }
            );

            if (res.data.success) {
                // 1. Redux store update karo taaki login status active ho jaye
                dispatch(setAuthUser(res.data.user)); 
                
                // 2. Alert ki jagah toast
                toast.success(res.data.message || "OTP Verified Successfully!");
                
                // 3. Home page par redirect
                navigate('/');
            }
        } catch (err) {
            console.log("Error response:", err.response?.data);
            const errorMessage = err.response?.data?.message || "Something went wrong";
            toast.error(errorMessage);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
            <div className="p-8 bg-white shadow-lg rounded-lg w-full max-w-md">
                <form onSubmit={submitHAndler} className="flex flex-col gap-4">
                    <h3 className="text-xl font-bold text-center">Verify OTP</h3>
                    <p className="text-sm text-gray-600 text-center">
                        Sent to: <span className="font-semibold">{email || "your email"}</span>
                    </p>
                    
                    <input 
                        type="text"
                        placeholder='Enter 6-digit OTP'
                        className="border p-2 rounded outline-none focus:ring-2 focus:ring-blue-400 text-center tracking-widest text-lg"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        maxLength={6}
                    />
                    
                    <button 
                        type='submit'
                        className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 rounded transition-all"
                    >
                        Verify & Login
                    </button>
                </form>
            </div>
        </div>
    );
};

export default VerificationPage;