import React, { useState } from "react";
import axios from "axios";

export default function AdminCreateClubAdmin() {
  const backendUrl=import.meta.env.VITE_BACKEND_URL;
  const [formData, setFormData] = useState({
    memberId: "",
    clubId: "",
    username: "",
    password: "",
    fullName: "",
    email: "",
    phone: "",
    imageFile: null,
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

  const validateForm = () => {
    const newErrors = {};

    // Validate Member ID
    if (!formData.memberId.trim()) {
      newErrors.memberId = "Member ID is required";
    }

    // Validate Club ID
    if (!formData.clubId.trim()) {
      newErrors.clubId = "Club ID is required";
    }

    // Validate Username
    if (!formData.username.trim()) {
      newErrors.username = "Username is required";
    } else if (formData.username.length < 4) {
      newErrors.username = "Username must be at least 4 characters";
    }

    // Validate Password
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    // Validate Full Name
    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full Name is required";
    }

    // Validate Email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    // Validate Phone
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (formData.phone.length !== 10) {
      newErrors.phone = "Phone number must be exactly 10 digits";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Special handling for phone field to only allow numbers and max 10 digits
    if (name === "phone") {
      const numbersOnly = value.replace(/\D/g, "");
      const limitedLength = numbersOnly.slice(0, 10);
      setFormData({
        ...formData,
        [name]: limitedLength,
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }

    // Clear error for this field when user types
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null,
      });
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      const fileType = file.type.split("/")[0];
      if (fileType !== "image") {
        setErrors({
          ...errors,
          imageFile: "Please select an image file",
        });
        return;
      }

      // Clear error if valid
      if (errors.imageFile) {
        setErrors({
          ...errors,
          imageFile: null,
        });
      }

      setFormData({
        ...formData,
        imageFile: file,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate all fields
    const isValid = validateForm();
    if (!isValid) return;

    setIsSubmitting(true);
    setMessage({ text: "", type: "" });

    const data = new FormData();
    data.append("memberId", formData.memberId);
    data.append("clubId", formData.clubId);
    data.append("username", formData.username);
    data.append("password", formData.password);
    data.append("fullName", formData.fullName);
    data.append("email", formData.email);
    data.append("phone", formData.phone);
    if (formData.imageFile) {
      data.append("imageFile", formData.imageFile);
    }

    try {
      const response = await axios.post(
        `${backendUrl}/clubAdmin/${formData.memberId}/save/${formData.clubId}`,
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setMessage({ text: "Club Admin created successfully!", type: "success" });
      console.log(response.data);
      // Reset form after successful submission
      setFormData({
        memberId: "",
        clubId: "",
        username: "",
        password: "",
        fullName: "",
        email: "",
        phone: "",
        imageFile: null,
      });
      setErrors({});
    } catch (error) {
      setMessage({ text: "Failed to create Club Admin", type: "error" });
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="bg-indigo-600 py-6">
          <h1 className="text-center text-white font-bold text-3xl">
            Create Club Admin
          </h1>
        </div>

        {message.text && (
          <div
            className={`p-4 ${
              message.type === "success"
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            } text-lg`}
          >
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-700 text-base font-bold mb-2">
                Member ID <span className="text-red-500">*</span>
              </label>
              <input
                className={`shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-indigo-500 text-lg ${
                  errors.memberId ? "border-red-500" : ""
                }`}
                type="text"
                name="memberId"
                value={formData.memberId}
                onChange={handleChange}
                required
                placeholder="Enter member ID"
              />
              {errors.memberId && (
                <p className="text-red-500 text-sm mt-1">{errors.memberId}</p>
              )}
            </div>
            <div>
              <label className="block text-gray-700 text-base font-bold mb-2">
                Club ID <span className="text-red-500">*</span>
              </label>
              <input
                className={`shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-indigo-500 text-lg ${
                  errors.clubId ? "border-red-500" : ""
                }`}
                type="text"
                name="clubId"
                value={formData.clubId}
                onChange={handleChange}
                required
                placeholder="Enter club ID"
              />
              {errors.clubId && (
                <p className="text-red-500 text-sm mt-1">{errors.clubId}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-gray-700 text-base font-bold mb-2">
              Username <span className="text-red-500">*</span>
            </label>
            <input
              className={`shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-indigo-500 text-lg ${
                errors.username ? "border-red-500" : ""
              }`}
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              placeholder="Enter username (min 4 characters)"
            />
            {errors.username && (
              <p className="text-red-500 text-sm mt-1">{errors.username}</p>
            )}
          </div>

          <div>
            <label className="block text-gray-700 text-base font-bold mb-2">
              Password <span className="text-red-500">*</span>
            </label>
            <input
              className={`shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-indigo-500 text-lg ${
                errors.password ? "border-red-500" : ""
              }`}
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Enter password (min 6 characters)"
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password}</p>
            )}
          </div>

          <div>
            <label className="block text-gray-700 text-base font-bold mb-2">
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              className={`shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-indigo-500 text-lg ${
                errors.fullName ? "border-red-500" : ""
              }`}
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              required
              placeholder="Enter full name"
            />
            {errors.fullName && (
              <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-700 text-base font-bold mb-2">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                className={`shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-indigo-500 text-lg ${
                  errors.email ? "border-red-500" : ""
                }`}
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="Enter email"
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
            </div>
            <div>
              <label className="block text-gray-700 text-base font-bold mb-2">
                Phone <span className="text-red-500">*</span>
              </label>
              <input
                className={`shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-indigo-500 text-lg ${
                  errors.phone ? "border-red-500" : ""
                }`}
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                placeholder="Enter 10-digit phone number"
                maxLength="10"
                pattern="[0-9]{10}"
              />
              {errors.phone && (
                <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-gray-700 text-base font-bold mb-2">
              Profile Image
            </label>
            <div className="mt-2 flex items-center">
              <span className="inline-block h-16 w-16 rounded-full overflow-hidden bg-gray-100">
                {formData.imageFile ? (
                  <img
                    src={URL.createObjectURL(formData.imageFile)}
                    alt="Preview"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <svg
                    className="h-full w-full text-gray-300"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                )}
              </span>
              <label className="ml-5 bg-white py-3 px-4 border border-gray-300 rounded-md shadow-sm text-base leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 cursor-pointer">
                <span>Upload a file</span>
                <input
                  type="file"
                  name="imageFile"
                  className="sr-only"
                  onChange={handleFileChange}
                  accept="image/*"
                />
              </label>
              {errors.imageFile && (
                <p className="text-red-500 text-sm ml-3">{errors.imageFile}</p>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between pt-4">
            <p className="text-sm text-gray-600">
              Fields marked with <span className="text-red-500">*</span> are
              required
            </p>
            <button
              type="submit"
              className={`bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded focus:outline-none focus:shadow-outline text-lg ${
                isSubmitting ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Creating..." : "Create Club Admin"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
