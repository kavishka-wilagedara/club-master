import React, { useState } from 'react';
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import './Signup.css'; // Adjusted import path
import axios from 'axios'; // Import axios for making HTTP requests
import Swal from 'sweetalert2'; // Import SweetAlert2

const Signup = () => {
  const backendUrl=import.meta.env.VITE_BACKEND_URL;
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    userName: '',
    email: '',
    phoneNo: '',
    password: '',
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstName) newErrors.firstName = 'First Name is required';
    if (!formData.lastName) newErrors.lastName = 'Last Name is required';
    if (!formData.userName) newErrors.userName = 'Username is required';
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email address is invalid';
    }
    if (!formData.phoneNo) {
      newErrors.phoneNo = 'Phone is required';
    } else if (!/^\d{10}$/.test(formData.phoneNo)) {
      newErrors.phoneNo = 'Phone number must be exactly 10 digits';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      const response = await axios.post(`${backendUrl}/member/save`, formData, {
        headers: {
          'Content-Type': 'application/json', // Ensure the correct content type
        },
      });

      // Show success alert
      Swal.fire({
        icon: 'success',
        title: 'Registration Successful!',
        text: 'You have been successfully registered.',
        confirmButtonText: 'OK',
      });

      console.log('Registration successful:', response.data);
    } catch (error) {
      console.error('Registration failed:', error.message);

      // Show error alert
      Swal.fire({
        icon: 'error',
        title: 'Registration Failed',
        text: error.response?.data?.message || 'Please try again.',
        confirmButtonText: 'OK',
      });
    }
  };

  return (
    <div>
      <Navbar />
      {/* Backgroundd Section */}
      <div className="backgroundd-section">
        {/* Logo */}
        <img
          src="./ll.png"
          alt="Logo"
          className="logoo"
        />
        <div className="rsignup-container">
          <div className="rsignup-form-wrapper">
            <h2 className="rsignup-heading">Create Your Account</h2>
            <form className="rsignup-form" onSubmit={handleSubmit}>
              <input
                type="text"
                className={`rinput-box ${errors.firstName ? 'error' : ''}`}
                placeholder="First Name"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
              />
              {errors.firstName && (
                <div className="error-message">
                  <i className="fas fa-exclamation-circle"></i> {errors.firstName}
                </div>
              )}

              <input
                type="text"
                className={`rinput-box ${errors.lastName ? 'error' : ''}`}
                placeholder="Last Name"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
              />
              {errors.lastName && (
                <div className="error-message">
                  <i className="fas fa-exclamation-circle"></i> {errors.lastName}
                </div>
              )}

              <input
                type="text"
                className={`rinput-box ${errors.userName ? 'error' : ''}`}
                placeholder="Username"
                name="userName"
                value={formData.userName}
                onChange={handleChange}
              />
              {errors.userName && (
                <div className="error-message">
                  <i className="fas fa-exclamation-circle"></i> {errors.userName}
                </div>
              )}

              <input
                type="email"
                className={`rinput-box ${errors.email ? 'error' : ''}`}
                placeholder="Email"
                name="email"
                value={formData.email}
                onChange={handleChange}
              />
              {errors.email && (
                <div className="error-message">
                  <i className="fas fa-exclamation-circle"></i> {errors.email}
                </div>
              )}

              <input
                type="tel"
                className={`rinput-box ${errors.phoneNo ? 'error' : ''}`}
                placeholder="Phone"
                name="phoneNo"
                value={formData.phoneNo}
                onChange={handleChange}
                maxLength={10}
                onKeyPress={(e) => {
                  if (!/[0-9]/.test(e.key)) {
                    e.preventDefault();
                  }
                }}
              />
              {errors.phoneNo && (
                <div className="error-message">
                  <i className="fas fa-exclamation-circle"></i> {errors.phoneNo}
                </div>
              )}

              <input
                type="password"
                className={`rinput-box ${errors.password ? 'error' : ''}`}
                placeholder="Password"
                name="password"
                value={formData.password}
                onChange={handleChange}
              />
              {errors.password && (
                <div className="error-message">
                  <i className="fas fa-exclamation-circle"></i> {errors.password}
                </div>
              )}

              <button type="submit" className="rsignup-button">
                SIGN UP
              </button>
            </form>
          </div>
        </div>

        {/* Left Section for Text and Sign Up Button */}
        <div className="text-containerr">
          <h1>ONE OF US?</h1>
          <p>
            If you're already a member, sign in below to manage your club activities.
          </p>

          {/* Sign in Button with href */}
          <a href="/login" className="signinn-button">
            SIGN IN
          </a>
        </div>
      </div>

      {/* Footer Section */}
      <Footer />
    </div>
  );
};

export default Signup;