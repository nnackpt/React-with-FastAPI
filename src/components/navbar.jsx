import React from "react";
import { Link, useLocation } from "react-router-dom";
import "./navbar.css";

function Navbar() {
    const location = useLocation();

    return (
        <nav className="navbar">
            <div className="navbar-brand">
                <Link to="/" className="logo">MyApp</Link>
            </div>
            <ul className="navbar-links">
                <li>
                    <Link to="/" className={location.pathname === "/" ? "active" : ""}>Home</Link>
                </li>
                <li>
                    <Link to="/about" className={location.pathname === "/about" ? "active" : ""}>About</Link>
                </li>
                <li>
                    <Link to="/contact" className={location.pathname === "/contact" ? "active" : ""}>Contact</Link>
                </li>
            </ul>
            <div className="navbar-actions">
                <Link to="/login" className="login-btn">Login</Link>
                <Link to="/register" className="signup-btn">Sign up</Link>
            </div>
        </nav>
    );
}

export default Navbar;
