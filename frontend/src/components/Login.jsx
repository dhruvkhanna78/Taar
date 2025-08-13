import axios from 'axios';
import React, { useState } from 'react'
import toast, { Toaster } from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';


const Login = () => {

    const [input, setInput] = useState({
        email: "",
        username: "",
        password: ""
    });

    const [loading, setloading] = useState(false);
    const navigate = useNavigate();

    const changeEventHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value })
    }

    const signupHandler = async (e) => {
        e.preventDefault();
        console.log(input);
        try {
            setloading(true);
            const res = await axios.post('http://localhost:8000/api/v1/user/login', input, {
                headers: {
                    'Content-Type': 'application/json'
                },
                withCredentials: true
            });
            if (res.data.success) {
                navigate('/');
                toast.success(res.data.message);
                setInput({
                    email: "",
                    password: ""
                })
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response.data.message);
        } finally {
            setloading(false);
        }
    }

    return (
        <div className="flex items-center justify-center min-h-screen">
            <form
                onSubmit={signupHandler}
                className="fieldset bg-base-200 border-base-300 rounded-box w-xs border p-4"
            >
                <div className="mb-3">
                    <legend className="fieldset-legend text-[25px] mb-2">Login</legend>
                    <label className="label mb-2">Login to experience Taar</label>
                </div>

                <div className="space-y-3">
                    <label className="label mb-1">Email</label>
                    <input
                        type="email"
                        name="email"
                        value={input.email}
                        onChange={changeEventHandler}
                        className="input"
                        placeholder="Email"
                    />

                    <label className="label mb-1">Password</label>
                    <input
                        type="password"
                        name="password"
                        value={input.password}
                        onChange={changeEventHandler}
                        className="input"
                        placeholder="Password"
                    />
                </div>

                <button type="submit" className="btn btn-neutral mt-4" disabled={loading}>
                    {loading ? (
                        <>
                            <span className="loading loading-spinner loading-md mr-2"></span> Logging in...
                        </>
                    ) : (
                        "Login"
                    )}
                </button>
                <span className='text-center'>Doesn't have an account? <Link to="/signup" className='text-blue-600'>Signup</Link> </span>
            </form>
        </div>
    )
}

export default Login;
