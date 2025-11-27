import React from "react";
import "./Footer.css"; // Add custom styles in this CSS file

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-columns">
        {/* Quick Menu */}
        <div className="footer-column">
          <h4>Quick Menu</h4>
          <ul>
            <li>Home</li>
            <li>Dashboard</li>
            <li>Login</li>
            <li><a href="/about">About</a></li>
            <li>Gallery</li>
          </ul>
        </div>

        {/* Services */}
        <div className="footer-column">
          <h4>Services</h4>
          <ul>
            <li>Clubs</li>
            <li><a href="/events">Events</a></li>
            <li>News</li>
          </ul>
        </div>

        {/* Legal */}
        <div className="footer-column">
          <h4>Legal</h4>
          <ul>
          <li><a href="/term">Terms and Conditions</a></li>
            <li><a href="/privacy">Privacy Policy</a></li>
            <li><a href="/faqs">FAQs</a></li>
          </ul>
        </div>

        {/* Coming Soon */}
        <div className="footer-column">
          <h4>Coming Soon On</h4>
          <div className="social-icons">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
              <i className="fab fa-facebook-f"></i>
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
              <i className="fab fa-twitter"></i>
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
              <i className="fab fa-instagram"></i>
            </a>
            <a href="https://whatsapp.com" target="_blank" rel="noopener noreferrer">
              <i className="fab fa-whatsapp"></i>
            </a>
          </div>
        </div>
      </div>

      {/* Divider and Copyright */}
      <hr className="footer-divider" />
      <div className="footer-bottom">
        <p>&copy; All Rights Reserved 2024</p>
        
       

      </div>
      
      
      

    </footer>
  );
};

export default Footer;
