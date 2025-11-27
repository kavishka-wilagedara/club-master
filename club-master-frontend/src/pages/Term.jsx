


import React from "react";
import "./Term.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const Term = () => {
  return (
    <div className="terms-page">
          <Navbar />
         
      <div className="terms-container">
      
        <h1 className="terms-title">Terms and Conditions</h1>
        <p className="terms-intro">
          Welcome to our platform! These terms and conditions outline the rules
          and regulations for the use of our services.
        </p>
        <div className="terms-section">
          <h2 className="terms-subtitle">1. Acceptance of Terms</h2>
          <p>
            By accessing or using our platform, you agree to comply with and be
            bound by these terms. If you disagree with any part, please do not
            use our services.
          </p>
        </div>
        <div className="terms-section">
          <h2 className="terms-subtitle">2. Intellectual Property</h2>
          <p>
            All content, trademarks, and data on this platform, including but not
            limited to text, graphics, logos, and software, are our property and
            protected under applicable laws.
          </p>
        </div>
        <div className="terms-section">
          <h2 className="terms-subtitle">3. User Responsibilities</h2>
          <p>
            Users must ensure their activities comply with all applicable laws and
            do not infringe on the rights of others. Any misuse of our platform
            may result in account termination.
          </p>
        </div>
        <div className="terms-section">
          <h2 className="terms-subtitle">4. Limitation of Liability</h2>
          <p>
            We are not liable for any damages resulting from the use or inability
            to use our services. Use our platform at your own risk.
          </p>
        </div>
        <div className="terms-footer">
          <p>
            If you have any questions or concerns about these terms, feel free to
            contact us.
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Term;
