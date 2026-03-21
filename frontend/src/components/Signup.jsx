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
    e.preventDefault(); // Prevent default form submission behavior
    console.log("Signup data:", input);
    setLoading(true);
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/v1/user/register`, input, {
        headers: {
          'Content-Type': 'application/json'
        },
        withCredentials: true // Include credentials for CORS (for cookies)
      });
      if (res.data.success) {
        navigate('/verify-otp', { state: { email: input.email } }); // Redirect to verificationPage page on successful signup
        toast.success(res.data.message);
        setInput({ email: '', username: '', password: '' }); // Reset input fields
      }
    } catch (err) {
      console.log("Error response data:", err.response?.data);
      toast.error(err.response?.data?.message || "An error occurred during signup");
    } finally {
      setLoading(false); // Reset loading state after request
    }
  }

  return (
    <div className='flex items-center w-screen h-screen justify-center'>
      <form onSubmit={signupHandler} className='shadow-lg flex flex-col gap-5 p-8'>
        <div className="my-4 flex flex-col items-center justify-center gap-5">
          <h1 className='font-bold text-xl'>LOGO</h1>
          <p>Signup to interact with people.</p>
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
          <span>Username</span>
          <input type="text"
            name='username'
            value={input.username}
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
            <Button type='submit' className='my-4'>Signup</Button>
          )
        }
        {/* <Button>Signup</Button> */}
        <span className='text-center'>Already have an account? <Link to='/login' className='text-blue-600'>Login</Link> </span>
      </form>
    </div>
  )
}

export default Signup
