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

  const loginHandler = async (e) => {
    e.preventDefault();
    console.log("Login data:", input);
    setLoading(true);
    try {
      const res = await axios.post(`https://taar-server.onrender.com/api/v1/user/login`, input, {
        headers: {
          'Content-Type': 'application/json'
        },
        withCredentials: true
      });
      if (res.data.success) {
        console.log("User from backend:", res.data.user);
        dispatch(setAuthUser(res.data.user));
        navigate('/');
        toast.success(res.data.message);
        setInput({ email: '', password: '' });
      }
    } catch (err) {
      console.log("Error response data:", err.response?.data);

      if (err.response) {
        const { status, data } = err.response;

        if (status === 403 && data.needsVerification) {
          toast.info(data.message || "Email verification pending.");
          localStorage.setItem("otpEmail", input.email);
          navigate('/verify-otp');
          return;
        }
        toast.error(data?.message || "Login failed");
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className='flex items-center w-screen min-h-screen justify-center bg-gray-50 px-4'>
      <form 
        onSubmit={loginHandler} 
        className='shadow-xl flex flex-col gap-4 p-6 md:p-8 bg-white rounded-2xl w-full max-w-md border border-gray-100'
      >
        <div className="my-2 flex flex-col items-center justify-center gap-2">
          <h1 className='font-extrabold text-3xl tracking-tighter'>LOGO</h1>
          <p className='text-gray-500 text-sm text-center'>Login to interact with people.</p>
        </div>

        <div className="flex flex-col gap-1">
          <span className='text-sm font-semibold ml-1'>Email</span>
          <input 
            type="email"
            name='email'
            placeholder='email@example.com'
            value={input.email}
            onChange={changeEventHandler}
            className='focus-visible:ring-2 focus-visible:ring-blue-500 outline-none border-2 border-gray-200 rounded-lg p-3 w-full transition-all'
          />
        </div>

        <div className="flex flex-col gap-1">
          <span className='text-sm font-semibold ml-1'>Password</span>
          <input 
            type="password"
            name='password'
            placeholder='••••••••'
            value={input.password}
            onChange={changeEventHandler}
            className='focus-visible:ring-2 focus-visible:ring-blue-500 outline-none border-2 border-gray-200 rounded-lg p-3 w-full transition-all'
          />
        </div>

        {
          loading ? (
            <Button className='w-full py-6 mt-2'>
              <Loader2 className='mr-2 h-4 w-4 animate-spin' />
              Please wait
            </Button>
          ) : (
            <Button type='submit' className='w-full py-6 mt-2 text-md font-bold'>Login</Button>
          )
        }

        <span className='text-center text-sm text-gray-600'>
          Doesn't have an account? <Link to='/signup' className='text-blue-600 font-bold hover:underline'>Signup</Link> 
        </span>
      </form>
    </div>
  )
}

export default Login