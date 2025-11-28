import React, { useContext, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "./Login.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import { UserContext } from "../common/UserContext";

const Login = () => {
    const backendUrl=import.meta.env.VITE_BACKEND_URL;

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const {setUser} = useContext(UserContext);
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
        const response = await axios.post(`${backendUrl}/login`, {
            username,
            password,
        });
        console.log(response.data);
        setUser(response.data);
        Swal.fire({
            title: "Welcome Back!",
            text: "Login successful",
            icon: "success",
            timer: 1500,
            showConfirmButton: false,
            background: "#fff",
            customClass: {
                popup: "swal-popup",
            },
        }).then(() => {
            navigate("/");
        });
    } catch (error) {
        console.log("error while login", error);
        Swal.fire({
            title: "Login Failed",
            text: error.response?.data || "Something went wrong. Please try again.",
            icon: "error",
            confirmButtonText: "Try Again",
            confirmButtonColor: "#d33",
            background: "#fff",
            customClass: {
                title: "swal-title",
                popup: "swal-popup",
            },
        });
    }
};

  return (
    <div>
      <Navbar />
      {/* Background Section */}
      <div className="background-section ">
        {/* Logo */}
        <img src="/logo.png" alt="Logo" className="logo" style={{borderRadius:"100px",marginTop:"90px"}} />

        {/* Sign In Section */}
        <div className="signin-section ">
          <h2 className="signin-heading"></h2>

          {/* Username Field */}
          <div className="input-container username" style={{marginTop:"110px"}} >
            <label htmlFor="username" className="input-label">
              USERNAME
            </label>
            <input
              type="text"
              id="username"
              placeholder="Enter your username"
              className="input-box"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          {/* Password Field */}
          <div className="input-container password">
            <label htmlFor="password" className="input-label">
              PASSWORD
            </label>
            <input
              type="password"
              id="password"
              placeholder="Enter your password"
              className="input-box"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {/* Forgot Password */}
          <p className="forgot-password">Forgot Password?</p>

          {/* Sign In Button */}
          <button className="signin-button" onClick={handleLogin}>
            SIGN IN
          </button>
        </div>

        {/* Left Section for Text and Sign Up Button */}
        <div className="text-container">
          <h1>New Here?</h1>
          <p>
            Sign up now to explore, manage, and stay updated with your favourite
            university clubs!
          </p>

          {/* Sign Up Button with href */}
          <a href="/signup" className="signup-button">
            SIGN UP
          </a>
        </div>
      </div>

      {/* Footer Section */}
      <Footer />
    </div>
  );
};

export default Login;
