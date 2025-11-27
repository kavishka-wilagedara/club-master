import React, { useState } from "react";
import { FaSearch, FaBell, FaUserCircle } from "react-icons/fa"; // Importing React icons

const Dashboard = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false); // State to toggle the dropdown visibility

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen); // Toggle dropdown visibility
  };

  return (
    <nav className="bg-gray-900 shadow-md fixed top-0 left-0 w-full z-50">
      <div className="container mx-auto px-4 py-3 flex items-center">
        {/* Left section: Logo */}
        <a
          className="flex items-center text-2xl font-bold text-white hover:text-gray-400"
          style={{ marginLeft: "-100px" }}
          href="/"
        >
          <img src="/logo.png" alt="Logo" className="mr-2 w-15 h-12" />
          <span>Club-Master</span>
        </a>

        {/* Right section: Navigation and buttons */}
        <div className="ml-auto flex items-center space-x-8">
          <a
            className="text-gray-50 hover:text-gray-400 transition duration-300"
            href="/"
          >
            Home
          </a>

          {/* Notification Icon */}
          <a
            className="text-gray-50 hover:text-gray-400 transition duration-300"
            href="/notifications"
          >
            <FaBell size={20} />
          </a>

          {/* Contact Link */}
          <a
            className="text-gray-50 hover:text-gray-400 transition duration-300"
            href="/contact"
          >
            Contact
          </a>

          {/* Search Bar */}
          <div className="relative">
            <input
              type="text"
              className="bg-gray-800 text-white pl-10 pr-4 py-2 rounded-full"
              placeholder="Search..."
            />
            <FaSearch
              className="absolute left-3 top-2 text-gray-400"
              size={18}
            />
          </div>

          {/* Profile Avatar with Dropdown */}
          <div className="relative">
            <FaUserCircle
              size={30}
              className="text-gray-50 cursor-pointer"
              onClick={toggleDropdown} // Toggle dropdown on click
            />
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-gray-800 rounded-lg shadow-lg">
                <a
                  className="block px-4 py-2 text-white hover:bg-gray-700"
                  href="/userprofile"
                >
                  My Profile
                </a>
                <a
                  className="block px-4 py-2 text-white hover:bg-gray-700"
                  href="/logout"
                >
                  Sign Out
                </a>
              </div>
            )}
          </div>
          
        </div>
      </div>
    </nav>
  );
};

export default Dashboard;
