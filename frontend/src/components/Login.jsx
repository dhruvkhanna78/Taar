import React, { useState } from 'react'
import { Button } from './ui/button'
import axios from 'axios'
import { toast } from 'sonner'
import { Link, useNavigate } from 'react-router-dom'
import { Loader2 } from 'lucide-react'
import { useDispatch } from 'react-redux'
import { setAuthUser } from '@/redux/authSlice'

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [input, setInput] = useState({
    email: '',
    password: ''
  })
  const [loading, setLoading] = useState(false);
  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value })
  }

  const signupHandler = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior
    console.log("Signup data:", input);
    setLoading(true);
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/v1/user/login`, input, {
        headers: {
          'Content-Type': 'application/json'
        },
        withCredentials: true // Include credentials for CORS (for cookies)
      });
      if (res.data.success) {
        console.log("User from backend:", res.data.user);
        dispatch(setAuthUser(res.data.user));
        navigate('/'); // Redirect to home page on successful login

        toast.success(res.data.message);
        setInput({ email: '', password: '' }); // Reset input fields
      }
    } catch (err) {
      console.log("Error full object:", err);

      if (err.response) {
        const { status, data } = err.response;

        // 1. Check for Unverified User (Status 403)
        if (status === 403 && data.needsVerification) {
          toast.info(data.message || "Please verify your email first");
          // navigate karte waqt email pass kar rahe hain taaki verify page par field auto-fill ho sake
          navigate('/verify-otp', { state: { email: input.email } });
          return; // Yahan se return ho jao taaki niche ke generic error toasts na chalein
        }

        // 2. Default Error Handling (status 401, 500 etc)
        toast.error(data?.message || "Login failed");

      } else if (err.request) {
        toast.error("No response from server. Check your internet.");
      } else {
        toast.error("An unexpected error occurred");
      }
    } finally {
      setLoading(false); // Reset loading state after request
    }
  }

  return (
    <div className='flex items-center w-screen h-screen justify-center'>
      <form onSubmit={signupHandler} className='shadow-lg flex flex-col gap-5 p-8'>
        <div className="my-4 flex flex-col items-center justify-center gap-5">
          <h1 className='font-bold text-xl'>LOGO</h1>
          <p>Login to interact with people.</p>
        </div>
        <div className="">
          <span>Email</span>
          <input type="email"
            name='email'
            value={input.email}
            onChange={changeEventHandler}
            className='focus-visible border-2 border-gray-300 rounded-md p-2 w-full'
          />
        </div>
        <div className="">
          <span>Password</span>
          <input type="password"
            name='password'
            value={input.password}
            onChange={changeEventHandler}
            className='focus-visible border-2 border-gray-300 rounded-md p-2 w-full'
          />
        </div>
        {
          loading ? (
            <Button className=''>
              <Loader2 className='mr-2 h-4 w-4 animate-spin' />
              Please wait
            </Button>
          ) : (
            <Button type='submit' className='my-4'>Login</Button>
          )
        }
        {/* <Button>Login</Button> */}
        <span className='text-center'>Doesn't have an account? <Link to='/signup' className='text-blue-600'>Signup</Link> </span>
      </form>
    </div>
  )
}

export default Login
