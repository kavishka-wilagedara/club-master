import React, { useContext, useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import Sidebar from '../components/Sidebar'
import { UserContext } from '../common/UserContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';


export default function ViewMyNews() {
    const [clubs, setClubs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [animateIn, setAnimateIn] = useState(false);
    const { user } = useContext(UserContext);
    const navigate = useNavigate();
  
    useEffect(() => {
      console.log('User in ViewMyClubs:', user);
      if (user && user.id) {
        getAllClubsByUser();
      } else {
        setLoading(false);
      }
      
      const timer = setTimeout(() => {
        setAnimateIn(true);
      }, 100);
      
      return () => clearTimeout(timer);
    }, [user]);
  
    const getAllClubsByUser = async () => {
      try {
        const response = await axios.get(`http://localhost:7000/api/v1/club/${user.id}/getClubs`);
        console.log('API Response:', response.data);
        setClubs(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error while getting clubs:', error);
        setError('Failed to fetch clubs. Please try again later.');
        setLoading(false);
      }
    };
  
    const viewOnGoingEventsOfClub = (clubId) => {
      navigate(`/myNews/?clubId=${clubId}`);
    };
  
    const getClubColor = (name) => {
      const colors = [
        'linear-gradient(135deg,rgb(33, 31, 23),rgb(30, 23, 73))',
      ];
  
      let hash = 0;
      for (let i = 0; i < name.length; i++) {
        hash = name.charCodeAt(i) + ((hash << 5) - hash);
      }
  
      return colors[Math.abs(hash) % colors.length];
    };
  
    const truncateText = (text, maxLength) => {
      if (!text) return 'No description available';
      if (text.length <= maxLength) return text;
      return text.substr(0, maxLength) + '...';
    };
  
    const getInitials = (name) => {
      if (!name) return '?';
      return name
        .split(' ')
        .map(word => word[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
    };
  
    if (!user) {
      return (
        <div className="error-container">
          <div className="error-card">
            <i className="bi bi-shield-lock"></i>
            <h3>Authentication Required</h3>
            <p>Please log in to view your club memberships.</p>
            <button className="retry-btn" onClick={() => navigate('/login')}>Go to Login</button>
          </div>
        </div>
      );
    }
  
    if (loading) {
      return (
        <div className="loading-screen">
          <div className="loader"></div>
        </div>
      );
    }
  
    if (error) {
      return (
        <div className="error-container">
          <div className="error-card">
            <i className="bi bi-exclamation-triangle-fill"></i>
            <h3>Something went wrong</h3>
            <p>{error}</p>
            <button className="retry-btn" onClick={getAllClubsByUser}>
              Try Again
            </button>
          </div>
        </div>
      );
    }
  return (
    <div>
        <Navbar/>
        <Sidebar/>

        <div className="main-content ">
      <div className="clubs-header mt-3 ">
        <div>
          <h1>View My News</h1>
          <p className="subtitle">Explore and manage your News</p>
        </div>
        
      </div>

      {clubs.length > 0 ? (
        <div className="clubs-grid">
          {clubs.map((club, index) => (
            <div
              key={club.clubId}
              className={`club-tile ${animateIn ? 'animate-in' : ''}`}
              style={{ 
                background: getClubColor(club.clubName),
                '--i': index
              }}
            >
              <div className="club-logo">
                {club.clubLogoUrl ? (
                  <img 
                    src={club.clubLogoUrl} 
                    alt={`${club.clubName} logo`}
                    className="club-logo-img"
                  />
                ) : (
                  <div className="club-logo-placeholder">
                    {getInitials(club.clubName)}
                  </div>
                )}
              </div>
              <div className="club-content">
                <div className="club-name">{club.clubName}</div>
                <div className="club-id">ID: {club.clubId}</div>
                <div className="club-description">
                  {truncateText(club.clubDescription, 100)}
                </div>
              </div>
              <div className="club-actions-btn">
                <button className="club-action-btn" onClick={()=> viewOnGoingEventsOfClub(club.clubId)}>
                  <span>View All News</span>
                  <i className="bi bi-arrow-right"></i>
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="no-clubs-container">
          <div className="no-clubs-message">
            <i className="bi bi-people"></i>
            <h3>No clubs found</h3>
            <p>You are not a member of any clubs yet. Join a club to connect with like-minded individuals and participate in exciting activities.</p>
            <button className="new-club-btn" style={{ marginTop: '1.5rem' }}>
              <i className="bi bi-search"></i>
              <span>Find Clubs</span>
            </button>
          </div>
        </div>
      )}
    </div>
    </div>
  )
}
