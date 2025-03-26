import React from "react";
import "./auth.css";

function Login() {
    return (
        <div className="auth-background">
            <div className="auth-container">
                <h2>Login</h2>
                <form className="auth-form">
                    <div className="form-group">
                        <label>Email</label>
                        <input type="email" placeholder="Enter your email" required />
                    </div>
                    <div className="form-group">
                        <label>Password</label>
                        <input type="password" placeholder="Enter your password" required/>
                    </div>
                    <button type="submit" className="btn-submit">Login</button>
                </form>
                <p>Don't have an account? <a href="/register">Register</a></p>
                <p>Or Continue as a <a href="/">Guest</a></p>
            </div>
        </div>
    )
}

export default Login;