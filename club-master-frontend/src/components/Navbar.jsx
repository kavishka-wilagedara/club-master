import React, { useState, useContext } from "react";
import { UserContext } from "../common/UserContext";
import { FaSearch, FaUserCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const { user, logout } = useContext(UserContext);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleLogout = () => {
    logout();
    navigate("/");
    setDropdownOpen(false);
  };

  return (
    <nav className="bg-gray-900 shadow-md nav-bar">
      <div className="container mx-auto px-6 py-3">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <a
            href="/"
            className="flex items-center text-2xl font-bold text-white hover:text-gray-400 transition duration-300"
          >
            <img src="/logo.png" alt="Logo" className="mr-2 h-10" />
            <span>Club-Master</span>
          </a>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <a
              className="text-gray-50 hover:text-gray-400 transition duration-300"
              href="/"
            >
              Home
            </a>
            <a
              className="text-gray-50 hover:text-gray-400 transition duration-300"
              href="/about"
            >
              About
            </a>
            <a
              className="text-gray-50 hover:text-gray-400 transition duration-300"
              href="/contact"
            >
              Contact
            </a>

            {/* {user.role === "MEMBER" && (
               <a
               className="text-gray-50 hover:text-gray-400 transition duration-300"
               href="/clubhome"
             >
               Clubs
             </a>
            )} */}

            {user?.role === "MEMBER" && (
              <a
                className="block px-4 py-2 text-sm text-white hover:bg-gray-700 transition duration-200"
                href="/clubHome"
              >
                Clubs
              </a>
            )}
          </div>

          {/* User Section */}
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                {/* Search Bar */}
                <div className="relative hidden sm:block">
                  <input
                    type="text"
                    className="bg-gray-800 text-white pl-10 pr-4 py-2 rounded-full w-48 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Search..."
                  />
                  <FaSearch
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={16}
                  />
                </div>

                <div className="relative">
                  <div className="flex items-center space-x-2">
                    <div className="bg-gradient-to-r from-blue-500 to-indigo-600 px-3 py-1 rounded-full flex items-center">
                      <span className="hidden sm:block text-white text-sm font-medium mr-2">
                        {user.username}
                      </span>
                      <button
                        onClick={toggleDropdown}
                        className="relative focus:outline-none group"
                      >
                        <div className="relative">
                          <FaUserCircle
                            size={28}
                            className="text-white group-hover:text-gray-200 transition-all duration-300"
                          />
                          <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-gray-900"></div>
                        </div>
                      </button>
                    </div>

                    <div className="bg-gray-800 h-8 w-8 rounded-full flex items-center justify-center relative hover:bg-gray-700 transition-colors duration-300 cursor-pointer">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-gray-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                        />
                      </svg>
                      <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border border-gray-900 flex items-center justify-center">
                        <span className="text-white text-xs font-bold">2</span>
                      </div>
                    </div>
                  </div>

                  {/* Dropdown Menu */}
                  {dropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-lg shadow-lg py-1 z-50">
                      <a
                        className="block px-4 py-2 text-sm text-white hover:bg-gray-700 transition duration-200"
                        href="/userprofile"
                      >
                        My Profile
                      </a>

                      {user.role === "MAIN_ADMIN" && (
                        <a
                          className="block px-4 py-2 text-sm text-white hover:bg-gray-700 transition duration-200"
                          href="/mainAdmin"
                        >
                          Admin dashboard
                        </a>
                      )}

                      {user.role === "MEMBER" && (
                        <a
                          className="block px-4 py-2 text-sm text-white hover:bg-gray-700 transition duration-200"
                          href="/clubHome"
                        >
                          Member dashboard
                        </a>
                      )}

                      {user.role === "CLUB_ADMIN" && (
                        <a
                          className="block px-4 py-2 text-sm text-white hover:bg-gray-700 transition duration-200"
                          href="/clubAdmin"
                        >
                          Club Admin dashboard
                        </a>
                      )}

                      <button
                        className="w-full text-left block px-4 py-2 text-sm text-white hover:bg-gray-700 transition duration-200"
                        onClick={handleLogout}
                      >
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-3">
                <a
                  className="bg-blue-600 text-white hover:bg-blue-700 transition duration-300 px-4 py-2 rounded-full text-sm font-medium"
                  href="/login"
                >
                  Login
                </a>
                <a
                  className="bg-gray-800 text-white hover:bg-gray-700 transition duration-300 px-4 py-2 rounded-full text-sm font-medium"
                  href="/signup"
                >
                  Register
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
