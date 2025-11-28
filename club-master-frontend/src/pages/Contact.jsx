import React, { useState } from "react";
import { FaEnvelope, FaPhoneAlt, FaMapMarkerAlt } from "react-icons/fa";
import "./Contact.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const Contact = () => {
    const backendUrl=import.meta.env.BACKEND_URL;

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    mobile: "",
    faculty: "",
    message: "",
  });

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    let newErrors = {};
    if (!formData.fullName.trim()) newErrors.fullName = "Full Name is required";
    if (!formData.email.includes("@")) newErrors.email = "Invalid email format";
    if (!/^\d{10}$/.test(formData.mobile))
      newErrors.mobile = "Phone number must be 10 digits";
    if (!formData.faculty.trim()) newErrors.faculty = "Faculty is required";
    if (!formData.message.trim()) newErrors.message = "Message is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const response = await fetch(`${backendUrl}/help/save`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert("Message sent successfully!");
        setFormData({
          fullName: "",
          email: "",
          mobile: "",
          faculty: "",
          message: "",
        });
      } else {
        alert("Failed to send message");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div>
      <div className="baaackground">
        <Navbar />
        <div className="contact-container">
          <img src="/cll.png" alt="Club-Master Logo" className="contact-logo" />

          <div className="contact-header">
            <img
              src="/ll.png"
              alt="Club-Master Logo"
              className="ccontact-logo"
            />
            <h1>Get in Touch with Club-Master</h1>
            <p className="contact-paragraph">
              Have questions or need assistance? Our team is here to support
              you.
            </p>
          </div>

          <div className="contact-details">
            <div className="contact-item">
              <FaEnvelope className="contact-icon" />
              <span>
                Email:{" "}
                <a href="mailto:support@clubmaster.com">
                  support@clubmaster.com
                </a>
              </span>
            </div>
            <div className="contact-item">
              <FaMapMarkerAlt className="contact-icon" />
              <span>Address: Faculty of Science, Dalugama, Kelaniya</span>
            </div>
            <div className="contact-item">
              <FaPhoneAlt className="contact-icon" />
              <span>
                Phone: <a href="tel:+94779056345">0779056345</a>
              </span>
            </div>
          </div>

          <div className="contact-form">
            <form onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="fullName">Full Name</label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    placeholder="Enter your full name"
                    value={formData.fullName}
                    onChange={handleChange}
                  />
                  {errors.fullName && (
                    <span className="error">{errors.fullName}</span>
                  )}
                </div>
                <div className="form-group">
                  <label htmlFor="email">Email Address</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleChange}
                  />
                  {errors.email && (
                    <span className="error">{errors.email}</span>
                  )}
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="mobile">Mobile Number</label>
                  <input
                    type="text"
                    id="mobile"
                    name="mobile"
                    placeholder="Enter your mobile number"
                    value={formData.mobile}
                    onChange={handleChange}
                  />
                  {errors.mobile && (
                    <span className="error">{errors.mobile}</span>
                  )}
                </div>
                <div className="form-group">
                  <label htmlFor="faculty">Your Faculty</label>
                  <input
                    type="text"
                    id="faculty"
                    name="faculty"
                    placeholder="Enter your faculty"
                    value={formData.faculty}
                    onChange={handleChange}
                  />
                  {errors.faculty && (
                    <span className="error">{errors.faculty}</span>
                  )}
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="message">Message</label>
                <textarea
                  id="message"
                  name="message"
                  rows="4"
                  placeholder="Write your message"
                  value={formData.message}
                  onChange={handleChange}
                ></textarea>
                {errors.message && (
                  <span className="error">{errors.message}</span>
                )}
              </div>
              <button type="submit" className="send-button">
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Contact;
