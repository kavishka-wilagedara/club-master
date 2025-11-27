import React from "react";
import "./RotractFooter.css"; // Updated file name to match convention
import { Link } from "react-router-dom";

const Rotractfooter = ({clubImage,clubName,clubVision,clubEmail}) => {

  return (
    <footer className="rotract-footer">
      <div className="rotract-footer-columns">
        {/* Rotaract Club Section */}
        <div className="rotract-footer-column" style={{ marginRight: "20px" }}>
          <img
            src={clubImage}
            alt="Rotaract Club Logo"
            className="rotractf-logo"
            style={{ width: "200px", height: "100px" }}
          />
          <p className="rotract-text p-3">
            {clubVision}
          </p>
        </div>

        {/* Contact Us Section */}
        <div className="rotract-footer-column">
          <h4 className="rotract-heading">Contact {clubName} Us</h4>
          <p className="rotract-text">
            Need help or have a question? <br />
            Contact us at: <a href="mailto:info@racuok.lk">{clubEmail}</a>
          </p>
        </div>

        {/* RACUOK Section */}
        <div className="rotract-footer-column">
          <h4 className="rotract-heading">Club Master</h4>
          <ul className="d-flex flex-column">
            <a href="/">Home</a>
            <a href="/about">About Us</a>
            <a href="/contact">Contact Us</a>
          </ul>
        </div>

        {/* Social Media Section */}
        <div className="rotract-footer-column">
          <h4 className="rotract-heading">Coming Soon On</h4>
          <div className="rotract-social-icons">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="rotract-social-link"
            >
              <i className="fab fa-facebook-f"></i>
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="rotract-social-link"
            >
              <i className="fab fa-twitter"></i>
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="rotract-social-link"
            >
              <i className="fab fa-instagram"></i>
            </a>
            <a
              href="https://tiktok.com"
              target="_blank"
              rel="noopener noreferrer"
              className="rotract-social-link"
            >
              <i className="fab fa-tiktok"></i>
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="rotract-social-link"
            >
              <i className="fab fa-linkedin"></i>
            </a>
          </div>
        </div>
      </div>

      {/* Divider and Copyright */}
      <hr className="rotract-footer-divider" />
      <div className="rotract-footer-bottom">
        <p>&copy; All Rights Reserved 2024</p>
      </div>
    </footer>
  );
};

export default Rotractfooter;
