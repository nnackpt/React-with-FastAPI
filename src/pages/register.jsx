import React, { useState } from 'react';
import axios from 'axios';
import './auth.css';

function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
  });

  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      console.log("Sending request to backend...");
      const response = await axios.post('http://127.0.0.1:8000/register', {
        name: formData.name,
        email: formData.email,
        username: formData.username,    
        password: formData.password,
      });

      console.log("Response from backend:", response.data);
      setError('');
      setSuccessMessage(true); // Update successMessage state
      setTimeout(() => setSuccessMessage(false), 3000); // Reset after 3 seconds
    } catch (err) {
      console.error("Error during registration:", err);
      setError(err.response?.data?.detail || 'An error occurred');
    }
  };

  return (
    <div className="auth-background">
      {successMessage && (
        <div className="succes-notification">Registration successful!</div>
      )}

      <div className="auth-container">
        <h2>Register</h2>
        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Name</label>
            <input
              type="text"
              name="name"
              placeholder="Enter your name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Username</label>
            <input 
              type="text"
              name="username"
              placeholder='Enter your username'
              value={formData.username}
              onChange={handleChange}
              required
              />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm your password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>
          {error && <p className="error-message">{error}</p>}
          <button type="submit" className="btn-submit">Register</button>
        </form>
        <p>Already have an account? <a href="/login">Login here</a></p>
      </div>
    </div>
  );
}

export default Register;