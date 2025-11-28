import React, { useContext, useEffect, useState } from 'react';
import { UserContext } from '../common/UserContext';
import axios from 'axios';

export default function MainAdminProfile() {
    const backendUrl=import.meta.env.VITE_BACKEND_URL;

    const { user } = useContext(UserContext);
    const [admin, setAdmin] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [formData, setFormData] = useState({
        mainAdminName: '',
        mainAdminEmail: '',
        mainAdminPhone: '',
        mainAdminUsername: '',
        mainAdminPassword: ''
    });
    const [updateMessage, setUpdateMessage] = useState({ type: '', message: '' });

    // Fetch admin data on component mount
    useEffect(() => {
        const fetchAdminData = async () => {
            try {
                const response = await axios.get(`${backendUrl}/mainAdmin/find-mainAdmin/${user.id}`);
                setAdmin(response.data);
                setFormData({
                    mainAdminName: response.data.mainAdminName,
                    mainAdminEmail: response.data.mainAdminEmail,
                    mainAdminPhone: response.data.mainAdminPhone,
                    mainAdminUsername: response.data.mainAdminUsername,
                    mainAdminPassword: ''
                });
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        fetchAdminData();
    }, [user.id]);

    // Handle input changes for the form
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    // Handle image selection and preview
    const handleImageChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setSelectedImage(file);

            // Create preview URL
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setUpdateMessage({ type: '', message: '' });

        try {
            // Create FormData object to send both JSON and file
            const updateFormData = new FormData();

            // Create admin object with all fields
            const adminDataToUpdate = {
                ...admin,
                mainAdminName: formData.mainAdminName,
                mainAdminEmail: formData.mainAdminEmail,
                mainAdminPhone: formData.mainAdminPhone,
                mainAdminUsername: formData.mainAdminUsername
            };

            // Add password only if provided
            if (formData.mainAdminPassword && formData.mainAdminPassword.trim() !== '') {
                adminDataToUpdate.mainAdminPassword = formData.mainAdminPassword;
            }

            // Convert admin object to JSON string
            updateFormData.append('mainAdmin', JSON.stringify(adminDataToUpdate));

            // Add image file if selected
            if (selectedImage) {
                updateFormData.append('file', selectedImage);
            } else {
                // Create an empty blob as a placeholder to satisfy controller requirements
                const emptyBlob = new Blob([''], { type: 'application/octet-stream' });
                updateFormData.append('file', emptyBlob);
            }

            // Send update request
            const response = await axios.put(
                `${backendUrl}/mainAdmin/update/${admin.mainAdminId}`,
                updateFormData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                }
            );

            if (response.status === 200) {
                // Refresh admin data
                const updatedAdminResponse = await axios.get(`${backendUrl}/mainAdmin/find-mainAdmin/${admin.mainAdminId}`);
                setAdmin(updatedAdminResponse.data);

                setUpdateMessage({ type: 'success', message: 'Profile updated successfully' });
                setIsEditing(false);
                setSelectedImage(null);
                setImagePreview(null);

                // Reset password field
                setFormData({
                    ...formData,
                    mainAdminPassword: ''
                });
            }
        } catch (err) {
            console.error('Update error:', err);
            setUpdateMessage({
                type: 'danger',
                message: err.response?.data || 'Failed to update profile. Please try again.'
            });
        }
    };

    // Handle cancel button click
    const handleCancel = () => {
        setIsEditing(false);
        setSelectedImage(null);
        setImagePreview(null);

        // Reset form data to current admin values
        if (admin) {
            setFormData({
                mainAdminName: admin.mainAdminName,
                mainAdminEmail: admin.mainAdminEmail,
                mainAdminPhone: admin.mainAdminPhone,
                mainAdminUsername: admin.mainAdminUsername,
                mainAdminPassword: ''
            });
        }
    };

    // Loading state
    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center min-vh-50">
                <div className="spinner-grow text-primary" role="status" style={{ width: '3rem', height: '3rem' }}>
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="alert alert-danger shadow-sm rounded-3 p-4 mx-auto my-5" style={{ maxWidth: '800px' }}>
                <div className="d-flex align-items-center">
                    <i className="bi bi-exclamation-triangle-fill fs-1 me-3 text-danger"></i>
                    <div>
                        <h4 className="alert-heading mb-2">Error Loading Profile</h4>
                        <p className="mb-0">{error.message || 'Unable to load admin profile. Please try again later.'}</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="container py-5">
            {/* Success/Error Messages */}
            {updateMessage.message && (
                <div className={`alert alert-${updateMessage.type} shadow-sm fade show mb-4 animate__animated animate__fadeIn`} role="alert">
                    <div className="d-flex align-items-center">
                        <i className={`bi ${updateMessage.type === 'success' ? 'bi-check-circle-fill text-success' : 'bi-exclamation-circle-fill text-danger'} fs-4 me-2`}></i>
                        <div>{updateMessage.message}</div>
                        <button type="button" className="btn-close ms-auto" onClick={() => setUpdateMessage({ type: '', message: '' })}></button>
                    </div>
                </div>
            )}

            <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
                {/* Card Header with Gradient Background */}
                <div className="card-header bg-gradient p-4" style={{ background: 'linear-gradient(135deg, #4a6cf7, #2541b2)' }}>
                    <div className="d-flex justify-content-between align-items-center">
                        <h3 className="text-white mb-0 fw-bold">
                            <i className="bi bi-person-badge-fill me-2"></i>
                            Admin Profile
                        </h3>
                        {!isEditing && admin && (
                            <button
                                className="btn btn-light btn-sm rounded-pill px-4 py-2 shadow-sm"
                                onClick={() => setIsEditing(true)}
                            >
                                <i className="bi bi-pencil-fill me-2"></i>
                                Edit Profile
                            </button>
                        )}
                    </div>
                </div>

                <div className="card-body p-0">
                    {admin && !isEditing ? (
                        // Display Mode - Profile View
                        <div className="row g-0">
                            {/* Left Side - Profile Image */}
                            <div className="col-lg-4 bg-light p-4 text-center d-flex flex-column justify-content-center align-items-center" style={{ minHeight: '400px' }}>
                                <div className="position-relative mb-4">
                                    {admin.mainAdminImageUrl ? (
                                        <img
                                            src={admin.mainAdminImageUrl}
                                            alt="Admin Profile"
                                            className="rounded-circle shadow border border-5 border-white"
                                            style={{ height: '200px', width: '200px', objectFit: 'cover' }}
                                        />
                                    ) : (
                                        <div className="rounded-circle shadow d-flex align-items-center justify-content-center bg-white border border-5 border-light"
                                            style={{ height: '200px', width: '200px' }}>
                                            <i className="bi bi-person-fill" style={{ fontSize: '6rem', color: '#4a6cf7' }}></i>
                                        </div>
                                    )}
                                    <div className="position-absolute bottom-0 end-0 bg-success rounded-circle p-2 border border-3 border-white">
                                        <i className="bi bi-check-lg text-white"></i>
                                    </div>
                                </div>
                                <h4 className="fw-bold mb-1">{admin.mainAdminName}</h4>
                                <p className="text-muted mb-2">{admin.mainAdminUsername}</p>
                                <div className="badge bg-primary bg-opacity-10 text-primary px-3 py-2 rounded-pill">
                                    Main Administrator
                                </div>
                            </div>

                            {/* Right Side - Profile Details */}
                            <div className="col-lg-8 p-4 p-lg-5">
                                <h4 className="fw-bold mb-4 border-bottom pb-3">Profile Information</h4>
                                <div className="row g-4">
                                    <div className="col-md-6">
                                        <div className="mb-4">
                                            <label className="small text-muted d-block mb-1">Admin ID</label>
                                            <div className="d-flex align-items-center">
                                                <i className="bi bi-fingerprint text-primary me-2"></i>
                                                <span className="fs-5">{admin.mainAdminId}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="mb-4">
                                            <label className="small text-muted d-block mb-1">Full Name</label>
                                            <div className="d-flex align-items-center">
                                                <i className="bi bi-person-circle text-primary me-2"></i>
                                                <span className="fs-5">{admin.mainAdminName}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="mb-4">
                                            <label className="small text-muted d-block mb-1">Username</label>
                                            <div className="d-flex align-items-center">
                                                <i className="bi bi-at text-primary me-2"></i>
                                                <span className="fs-5">{admin.mainAdminUsername}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="mb-4">
                                            <label className="small text-muted d-block mb-1">Email Address</label>
                                            <div className="d-flex align-items-center">
                                                <i className="bi bi-envelope text-primary me-2"></i>
                                                <span className="fs-5">{admin.mainAdminEmail}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="mb-4">
                                            <label className="small text-muted d-block mb-1">Phone Number</label>
                                            <div className="d-flex align-items-center">
                                                <i className="bi bi-telephone text-primary me-2"></i>
                                                <span className="fs-5">{admin.mainAdminPhone || 'Not provided'}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="mb-4">
                                            <label className="small text-muted d-block mb-1">Account Status</label>
                                            <div className="d-flex align-items-center">
                                                <i className="bi bi-shield-check text-primary me-2"></i>
                                                <span className="badge bg-success px-3 py-2">Active</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : admin && isEditing ? (
                        // Edit Mode - Profile Form
                        <form onSubmit={handleSubmit} className="p-4">
                            <div className="row">
                                {/* Left Side - Profile Image */}
                                <div className="col-lg-4 text-center mb-4 mb-lg-0">
                                    <div className="position-relative mb-4 mx-auto" style={{ width: '200px' }}>
                                        {imagePreview ? (
                                            <img
                                                src={imagePreview}
                                                alt="Profile Preview"
                                                className="rounded-circle border border-4 border-white shadow"
                                                style={{ height: '200px', width: '200px', objectFit: 'cover' }}
                                            />
                                        ) : admin.mainAdminImageUrl ? (
                                            <img
                                                src={admin.mainAdminImageUrl}
                                                alt="Admin Profile"
                                                className="rounded-circle border border-4 border-white shadow"
                                                style={{ height: '200px', width: '200px', objectFit: 'cover' }}
                                            />
                                        ) : (
                                            <div className="rounded-circle d-flex align-items-center justify-content-center bg-light border border-4 border-white shadow"
                                                style={{ height: '200px', width: '200px' }}>
                                                <i className="bi bi-person" style={{ fontSize: '5rem', color: '#4a6cf7' }}></i>
                                            </div>
                                        )}

                                        <label htmlFor="profileImage" className="position-absolute bottom-0 end-0 bg-primary rounded-circle p-2 shadow cursor-pointer" 
                                               style={{ cursor: 'pointer' }}>
                                            <i className="bi bi-camera-fill text-white"></i>
                                            <input
                                                type="file"
                                                id="profileImage"
                                                accept="image/*"
                                                onChange={handleImageChange}
                                                className="d-none"
                                            />
                                        </label>
                                    </div>
                                    <div className="small text-muted mb-4">Click the camera icon to change your profile image</div>
                                    
                                    <div className="card shadow-sm border-0 bg-light rounded-4 p-3 mb-4">
                                        <h5 className="fw-bold mb-3">Update Password</h5>
                                        <div className="mb-3">
                                            <label htmlFor="mainAdminPassword" className="form-label">New Password</label>
                                            <div className="input-group">
                                                <span className="input-group-text bg-white">
                                                    <i className="bi bi-lock-fill text-primary"></i>
                                                </span>
                                                <input
                                                    type="password"
                                                    className="form-control"
                                                    id="mainAdminPassword"
                                                    name="mainAdminPassword"
                                                    value={formData.mainAdminPassword}
                                                    onChange={handleInputChange}
                                                    placeholder="Leave blank to keep current"
                                                />
                                            </div>
                                            <div className="form-text">
                                                <i className="bi bi-info-circle me-1"></i>
                                                Fill only if you want to change your password
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Right Side - Profile Form */}
                                <div className="col-lg-8">
                                    <h4 className="fw-bold mb-4 pb-2 border-bottom">Edit Profile Information</h4>
                                    
                                    <div className="row g-3">
                                        <div className="col-md-6">
                                            <div className="mb-3">
                                                <label htmlFor="mainAdminId" className="form-label">Admin ID</label>
                                                <div className="input-group">
                                                    <span className="input-group-text bg-light">
                                                        <i className="bi bi-fingerprint text-primary"></i>
                                                    </span>
                                                    <input
                                                        type="text"
                                                        className="form-control bg-light"
                                                        id="mainAdminId"
                                                        value={admin.mainAdminId}
                                                        readOnly
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <div className="col-md-6">
                                            <div className="mb-3">
                                                <label htmlFor="mainAdminUsername" className="form-label">Username</label>
                                                <div className="input-group">
                                                    <span className="input-group-text bg-light">
                                                        <i className="bi bi-at text-primary"></i>
                                                    </span>
                                                    <input
                                                        type="text"
                                                        className="form-control bg-light"
                                                        id="mainAdminUsername"
                                                        name="mainAdminUsername"
                                                        value={formData.mainAdminUsername}
                                                        onChange={handleInputChange}
                                                        readOnly
                                                    />
                                                </div>
                                                <div className="form-text">
                                                    <i className="bi bi-info-circle me-1"></i>
                                                    Username cannot be changed
                                                </div>
                                            </div>
                                        </div>

                                        <div className="col-md-12">
                                            <div className="mb-3">
                                                <label htmlFor="mainAdminName" className="form-label">Full Name</label>
                                                <div className="input-group">
                                                    <span className="input-group-text">
                                                        <i className="bi bi-person-fill text-primary"></i>
                                                    </span>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        id="mainAdminName"
                                                        name="mainAdminName"
                                                        value={formData.mainAdminName}
                                                        onChange={handleInputChange}
                                                        required
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="col-md-6">
                                            <div className="mb-3">
                                                <label htmlFor="mainAdminEmail" className="form-label">Email Address</label>
                                                <div className="input-group">
                                                    <span className="input-group-text">
                                                        <i className="bi bi-envelope-fill text-primary"></i>
                                                    </span>
                                                    <input
                                                        type="email"
                                                        className="form-control"
                                                        id="mainAdminEmail"
                                                        name="mainAdminEmail"
                                                        value={formData.mainAdminEmail}
                                                        onChange={handleInputChange}
                                                        required
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="col-md-6">
                                            <div className="mb-3">
                                                <label htmlFor="mainAdminPhone" className="form-label">Phone Number</label>
                                                <div className="input-group">
                                                    <span className="input-group-text">
                                                        <i className="bi bi-telephone-fill text-primary"></i>
                                                    </span>
                                                    <input
                                                        type="tel"
                                                        className="form-control"
                                                        id="mainAdminPhone"
                                                        name="mainAdminPhone"
                                                        value={formData.mainAdminPhone}
                                                        onChange={handleInputChange}
                                                        placeholder="Enter phone number"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="d-flex justify-content-end gap-2 mt-4 pt-3 border-top">
                                        <button
                                            type="button"
                                            className="btn btn-light px-4 py-2"
                                            onClick={handleCancel}
                                        >
                                            <i className="bi bi-x-circle me-2"></i>
                                            Cancel
                                        </button>
                                        <button type="submit" className="btn btn-primary px-4 py-2">
                                            <i className="bi bi-check2-circle me-2"></i>
                                            Save Changes
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </form>
                    ) : (
                        <div className="alert alert-warning m-4 d-flex align-items-center">
                            <i className="bi bi-exclamation-triangle-fill fs-1 me-3"></i>
                            <div>
                                <h4 className="alert-heading">No Admin Data Found</h4>
                                <p className="mb-0">Unable to locate administrator profile information. Please try refreshing the page or contact technical support.</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}