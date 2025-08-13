import axios from 'axios';
import React, { useState } from 'react'
import toast, { Toaster } from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';

const Signup = () => {

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
            const res = await axios.post('http://localhost:8000/api/v1/user/register', input, {
                headers: {
                    'Content-Type': 'application/json'
                },
                withCredentials: true
            });
            if (res.data.success) {
                navigate('/login');
                toast.success(res.data.message);
                setInput({
                    email: "",
                    username: "",
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
                    <legend className="fieldset-legend text-[25px] mb-2">Signup</legend>
                    <label className="label mb-2">Sign up to experience Taar</label>
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

                    <label className="label mb-1">Username</label>
                    <input
                        type="text"
                        name="username"
                        value={input.username}
                        onChange={changeEventHandler}
                        className="input"
                        placeholder="Username"
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
                            <span className="loading loading-spinner loading-md mr-2"></span> Signing up...
                        </>
                    ) : (
                        "Sign up"
                    )}
                </button>
                <span className='text-center'>Already have an account? <Link to="/login" className='text-blue-600'>Login</Link> </span>
            </form>
        </div>
    )
}

export default Signup
