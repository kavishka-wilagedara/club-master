import React, { useState, useEffect } from "react";
import "./Clubhome.css";
import Dashboard from "../components/Dashboard";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import axios from "axios";
import { Link } from "react-router-dom";
import { FaUsers } from "react-icons/fa";

// ClubCard component that uses club data from API
const ClubCard = ({ club }) => {
  const backendUrl=import.meta.env.VITE_BACKEND_URL;
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  // Use the backgroundImageUrls from the API response
  const bgImages = club.backgroundImageUrls || ["/1.jpg", "/2.jpg", "/3.jpg"];
  
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % bgImages.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [bgImages.length]);

  // Use the clubLogoUrl from the API response
  const logo = club.clubLogoUrl || "/leologo.png";

  return (
    <div
      className="aa-club-card"
      style={{
        backgroundImage: `url(${bgImages[currentImageIndex]})`,
      }}
    >
      <div className="aa-club-header">
        <img
          src={logo}
          alt={`${club.clubName} Logo`}
          className="aa-club-logo"
          style={{ width: "60px", height: "50px", marginLeft: "10px" }}
        />
        <h2 className="aa-club-name" style={{ marginLeft: "10px" }}>
          {club.clubName.toUpperCase()} 
        </h2>
      </div>
      <hr />
      <p className="aa-club-description mb-4">{club.clubVision}</p>
      
      <div className="aa-club-actions mt-4">
        <a href={`/rotractlogin?clubId=${club.clubId}`} className="aa-register-btn">Join Now</a>
      </div>
    </div>
  );
};

const Clubhome = () => {
  const [clubs, setClubs] = useState([]);

  useEffect(() => {
    getAllClubs();
  }, []);

  const getAllClubs = async () => {
    try {
      const response = await axios.get(`${backendUrl}/club/all`);
      console.log('Clubs data:', response.data);

      const filteredClubs = response.data.filter(club => 
        club.clubName.length > 1
      );
      
      setClubs(filteredClubs);
    } catch (error) {
      console.error('Error while getting all clubs', error);
    }
  };

  return (
    <div className="aa-club-home-page">
      <Navbar />
      <Sidebar />
      <div className="aa-club-content">
        <div className="aa-club-container">
          {clubs.map((club) => (
            <ClubCard key={club.clubId} club={club} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Clubhome;