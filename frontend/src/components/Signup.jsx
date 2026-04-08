import React, { useState } from 'react'
import { Button } from './ui/button'
import axios from 'axios'
import { toast } from 'sonner'
import { Link, useNavigate } from 'react-router-dom'
import { Loader2 } from 'lucide-react'

const Signup = () => {
  const navigate = useNavigate();
  const [input, setInput] = useState({
    email: '',
    username: '',
    password: ''
  })
  const [loading, setLoading] = useState(false);

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value })
  }

  const signupHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post("https://taar-server.onrender.com/api/v1/user/register", input, {
        headers: {
          'Content-Type': 'application/json'
        },
        withCredentials: true
      });

      if (res.data.success) {
        localStorage.setItem("otpEmail", input.email);
        toast.success(res.data.message);
        setInput({ email: '', username: '', password: '' });
        navigate('/verify-otp', { state: { email: input.email } });
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Something went wrong";
      console.log("Signup Error:", errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className='flex items-center w-screen min-h-screen justify-center bg-gray-50 px-4'>
      <form 
        onSubmit={signupHandler} 
        className='shadow-xl flex flex-col gap-4 p-6 md:p-8 bg-white rounded-2xl w-full max-w-md border border-gray-100'
      >
        <div className="my-2 flex flex-col items-center justify-center gap-2">
          <h1 className='font-extrabold text-3xl tracking-tighter'>LOGO</h1>
          <p className='text-gray-500 text-sm text-center'>Signup to interact with people.</p>
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
          <span className='text-sm font-semibold ml-1'>Username</span>
          <input 
            type="text"
            name='username'
            placeholder='username'
            value={input.username}
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
            <Button type='submit' className='w-full py-6 mt-2 text-md font-bold'>Signup</Button>
          )
        }

        <span className='text-center text-sm text-gray-600'>
          Already have an account? <Link to='/login' className='text-blue-600 font-bold hover:underline'>Login</Link> 
        </span>
      </form>
    </div>
  )
}

export default Signup