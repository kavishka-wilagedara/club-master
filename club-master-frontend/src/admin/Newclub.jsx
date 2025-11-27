import React, { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

const ClubRegistrationForm = () => {
  // State for form data
  const [formData, setFormData] = useState({
    clubName: '',
    clubAddress: '',
    clubSeniorAdviser: '',
    clubProducer: '',
    clubVision: '',
    clubEmail: '',
    clubPhone: '',
    clubDescription: '',
    clubLogoUrl: null, // File for club logo
    backgroundImageUrls: [] // Files for background images
  });

  // State for image previews
  const [clubLogoPreview, setClubLogoPreview] = useState(null);
  const [backgroundImagePreviews, setBackgroundImagePreviews] = useState([]);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle file uploads
  const handleImageChange = (e) => {
    const { name, files } = e.target;

    if (name === 'clubLogoUrl') {
      const file = files[0];
      setFormData((prev) => ({
        ...prev,
        clubLogoUrl: file
      }));
      // Generate preview URL for club logo
      setClubLogoPreview(URL.createObjectURL(file));
    } else if (name.startsWith('backgroundImageUrl')) {
      const file = files[0];
      setFormData((prev) => ({
        ...prev,
        backgroundImageUrls: [...prev.backgroundImageUrls, file]
      }));
      // Generate preview URL for background images
      setBackgroundImagePreviews((prev) => [...prev, URL.createObjectURL(file)]);
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Create FormData object
    const formDataToSend = new FormData();

    // Append club details as JSON (excluding files)
    const { clubLogoUrl, backgroundImageUrls, ...clubData } = formData; // Exclude files from JSON
    formDataToSend.append('clubJason', JSON.stringify(clubData));

    // Append club logo file
    if (formData.clubLogoUrl) {
      formDataToSend.append('clubLogo', formData.clubLogoUrl);
    }

    // Append background images
    if (formData.backgroundImageUrls) {
      formData.backgroundImageUrls.forEach((image) => {
        formDataToSend.append('backgroundImages', image);
      });
    }

    try {
      // Send data to backend
      const response = await axios.post('http://localhost:7000/api/v1/club/save', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      // Show success message
      Swal.fire({
        title: 'Success!',
        text: 'Club registered successfully.',
        icon: 'success',
        timer: 1500,
        showConfirmButton: false
      });

      // Reset form
      handleReset();
    } catch (error) {
      // Show error message
      Swal.fire({
        title: 'Error!',
        text: error.response ? error.response.data : 'Something went wrong.',
        icon: 'error',
        confirmButtonText: 'Try Again'
      });
    }
  };

  // Reset form fields
  const handleReset = () => {
    setFormData({
      clubName: '',
      clubAddress: '',
      clubSeniorAdviser: '',
      clubProducer: '',
      clubVision: '',
      clubEmail: '',
      clubPhone: '',
      clubDescription: '',
      clubLogoUrl: null,
      backgroundImageUrls: []
    });
    setClubLogoPreview(null);
    setBackgroundImagePreviews([]);
  };

  return (
    <div className="flex-1 p-5 mx-auto bg-white rounded-lg shadow-lg p-8 mt-10" style={{ boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)', width: '1100px', height: 'auto' }}>
      <h2 className="text-2xl font-bold text-center mb-6">New Club Registration</h2>
      <form className="space-y-4" onSubmit={handleSubmit}>
        {/* Club Name and Address */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Club Name
            </label>
            <input
              type="text"
              name="clubName"
              value={formData.clubName}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter club name"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Club Address
            </label>
            <input
              type="text"
              name="clubAddress"
              value={formData.clubAddress}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter club address"
              required
            />
          </div>
        </div>

        {/* Senior Advisor and Club Producer */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Senior Advisor
            </label>
            <input
              type="text"
              name="clubSeniorAdviser"
              value={formData.clubSeniorAdviser}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter senior advisor name"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Club Producer
            </label>
            <input
              type="text"
              name="clubProducer"
              value={formData.clubProducer}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter club producer name"
              required
            />
          </div>
        </div>

        {/* Club Vision */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Club Vision
          </label>
          <textarea
            name="clubVision"
            value={formData.clubVision}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter club vision"
            rows={3}
            required
          />
        </div>

        {/* Club Email and Phone */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Club Email
            </label>
            <input
              type="email"
              name="clubEmail"
              value={formData.clubEmail}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter club email"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Club Phone
            </label>
            <input
              type="tel"
              name="clubPhone"
              value={formData.clubPhone}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter club phone"
              required
            />
          </div>
        </div>

        {/* Club Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Club Description
          </label>
          <textarea
            name="clubDescription"
            value={formData.clubDescription}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter club description"
            rows={3}
            required
          />
        </div>

        {/* Club Logo */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Club Logo
          </label>
          <div className="mt-1 flex items-center justify-center w-full">
            <label className="w-full flex flex-col items-center justify-center h-24 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
              {clubLogoPreview ? (
                <img
                  src={clubLogoPreview}
                  alt="Club Logo Preview"
                  className="w-full h-full object-cover rounded-lg"
                />
              ) : (
                <div className="flex flex-col items-center justify-center pt-2">
                  <svg
                    className="h-6 w-6 text-gray-400 mb-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                    />
                  </svg>
                  <p className="text-sm text-gray-500">Click to upload logo</p>
                </div>
              )}
              <input
                type="file"
                name="clubLogoUrl"
                className="hidden"
                onChange={handleImageChange}
                accept="image/*"
                required
              />
            </label>
          </div>
        </div>

        {/* Background Images */}
        <div className="grid grid-cols-3 gap-4">
          {[1, 2, 3].map((num, index) => (
            <div key={num}>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Background Image {num}
              </label>
              <div className="mt-1 flex items-center justify-center w-full">
                <label className="w-full flex flex-col items-center justify-center h-24 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                  {backgroundImagePreviews[index] ? (
                    <img
                      src={backgroundImagePreviews[index]}
                      alt={`Background Image ${num} Preview`}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center pt-2">
                      <svg
                        className="h-6 w-6 text-gray-400 mb-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                        />
                      </svg>
                      <p className="text-xs text-gray-500">Image</p>
                    </div>
                  )}
                  <input
                    type="file"
                    name={`backgroundImageUrl${num}`}
                    className="hidden"
                    onChange={handleImageChange}
                    accept="image/*"
                    required
                  />
                </label>
              </div>
            </div>
          ))}
        </div>

        {/* Buttons */}
        <div className="flex gap-5">
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 mt-6"
          >
            Register Club
          </button>

          <button
            type="button"
            className="w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 mt-6"
            onClick={handleReset}
          >
            Reset
          </button>
        </div>
      </form>
    </div>
  );
};

export default ClubRegistrationForm;

