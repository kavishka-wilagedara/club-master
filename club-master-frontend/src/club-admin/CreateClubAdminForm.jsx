import axios from "axios";
import React, { useState } from "react";
import {
  FiUser,
  FiMail,
  FiLock,
  FiHash,
  FiUserPlus,
  FiUsers,
} from "react-icons/fi";

export default function CreateClubAdminForm() {
  const [formData, setFormData] = useState({
    clubId: "",
    memberId: "",
    fullName: "",
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
        const response = await axios.post(`http://localhost:7000/api/v1/clubAdmin/save`, formData);
    } catch (error) {
        
    }
  };

  return (
    <div
      className=" mx-auto bg-white rounded-xl shadow-lg overflow-hidden mt-3"
      style={{ maxWidth: "1000px" }}
    >
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-8 py-6">
        <h2 className="text-2xl font-bold text-white flex items-center">
          <FiUserPlus className="mr-3 text-3xl" />
          Create Club Administrator
        </h2>
        <p className="text-blue-100 mt-1">
          Add a new administrator to your club
        </p>
      </div>

      <div className="p-8">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div className="form-group">
              <label
                htmlFor="clubId"
                className="block text-sm font-medium text-gray-700 mb-1 flex items-center mb-3"
              >
                <FiUsers className="mr-1 text-blue-600 " />
                Club ID
              </label>
              <input
                type="text"
                id="clubId"
                name="clubId"
                value={formData.clubId}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="Enter club ID"
                required
              />
            </div>

            <div className="form-group">
              <label
                htmlFor="memberId"
                className="block text-sm font-medium text-gray-700 mb-1 flex items-center mb-3"
              >
                <FiHash className="mr-1 text-blue-600" />
                Member ID
              </label>
              <input
                type="text"
                id="memberId"
                name="memberId"
                value={formData.memberId}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="Enter member ID"
              />
            </div>
          </div>

          <div className="form-group">
            <label
              htmlFor="fullName"
              className="block text-sm font-medium text-gray-700 mb-1 flex items-center mb-3"
            >
              <FiUser className="mr-1 text-blue-600" />
              Full Name
            </label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              placeholder="Enter administrator's full name"
              required
            />
          </div>

          <div className="form-group">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1 flex items-center mb-3"
            >
              <FiMail className="mr-1 text-blue-600" />
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              placeholder="Enter email address"
              required
            />
          </div>

          <div className="form-group">
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700 mb-1 flex items-center mb-3"
            >
              <FiUser className="mr-1 text-blue-600" />
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              placeholder="Choose a username"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="form-group">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-1 flex items-center mb-3"
              >
                <FiLock className="mr-1 text-blue-600" />
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="Enter password"
                required
              />
            </div>

          </div>

          <div className="flex justify-end space-x-3 mt-8">
            <button
              type="button"
              className="px-5 py-2.5 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-400 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-700 text-white font-medium rounded-lg hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all shadow-md"
            >
              Create Administrator
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
