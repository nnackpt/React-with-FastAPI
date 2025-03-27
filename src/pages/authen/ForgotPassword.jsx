import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../authen/auth.css";
import SubmitButton from "../../components/common/SubmitButton";

function ForgotPassword() {
    const [formData, setFormData] = useState({
        email: "",
        username: "",
        newPassword: "",
    })

    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://127.0.0.1:8000/forgot-password', {
                email: formData.email,
                username: formData.username,
                new_password: formData.newPassword,
            });

            console.log(response.data);
            setError('');
            setSuccessMessage("Password updated successfully!");

            setTimeout(() => {
                navigate("/login");
            }, 2000);
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.detail || 'An error occurred. Please try again.');
        }
    };

    return (
        <div className="auth-background">
            <div className="auth-container">
                <h2>Reset Password</h2>
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
                        <label>Username</label>
                        <input
                            type="text"
                            name="username"
                            placeholder="Enter your username"
                            value={formData.username}
                            onChange={handleChange}
                            required />
                    </div>
                    <div className="form-group">
                        <label>New Password</label>
                        <input
                            type="password"
                            name="newPassword"
                            placeholder="Enter new password"
                            value={formData.newPassword}
                            onChange={handleChange}
                            required />
                    </div>
                    {error && <p className="error-message">{error}</p>}
                    {successMessage && <p className="succes-notification">{successMessage}</p>}
                    <SubmitButton type="submit" label="Reset Password"/>
                </form>
                <p>Back to <a href="/login">Login</a></p>
            </div>
        </div>
    )
}

export default ForgotPassword;