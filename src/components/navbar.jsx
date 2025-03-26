import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./navbar.css";

function Navbar() {
    const location = useLocation();
    const navigate = useNavigate();
    const [user, setUser] = useState(null);

    // Function to fetch user data from token
    const fetchUserData = () => {
        const token = localStorage.getItem("token");
        if (token) {
            try {
                const base64Url = token.split(".")[1];
                const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
                const decodedToken = JSON.parse(window.atob(base64));
                setUser(decodedToken);
            } catch (err) {
                console.error("Error decoding token:", err);
            }
        }
    };

    useEffect(() => {
        fetchUserData(); // Initial fetch
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("token");
        setUser(null);
        navigate("/login");
    };

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
                {user && (
                    <li>
                        <Link to="/profile" className={location.pathname === "/profile" ? "active" : ""}>Profile</Link>
                    </li>
                )}
            </ul>
            <div className="navbar-actions">
                {user ? (
                    <div className="user-info">
                        <span>Hello, {user.name}</span>
                        <button className="logout-btn" onClick={handleLogout}>Logout</button>
                    </div>
                ) : (
                    <>
                        <Link to="/login" className="login-btn">Login</Link>
                        <Link to="/register" className="signup-btn">Sign up</Link>
                    </>
                )}
            </div>
        </nav>
    );
}

export default Navbar;