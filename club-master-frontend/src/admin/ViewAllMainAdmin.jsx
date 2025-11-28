import axios from "axios";
import React, { useEffect, useState } from "react";
import "../admin/ViewAllMainAdmin.css"; 

export default function ViewAllMainAdmin() {
  const backendUrl=import.meta.env.VITE_BACKEND_URL;

  const [admins, setAdmins] = useState([]);

  useEffect(() => {
    getAllAdmins();
  }, []);

  const getAllAdmins = async () => {
    try {
      const response = await axios.get(
        `${backendUrl}/mainAdmin/all`
      );
      setAdmins(response.data || []);
      console.log("API response:", response.data);
    } catch (error) {
      console.log("Error while getting all admins:", error);
    }
  };

  return (
    <div className="admin-dashboard__container">
      <div className="admin-dashboard__header">
        <h1 className="admin-dashboard__title">Main Administrator Profiles</h1>
        <div className="admin-dashboard__subtitle">Total admins: {admins.length}</div>
      </div>
      
      <div className="admin-dashboard__grid">
        {admins.map((admin, index) => (
          <div className="admin-card" key={index}>
            <div className="admin-card__header">
              <div className="admin-card__avatar">
                {admin?.mainAdminName?.charAt(0) || "A"}
              </div>
              <h3 className="admin-card__name">{admin?.mainAdminName || "Unknown Admin"}</h3>
            </div>
            <div className="admin-card__content">
              <div className="admin-card__info-row">
                <span className="admin-card__label">ID</span>
                <span className="admin-card__value">{admin?.mainAdminId || "N/A"}</span>
              </div>
              <div className="admin-card__info-row">
                <span className="admin-card__label">Email</span>
                <span className="admin-card__value">{admin?.mainAdminEmail || "N/A"}</span>
              </div>
              <div className="admin-card__info-row">
                <span className="admin-card__label">Phone</span>
                <span className="admin-card__value">{admin?.mainAdminPhone || "N/A"}</span>
              </div>
              <div className="admin-card__info-row">
                <span className="admin-card__label">Username</span>
                <span className="admin-card__value">{admin?.mainAdminUsername || "N/A"}</span>
              </div>
              <div className="admin-card__info-row">
                <span className="admin-card__label">Password</span>
                <span className="admin-card__value admin-card__password">
                  {admin?.mainAdminPassword || "********"}
                </span>
              </div>
            </div>
          </div>
        ))}
        
        {admins.length === 0 && (
          <div className="admin-dashboard__empty-state">
            No administrators found
          </div>
        )}
      </div>
    </div>
  );
}