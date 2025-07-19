import React, { useState } from 'react';
import API from '../../api';  // Correct relative path
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const res = await API.post('/users/login', { username, password });

            localStorage.setItem('token', res.data.token);
            localStorage.setItem('userId', res.data.user._id);
            localStorage.setItem('profilePic', res.data.user.image);

            navigate('/feed');
        } catch (err) {
            console.error('❌ Login error:', err.response?.data || err.message);
            setError('Invalid username or password');
        }
    };

    return (
        <div style={containerStyle}>
            <h2 style={{ textAlign: 'center' }}>Login</h2>
            {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
            <form onSubmit={handleLogin}>
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                    required
                    style={inputStyle}
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                    style={inputStyle}
                />
                <button type="submit" style={buttonStyle}>Login</button>
            </form>

            <p style={{ textAlign: 'center', marginTop: '15px' }}>
                Don't have an account?{' '}
                <Link to="/register" style={{ color: '#007bff', textDecoration: 'none' }}>
                    Register
                </Link>
            </p>
        </div>
    );
};

const containerStyle = {
    maxWidth: '400px',
    margin: '50px auto',
    padding: '20px',
    border: '1px solid #ccc',
    borderRadius: '10px',
};

const inputStyle = {
    width: '100%',
    marginBottom: '10px',
    padding: '10px',
    borderRadius: '5px',
    border: '1px solid #ccc',
};

const buttonStyle = {
    width: '100%',
    padding: '10px',
    borderRadius: '5px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    fontWeight: 'bold',
};

export default Login;
