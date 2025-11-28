import axios from 'axios';
import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FaNewspaper, FaSpinner, FaTrash, FaTimes, FaCalendarAlt, FaTrophy, FaUserTie } from 'react-icons/fa';
import { Modal, Button } from 'react-bootstrap';
import Swal from 'sweetalert2';

export default function ViewAllAdminCLubAdmin() {
    const backendUrl=import.meta.env.VITE_BACKEND_URL;

    const [clubs, setClubs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    // Club Admins modal states
    const [showModal, setShowModal] = useState(false);
    const [selectedClub, setSelectedClub] = useState(null);
    const [clubAdmins, setClubAdmins] = useState([]);
    const [loadingAdmins, setLoadingAdmins] = useState(false);
    const [adminsError, setAdminsError] = useState(null);

    useEffect(() => {
        getAllClubs();
    }, []);

    const getAllClubs = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${backendUrl}/club/all`);
            setClubs(response.data);
            setError(null);
        } catch (error) {
            console.error('Error fetching clubs:', error);
            setError('Failed to load clubs. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    const handleViewClubAdmins = async (club) => {
        setSelectedClub(club);
        setShowModal(true);
        setLoadingAdmins(true);
        
        try {
            const response = await axios.get(`${backendUrl}/clubAdmin/allClubsAdmins/${club.clubId}`);
            setClubAdmins(response.data);
            setAdminsError(null);
        } catch (error) {
            console.error('Error fetching club admins:', error);
            setAdminsError('Failed to load club admins. Please try again later.');
        } finally {
            setLoadingAdmins(false);
        }
    };

    const handleDeleteClubAdmin = (clubAdminId) => {
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await axios.delete(`${backendUrl}/clubAdmin/delete/${clubAdminId}`);
                    
                    // Update local state to remove the deleted admin
                    setClubAdmins(clubAdmins.filter(admin => admin.clubAdminId !== clubAdminId));
                    
                    Swal.fire(
                        'Deleted!',
                        'Club admin has been removed.',
                        'success'
                    );
                } catch (error) {
                    console.error('Error deleting club admin:', error);
                    Swal.fire(
                        'Error!',
                        'Failed to delete club admin. Please try again.',
                        'error'
                    );
                }
            }
        });
    };

    const closeModal = () => {
        setShowModal(false);
        setSelectedClub(null);
        setClubAdmins([]);
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'Date not specified';
        return new Date(dateString).toLocaleDateString();
    };

    if (loading) {
        return (
            <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
                <div className="text-center">
                    <FaSpinner className="fa-spin mb-3" style={{ fontSize: '2rem', color: '#4a6cf7' }} />
                    <p className="lead">Loading clubs...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mt-5">
                <div className="alert alert-danger text-center" role="alert">
                    {error}
                    <button className="btn btn-outline-danger ms-3" onClick={getAllClubs}>Retry</button>
                </div>
            </div>
        );
    }

    return (
        <div className="container py-5">
            <header className="mb-5 text-center">
                <h1 className="display-4 fw-bold">View Club Admins</h1>
                <hr className="my-4 w-25 mx-auto" style={{ height: '3px', backgroundColor: '#4a6cf7' }} />
            </header>

            {clubs.length === 0 ? (
                <div className="text-center py-5">
                    <p className="lead">No clubs available at this time.</p>
                </div>
            ) : (
                <div className="row g-4">
                    {clubs.map((club) => (
                        <div key={club.clubId} className="col-md-6 col-lg-4">
                            <div className="card h-100 shadow-sm border-0 rounded-3 hover-elevation" 
                                style={{ transition: 'transform 0.3s, box-shadow 0.3s' }}>
                                <div className="d-flex justify-content-center align-items-center pt-4 pb-2">
                                    <div className="logo-container rounded-circle border border-3 border-light p-1 shadow" 
                                         style={{ width: '130px', height: '130px', overflow: 'hidden', backgroundColor: '#f8f9fa' }}>
                                        <img 
                                            src={club.clubLogoUrl} 
                                            alt={`${club.clubName} Logo`} 
                                            style={{ 
                                                width: '100%', 
                                                height: '100%', 
                                                objectFit: 'cover',
                                                borderRadius: '50%'
                                            }}
                                            onError={(e) => {
                                                e.target.src = 'https://via.placeholder.com/150?text=Club';
                                            }}
                                        />
                                    </div>
                                </div>
                                <div className="position-absolute top-0 end-0 m-3">
                                    <span className="badge rounded-pill" 
                                          style={{ backgroundColor: '#4a6cf7' }}>
                                        ID: {club.clubId}
                                    </span>
                                </div>
                                <div className="card-body d-flex flex-column">
                                    <h5 className="card-title fw-bold text-center mb-3">{club.clubName}</h5>
                                    <div className="card-text text-muted mb-4" style={{ 
                                        overflow: 'hidden', 
                                        textOverflow: 'ellipsis',
                                        display: '-webkit-box',
                                        WebkitLineClamp: 3,
                                        WebkitBoxOrient: 'vertical',
                                        lineHeight: '1.5rem',
                                        height: '4.5rem'
                                    }}>
                                        {club.clubDescription || "No description available."}
                                    </div>
                                    <div className="mt-auto">
                                        <button 
                                            onClick={() => handleViewClubAdmins(club)}
                                            className="btn btn-primary w-100 d-flex align-items-center justify-content-center gap-2"
                                            style={{ backgroundColor: '#4a6cf7', borderColor: '#4a6cf7' }}
                                        >
                                            <FaUserTie />
                                            <span>View Club Admins</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Club Admins Modal */}
            <Modal 
                show={showModal} 
                onHide={closeModal} 
                size="lg" 
                centered
                backdrop="static"
            >
                <Modal.Header className="bg-light">
                    <Modal.Title>
                        {selectedClub && (
                            <div className="d-flex align-items-center">
                                <img 
                                    src={selectedClub.clubLogoUrl} 
                                    alt={`${selectedClub.clubName} Logo`}
                                    style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '50%', marginRight: '10px' }}
                                    onError={(e) => {
                                        e.target.src = 'https://via.placeholder.com/40?text=C';
                                    }}
                                />
                                <span>{selectedClub.clubName} - Club Admins</span>
                            </div>
                        )}
                    </Modal.Title>
                    <Button variant="close" onClick={closeModal} aria-label="Close" />
                </Modal.Header>
                <Modal.Body style={{ maxHeight: '70vh', overflowY: 'auto' }}>
                    {loadingAdmins ? (
                        <div className="text-center py-5">
                            <FaSpinner className="fa-spin mb-3" style={{ fontSize: '1.5rem', color: '#4a6cf7' }} />
                            <p>Loading club admins...</p>
                        </div>
                    ) : adminsError ? (
                        <div className="alert alert-danger">{adminsError}</div>
                    ) : clubAdmins.length === 0 ? (
                        <div className="text-center py-4">
                            <p className="mb-0">No admins available for this club.</p>
                        </div>
                    ) : (
                        <div className="table-responsive">
                            <table className="table table-hover">
                                <thead className="table-light">
                                    <tr>
                                        <th scope="col">#</th>
                                        <th scope="col">Admin ID</th>
                                        <th scope="col">Member ID</th>
                                        <th scope="col">Position</th>
                                        <th scope="col">Since</th>
                                        <th scope="col">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {clubAdmins.map((admin, index) => (
                                        <tr key={admin.clubAdminId}>
                                            <td>{index + 1}</td>
                                            <td>{admin.clubAdminId}</td>
                                            <td>{admin.memberId}</td>
                                            <td>{admin.position || 'Not specified'}</td>
                                            <td>{admin.createdDate ? formatDate(admin.createdDate) : 'Not specified'}</td>
                                            <td>
                                                <button 
                                                    className="btn btn-danger btn-sm"
                                                    onClick={() => handleDeleteClubAdmin(admin.clubAdminId)}
                                                >
                                                    <FaTrash />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={closeModal}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>

            <style jsx>{`
                .hover-elevation:hover {
                    transform: translateY(-5px);
                    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1) !important;
                }
                @media (max-width: 768px) {
                    .display-4 {
                        font-size: 2rem;
                    }
                }
                .fa-spin {
                    animation: fa-spin 2s infinite linear;
                }
                @keyframes fa-spin {
                    0% {
                        transform: rotate(0deg);
                    }
                    100% {
                        transform: rotate(360deg);
                    }
                }
            `}</style>
        </div>
    );
}