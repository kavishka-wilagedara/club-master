import React, { useEffect, useState } from "react";
import axios from "axios";
import "./ViewClubDetails.css";

export default function ClubDetails({ clubId }) {
  const backendUrl=import.meta.env.BACKEND_URL;

  const [club, setClub] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getClubById();
  }, [clubId]);

  const getClubById = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${backendUrl}/club/findClub/${clubId}`
      );
      console.log(response.data);
      setClub(response.data);
      setLoading(false);
    } catch (error) {
      console.log("error while getting club", error);
      setError("Failed to fetch club details. Please try again.");
      setLoading(false);
    }
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this club?")) {
      console.log("Delete club with ID:", clubId);
      // Add actual delete API call here
    }
  };

  const handleUpdate = () => {
    console.log("Update club with ID:", clubId);
    // Add navigation to update form here
  };

  if (loading) {
    return (
      <div className="club-details-loader">
        <div className="loader"></div>
        <p>Loading club details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="club-details-error">
        <div className="error-icon">
          <i className="bi bi-exclamation-circle"></i>
        </div>
        <h3>Something went wrong</h3>
        <p>{error}</p>
        <button onClick={getClubById} className="retry-button">
          <i className="bi bi-arrow-clockwise"></i> Try Again
        </button>
      </div>
    );
  }

  if (!club) {
    return (
      <div className="club-details-not-found">
        <div className="not-found-icon">
          <i className="bi bi-search"></i>
        </div>
        <h3>Club Not Found</h3>
        <p>We couldn't find the club you're looking for.</p>
        <button className="back-button">
          <i className="bi bi-arrow-left"></i> Back to Clubs
        </button>
      </div>
    );
  }

  return (
    <div className="club-details-container">
      <div className="club-details-header">
        <div className="club-details-banner">
          <span className="club-id-text">#{club.clubId}</span>
          <h1 className="club-name">{club.clubName}</h1>
          <div className="club-actions">
            <button
              className="action-button edit-button"
              onClick={handleUpdate}
              title="Edit club"
            >
              <i className="bi bi-pencil"></i>
            </button>
            <button
              className="action-button delete-button"
              onClick={handleDelete}
              title="Delete club"
            >
              <i className="bi bi-trash"></i>
            </button>
          </div>
        </div>
      </div>

      <div className="club-details-content">
        <div className="club-details-card info-card">
          <div className="card-header">
            <i className="bi bi-info-circle"></i>
            <h2>Club Information</h2>
          </div>
          <div className="card-body">
            <div className="info-row">
              <div className="info-label">
                <i className="bi bi-geo-alt"></i> Location
              </div>
              <div className="info-value">{club.clubAddress}</div>
            </div>

            <div className="info-row">
              <div className="info-label">
                <i className="bi bi-person-badge"></i> Senior Adviser
              </div>
              <div className="info-value">{club.clubSeniorAdviser}</div>
            </div>

            <div className="info-row">
              <div className="info-label">
                <i className="bi bi-person-workspace"></i> Producer
              </div>
              <div className="info-value">{club.clubProducer}</div>
            </div>

            <div className="info-row">
              <div className="info-label">
                <i className="bi bi-envelope"></i> Email
              </div>
              <div className="info-value">{club.clubEmail}</div>
            </div>

            <div className="info-row">
              <div className="info-label">
                <i className="bi bi-telephone"></i> Phone
              </div>
              <div className="info-value">{club.clubPhone}</div>
            </div>

            <div className="info-row">
              <div className="info-label">
                <i className="bi bi-image"></i> Logo
              </div>
              <div className="info-value">
                <img
                  src={club.clubLogoUrl}
                  alt="Club Logo"
                  className="club-logo"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="club-details-card vision-card">
          <div className="card-header">
            <i className="bi bi-eye"></i>
            <h2>Vision</h2>
          </div>
          <div className="card-body">
            <div className="vision-content">
              <p>{club.clubVision}</p>
            </div>
          </div>
        </div>

        <div className="club-details-card members-card">
          <div className="card-header">
            <i className="bi bi-people"></i>
            <h2>Members</h2>
          </div>
          <div className="card-body">
            <div className="members-list">
              {club.positionHoldingMembersAndRoles.map((member, index) => (
                <div key={index} className="member-item">
                  <div className="member-info">
                    <div className="member-name">{member.memberName}</div>
                    <div className="member-role">{member.role}</div>
                    <div className="member-email">{member.email}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="club-details-footer">
        <button className="back-to-all-button">
          <i className="bi bi-arrow-left"></i> Back to All Clubs
        </button>
      </div>
    </div>
  );
}
