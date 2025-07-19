import React, { useState } from 'react';
import API from '../../api';  // Ensure path correct ho tumhare project structure ke hisaab se
import { useNavigate } from 'react-router-dom';

const Register = () => {
    const [name, setName] = useState('');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [image, setImage] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData();
        formData.append('name', name);
        formData.append('username', username);
        formData.append('email', email);
        formData.append('password', password);
        if (image) formData.append('image', image);

        try {
            const res = await API.post('/users/register', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            console.log("✅ Registration successful:", res.data);
            navigate('/login');
        } catch (err) {
            console.error("❌ Registration error:", err.response?.data || err.message);
            setError(err.response?.data?.error || "Registration failed");
        }

        setLoading(false);
    };

    return (
        <div style={containerStyle}>
            <h2 style={{ textAlign: 'center' }}>Register</h2>
            {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}

            <form onSubmit={handleRegister} encType="multipart/form-data">
                <input
                    type="text"
                    placeholder="Name"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    required
                    style={inputStyle}
                />
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                    required
                    style={inputStyle}
                />
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
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
                <input
                    type="file"
                    accept="image/*"
                    name="image"
                    onChange={e => setImage(e.target.files[0])}
                    style={{ ...inputStyle, padding: '6px' }}
                />

                <button type="submit" style={buttonStyle} disabled={loading}>
                    {loading ? "Registering..." : "Register"}
                </button>
            </form>

            <p style={{ textAlign: 'center', marginTop: '15px' }}>
                Already have an account?{' '}
                <span
                    style={{ color: '#007bff', cursor: 'pointer', textDecoration: 'underline' }}
                    onClick={() => navigate('/login')}
                >
                    Login
                </span>
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
    backgroundColor: '#28a745',
    color: 'white',
    border: 'none',
    fontWeight: 'bold',
};

export default Register;
