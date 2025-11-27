import React, { useState, useContext } from "react";
import {
  FaUsers,
  FaPlus,
  FaCalendarAlt,
  FaNewspaper,
  FaEdit,
  FaCog,
} from "react-icons/fa";
import { UserContext } from "../common/UserContext"; // Import UserContext
import { useNavigate } from "react-router-dom"; // Import useNavigate
import Swal from "sweetalert2"; // Import SweetAlert
import "./Clubadmin.css";

const Clubadmin = ({ changeView }) => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const { logout } = useContext(UserContext); // Get logout function from context
  const navigate = useNavigate(); // Initialize navigate

  // Handle logout function with SweetAlert confirmation
  const handleLogout = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You are about to sign out!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, sign out!",
    }).then((result) => {
      if (result.isConfirmed) {
        logout(); // Call the logout function from context
        navigate("/"); // Redirect to home page
        Swal.fire(
          "Signed out!",
          "You have been successfully signed out.",
          "success"
        );
      }
    });
  };

  return (
    <div className="admin-sidebar">
      <ul className="admin-sidebar-list">
        <li
          className="admin-sidebar-item"
          onClick={() => changeView("viewProfile")}
        >
          <FaUsers className="admin-icon" /> Profile
        </li>
        <li
          className="admin-sidebar-item"
          onClick={() => changeView("viewAllClubAdmin")}
        >
          <FaUsers className="admin-icon" /> Manage Clubs
        </li>
        <li
          className="admin-sidebar-item"
          onClick={() => changeView("createClubAdmin")}
        >
          <FaPlus className="admin-icon" /> Add Club Admin
        </li>
        {/* <li className="admin-sidebar-item"><FaPlus className="admin-icon" /> Add Club</li> */}
        <li
          className="admin-sidebar-item"
          onClick={() => changeView("viewEvents")}
        >
          <FaCalendarAlt className="admin-icon" /> Events
        </li>
        <li
          className="admin-sidebar-item"
          onClick={() => changeView("viewParojects")}
        >
          <FaEdit className="admin-icon" /> Projects
        </li>
        <li
          className="admin-sidebar-item"
          onClick={() => changeView("viewNews")}
        >
          <FaNewspaper className="admin-icon" /> News
        </li>
        <li
          className="admin-sidebar-item"
          onClick={() => changeView("addNews")}
        >
          <FaNewspaper className="admin-icon" /> Add New News
        </li>
        <li
          className="admin-sidebar-item"
          onClick={() => changeView("viewAwards")}
        >
          <FaNewspaper className="admin-icon" /> Awards
        </li>
        <li className="admin-sidebar-item" onClick={handleLogout}>
          <FaCog className="admin-icon" /> Sign Out
        </li>
      </ul>
    </div>
  );
};

export default Clubadmin;
