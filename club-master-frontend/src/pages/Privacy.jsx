// Privacy.jsx
import React from 'react';
import './Privacy.css';
import Navbar from "../components/Navbar";
import Footer from "../components/Footer"; 

const Privacy = () => {
  return (
    <div className="privacy-container">
           <Navbar />
      <header className="privacy-header">
        <h1>Privacy Policy</h1>
        <p>Welcome to the University Club Management System</p>
      </header>

      <section className="privacy-content">
        <h2>1. Introduction</h2>
        <p>
          Your privacy is important to us. This Privacy Policy outlines the
          types of personal information that is collected and recorded by our
          system and how we use it.
        </p>

        <h2>2. Information We Collect</h2>
        <p>
          We collect personal information when you register for a club, event, or
          other activities within the system. The types of personal information
          we collect may include your name, email address, university ID, and
          other relevant details.
        </p>

        <h2>3. How We Use Your Information</h2>
        <p>
          Your information is used to manage your participation in clubs and events,
          to communicate updates, and to ensure that we provide the best user experience
          possible. We may also use your data for analytics and improvement purposes.
        </p>

        <h2>4. Data Security</h2>
        <p>
          We take the security of your personal information seriously and have implemented
          reasonable measures to protect it from unauthorized access, alteration, or disclosure.
        </p>

        <h2>5. Your Rights</h2>
        <p>
          You have the right to access, correct, and delete your personal information.
          If you wish to do so, please contact us through the provided contact form.
        </p>

        <h2>6. Changes to This Policy</h2>
        <p>
          We may update this Privacy Policy periodically. All changes will be posted on this
          page with an updated revision date.
        </p>
      </section>

      
        
      <Footer />
    </div>
  );
};

export default Privacy;
