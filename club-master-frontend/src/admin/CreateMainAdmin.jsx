import React, { useState } from "react";
import { User, Mail, Phone, Lock, UserPlus, X } from "lucide-react";
import "../admin/CreateMainAdmin.css";
import axios from "axios";
import Swal from "sweetalert2";

const CreateMainAdmin = () => {
  const backendUrl=import.meta.env.VITE_BACKEND_URL;

  const [formData, setFormData] = useState({
    mainAdminName: "",
    mainAdminEmail: "",
    mainAdminPhone: "",
    mainAdminUsername: "",
    mainAdminPassword: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault(); 
    try {
      const response = await axios.post(`${backendUrl}/mainAdmin/save`, formData);
      console.log(response.data);

      Swal.fire({
              title: "Submitted",
              text: "Main admin created successful",
              icon: "success",
              timer: 1500,
              showConfirmButton: false,
              background: "#fff",
              customClass: {
                popup: "swal-popup",
              },
            })

    } catch (error) {
      console.log('Error while creating main admin', error);
       Swal.fire({
              title: "Creation Failed",
              text: "Something went wrong. Please try again.",
              icon: "error",
              confirmButtonText: "Try Again",
              confirmButtonColor: "#d33",
              background: "#fff",
              customClass: {
                title: "swal-title",
                popup: "swal-popup",
              },
            });
    }
  };

  const handleReset = () => {
    setFormData({
      mainAdminName: "",
      mainAdminEmail: "",
      mainAdminPhone: "",
      mainAdminUsername: "",
      mainAdminPassword: "",
    });
  };

  return (
    <div className="bg-white shadow-lg p-5 create-admin">
      <div className="text-center mb-6 ">
        <h1 className="text-3xl font-bold text-gray-800 flex items-center justify-center">
          <UserPlus className="mr-3 text-blue-600" size={36} />
          Create Main Admin
        </h1>
        <p className="text-gray-500 mt-2">Set up a new administrator account</p>
      </div>

      <form className="space-y-8 p-4" onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-9">
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              <User className="inline-block mr-2 text-blue-600" size={20} />
              Full Name
            </label>
            <input
              type="text"
              name="mainAdminName"
              value={formData.mainAdminName}
              onChange={(e) => setFormData({ ...formData, mainAdminName: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
              placeholder="Enter full name"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              <Mail className="inline-block mr-2 text-blue-600" size={20} />
              Email Address
            </label>
            <input
              type="email"
              name="mainAdminEmail"
              value={formData.mainAdminEmail}
              onChange={(e) => setFormData({ ...formData, mainAdminEmail: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
              placeholder="Enter email address"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-9">
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              <Phone className="inline-block mr-2 text-blue-600" size={20} />
              Phone Number
            </label>
            <input
              type="tel"
              name="mainAdminPhone"
              value={formData.mainAdminPhone}
              onChange={(e) => setFormData({ ...formData, mainAdminPhone: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
              placeholder="Enter phone number"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              <User className="inline-block mr-2 text-blue-600" size={20} />
              Username
            </label>
            <input
              type="text"
              name="mainAdminUsername"
              value={formData.mainAdminUsername}
              onChange={(e) => setFormData({ ...formData, mainAdminUsername: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
              placeholder="Choose a username"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-gray-700 font-semibold mb-2">
            <Lock className="inline-block mr-2 text-blue-600" size={20} />
            Password
          </label>
          <input
            type="password"
            name="mainAdminPassword"
            value={formData.mainAdminPassword}
            onChange={(e) => setFormData({ ...formData, mainAdminPassword: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
            placeholder="Create a strong password"
            required
          />
        </div>

        <div className="flex justify-between mt-5">
          <button
            type="submit"
            className="flex items-center px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300 ease-in-out transform hover:scale-105"
          >
            <UserPlus className="mr-2" size={20} />
            Create Admin
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="flex items-center px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-300 ease-in-out transform hover:scale-105"
          >
            <X className="mr-2" size={20} />
            Reset
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateMainAdmin;