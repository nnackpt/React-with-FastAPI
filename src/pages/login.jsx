import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./auth.css";

function Login() {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post('http://127.0.0.1:8000/login', {
                email: formData.email,
                password: formData.password,
            });

            console.log(response.data);
            setError('');

            localStorage.setItem('token', response.data.token);

            navigate('/home');
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.detail || 'An error occurred. Please try again.')
        }
    }

    return (
        <div className="auth-background">
            <div className="auth-container">
                <h2>Login</h2>
                <form className="auth-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Email</label>
                        <input
                            type="email"
                            name="email"
                            placeholder="Enter your email"
                            value={formData.email}
                            onChange={handleChange}
                            required />
                    </div>
                    <div className="form-group">
                        <label>Password</label>
                        <input
                            type="password"
                            name="password"
                            placeholder="Enter your password"
                            value={formData.password}
                            onChange={handleChange}
                            required />
                    </div>
                    {error && <p className="error-message">{error}</p>}
                    <button type="submit" className="btn-submit">Login</button>
                </form>
                <p>Don't have an account? <a href="/register">Register</a></p>
                <p>Or Continue as a <a href="/">Guest</a></p>
            </div>
        </div>
    )
}

export default Login;