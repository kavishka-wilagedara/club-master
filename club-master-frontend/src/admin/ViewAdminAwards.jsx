import axios from 'axios';
import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FaNewspaper, FaSpinner, FaTrash, FaTimes, FaCalendarAlt, FaTrophy } from 'react-icons/fa';
import { Modal, Button } from 'react-bootstrap';
import Swal from 'sweetalert2';

export default function ViewAdminAwards() {
    const backendUrl=import.meta.env.BACKEND_URL;

    const [clubs, setClubs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    // Awards modal states
    const [showModal, setShowModal] = useState(false);
    const [selectedClub, setSelectedClub] = useState(null);
    const [clubAwards, setClubAwards] = useState([]);
    const [loadingAwards, setLoadingAwards] = useState(false);
    const [awardsError, setAwardsError] = useState(null);

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

    const handleViewAwards = async (club) => {
        setSelectedClub(club);
        setShowModal(true);
        setLoadingAwards(true);
        
        try {
            const response = await axios.get(`${backendUrl}/award/${club.clubId}/getAllAwardsByClubId`);
            setClubAwards(response.data);
            setAwardsError(null);
        } catch (error) {
            console.error('Error fetching awards:', error);
            setAwardsError('Failed to load awards. Please try again later.');
        } finally {
            setLoadingAwards(false);
        }
    };

    const handleDeleteAward = (awardId) => {
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
                    await axios.delete(`${backendUrl}/award/${awardId}/deleteAward`);
                    
                    // Update the awards list after deletion
                    setClubAwards(clubAwards.filter(award => award.awardId !== awardId));
                    
                    Swal.fire(
                        'Deleted!',
                        'The award has been deleted.',
                        'success'
                    );
                } catch (error) {
                    console.error('Error deleting award:', error);
                    Swal.fire(
                        'Error!',
                        'Failed to delete the award.',
                        'error'
                    );
                }
            }
        });
    };

    const closeModal = () => {
        setShowModal(false);
        setSelectedClub(null);
        setClubAwards([]);
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
                <h1 className="display-4 fw-bold">Club Directory</h1>
                <p className="lead text-muted">Browse our clubs and discover the awards</p>
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
                                            onClick={() => handleViewAwards(club)}
                                            className="btn btn-primary w-100 d-flex align-items-center justify-content-center gap-2"
                                            style={{ backgroundColor: '#4a6cf7', borderColor: '#4a6cf7' }}
                                        >
                                            <FaTrophy />
                                            <span>View Awards</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Awards Modal */}
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
                                <span>{selectedClub.clubName} - Awards</span>
                            </div>
                        )}
                    </Modal.Title>
                    <Button variant="close" onClick={closeModal} aria-label="Close" />
                </Modal.Header>
                <Modal.Body style={{ maxHeight: '70vh', overflowY: 'auto' }}>
                    {loadingAwards ? (
                        <div className="text-center py-5">
                            <FaSpinner className="fa-spin mb-3" style={{ fontSize: '1.5rem', color: '#4a6cf7' }} />
                            <p>Loading awards...</p>
                        </div>
                    ) : awardsError ? (
                        <div className="alert alert-danger">{awardsError}</div>
                    ) : clubAwards.length === 0 ? (
                        <div className="text-center py-4">
                            <p className="mb-0">No awards available for this club.</p>
                        </div>
                    ) : (
                        <div className="row g-4">
                            {clubAwards.map((award) => (
                                <div key={award.awardId} className="col-md-6">
                                    <div className="card h-100 shadow-sm border-0 rounded-3">
                                        <div className="position-relative">
                                            <img 
                                                src={award.awardImageUrl} 
                                                alt={award.awardName}
                                                className="card-img-top"
                                                style={{ height: '180px', objectFit: 'cover' }}
                                                onError={(e) => {
                                                    e.target.src = 'https://via.placeholder.com/300x180?text=Award';
                                                }}
                                            />
                                            <button 
                                                className="btn btn-danger btn-sm position-absolute top-0 end-0 m-2"
                                                onClick={() => handleDeleteAward(award.awardId)}
                                            >
                                                <FaTrash />
                                            </button>
                                        </div>
                                        <div className="card-body">
                                            <h5 className="card-title fw-bold">{award.awardName}</h5>
                                            <div className="d-flex align-items-center mb-2 text-muted small">
                                                <FaCalendarAlt className="me-1" />
                                                <span>{award.awardDate ? formatDate(award.awardDate) : 'Date not specified'}</span>
                                            </div>
                                            <p className="card-text" style={{ 
                                                overflow: 'hidden', 
                                                textOverflow: 'ellipsis',
                                                display: '-webkit-box',
                                                WebkitLineClamp: 3,
                                                WebkitBoxOrient: 'vertical'
                                            }}>
                                                {award.description || "No description available."}
                                            </p>
                                            <div className="small text-muted mt-2">
                                                Published by: {award.publisherName || 'Unknown'}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
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