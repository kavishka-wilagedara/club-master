import React, { useState } from "react";
import { FaUsers, FaCalendarAlt, FaNewspaper, FaCalendar, FaTachometerAlt, FaChevronDown, FaChevronUp } from "react-icons/fa";
import { Link } from "react-router-dom";
import './Sidebar.css';

const Sidebar = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);

  const handleCategoryClick = (category) => {
    setSelectedCategory(selectedCategory === category ? null : category);
  };

  return (
    <div className="sidebar">
      <ul className="sidebar-menu">
        <li className="sidebar-item">
          <Link to="/clubHome" className="sidebar-link">
            <FaTachometerAlt className="icon" /> Dashboard
          </Link>
        </li>

        <li className="sidebar-item">
          <Link to="/myclub" className="sidebar-link">
            <FaUsers className="icon" /> My Clubs
          </Link>
        </li>

        <li className={`sidebar-item ${selectedCategory === "Events" ? "active" : ""}`}>
          <div 
            className="sidebar-link dropdown-toggle"
            onClick={() => handleCategoryClick("Events")}
          >
            <div className="link-content">
              <FaCalendarAlt className="icon" /> 
              <span>Events</span>
            </div>
            {selectedCategory === "Events" ? <FaChevronUp className="dropdown-icon" /> : <FaChevronDown className="dropdown-icon" />}
          </div>
          
          {selectedCategory === "Events" && (
            <ul className="sidebar-submenu">
              <li className="submenu-item">
                <Link to="/myOnGoingEvents" className="submenu-link">
                  Ongoing Events
                </Link>
              </li>
              <li className="submenu-item">
                <Link to="/myAllUpcomingEvents" className="submenu-link">
                  Upcoming Events
                </Link>
              </li>
              <li className="submenu-item">
                <Link to="/myAllPastEvents" className="submenu-link">
                  Past Events
                </Link>
              </li>
            </ul>
          )}
        </li>

        <li className="sidebar-item">
          <Link to="/myAllMyNews" className="sidebar-link">
            <FaNewspaper className="icon" /> News
          </Link>
        </li>

      </ul>
    </div>
  );
};

export default Sidebar;