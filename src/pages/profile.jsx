import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./profile.css";
import Navbar from "../components/layout/navbar";

function Profile() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    profilePicture: null,
    currentProfilePicture: "",
  });
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const response = await axios.get("http://127.0.0.1:8000/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const { name, email, profile_picture } = response.data;
        setFormData({
          name,
          email,
          password: "",
          confirmPassword: "",
          profilePicture: null,
          currentProfilePicture: profile_picture || "",
        });
      } catch (err) {
        console.error(err);
        setError("Failed to fetch user data");
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onloadend = () => {
      setFormData({ ...formData, profilePicture: reader.result });
    };

    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      const updateData = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
      };

      await axios.put(
        "http://127.0.0.1:8000/update-profile",
        updateData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (formData.profilePicture && typeof formData.profilePicture === "string") {
        await axios.post(
          "http://127.0.0.1:8000/upload-profile-picture",
          { file: formData.profilePicture },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        )
      }

      setError("");
      setSuccessMessage("Profile updated successfully!");
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.detail || "An error occurred");
    }
  };

  return (
    <>
      <Navbar />
      <div className="profile-container">
        <h2>Edit Profile</h2>
        <form className="profile-form" onSubmit={handleSubmit}>

          <div className="profile-picture-preview">
            <label>Current Profile Picture</label>
            {formData.currentProfilePicture ? (
              <img
                src={formData.currentProfilePicture}
                alt="Current Profile"
                style={{
                  width: "100px",
                  height: "100px",
                  objectFit: "cover",
                  borderRadius: "50%",
                  marginTop: "10px",
                }}
              />
            ) : (
                <p>No profile picture avaliable</p>
            )}
          </div>

          <div className="profile-form-group">
            <label>Profile Picture</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
            />
            {formData.profilePicture && (
              <div className="profile picture preview">
                <label>New Profile picture preview</label>
                <img
                  src={formData.profilePicture}
                  alt="Profile Preview"
                  style={{
                    width: "100px",
                    height: "100px",
                    objectFit: "cover",
                    borderRadius: "50%",
                    marginTop: "10px",
                  }}
                />
              </div>
            )}
          </div>
          <div className="profile-form-group">
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
          <div className="profile-form-group">
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
          <div className="profile-form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              placeholder="Enter new password"
              value={formData.password}
              onChange={handleChange}
            />
          </div>
          <div className="profile-form-group">
            <label>Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm new password"
              value={formData.confirmPassword}
              onChange={handleChange}
            />
          </div>
          {error && <p className="profile-error-message">{error}</p>}
          {successMessage && <p className="success-message">{successMessage}</p>}
          <button type="submit" className="submit">Save Changes</button>
        </form>
      </div>
    </>
  );
}

export default Profile;