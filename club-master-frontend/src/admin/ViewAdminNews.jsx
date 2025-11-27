import axios from 'axios';
import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FaNewspaper, FaSpinner, FaTrash, FaTimes } from 'react-icons/fa';
import { Modal, Button } from 'react-bootstrap';
import Swal from 'sweetalert2';

export default function ViewAdminNews() {
    const [clubs, setClubs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    // News modal states
    const [showModal, setShowModal] = useState(false);
    const [selectedClub, setSelectedClub] = useState(null);
    const [clubNews, setClubNews] = useState([]);
    const [loadingNews, setLoadingNews] = useState(false);
    const [newsError, setNewsError] = useState(null);

    useEffect(() => {
        getAllClubs();
    }, []);

    const getAllClubs = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`http://localhost:7000/api/v1/club/all`);
            setClubs(response.data);
            setError(null);
        } catch (error) {
            console.error('Error fetching clubs:', error);
            setError('Failed to load clubs. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    const handleViewNews = async (club) => {
        setSelectedClub(club);
        setShowModal(true);
        await fetchClubNews(club.clubId);
    };

    const fetchClubNews = async (clubId) => {
        setLoadingNews(true);
        setNewsError(null);
        try {
            const response = await axios.get(`http://localhost:7000/api/v1/news/${clubId}/getAllNews`);
            setClubNews(response.data);
        } catch (error) {
            console.error('Error fetching news:', error);
            setNewsError('Failed to load news. Please try again later.');
            setClubNews([]);
        } finally {
            setLoadingNews(false);
        }
    };

    const handleDeleteNews = async (newsId) => {
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: 'You are about to delete this news. This action cannot be undone!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'Cancel'
        });
    
        if (result.isConfirmed) {
            try {
                await axios.delete(`http://localhost:7000/api/v1/news/delete/${newsId}`);
                // Refresh news list after deletion
                if (selectedClub) {
                    fetchClubNews(selectedClub.clubId);
                }
                Swal.fire(
                    'Deleted!',
                    'Your news has been deleted.',
                    'success'
                );
            } catch (error) {
                console.error('Error deleting news:', error);
                Swal.fire(
                    'Failed!',
                    'Failed to delete news. Please try again.',
                    'error'
                );
            }
        }
    };

    const closeModal = () => {
        setShowModal(false);
        setSelectedClub(null);
        setClubNews([]);
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
                <p className="lead text-muted">Browse our clubs and discover the latest news</p>
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
                                            onClick={() => handleViewNews(club)}
                                            className="btn btn-primary w-100 d-flex align-items-center justify-content-center gap-2"
                                            style={{ backgroundColor: '#4a6cf7', borderColor: '#4a6cf7' }}
                                        >
                                            <FaNewspaper />
                                            <span>View News</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* News Modal */}
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
                                <span>{selectedClub.clubName} - News</span>
                            </div>
                        )}
                    </Modal.Title>
                    <Button variant="close" onClick={closeModal} aria-label="Close" />
                </Modal.Header>
                <Modal.Body style={{ maxHeight: '70vh', overflowY: 'auto' }}>
                    {loadingNews ? (
                        <div className="text-center py-5">
                            <FaSpinner className="fa-spin mb-3" style={{ fontSize: '1.5rem', color: '#4a6cf7' }} />
                            <p>Loading news...</p>
                        </div>
                    ) : newsError ? (
                        <div className="alert alert-danger">{newsError}</div>
                    ) : clubNews.length === 0 ? (
                        <div className="text-center py-4">
                            <p className="mb-0">No news available for this club.</p>
                        </div>
                    ) : (
                        <div className="list-group">
                            {clubNews.map((news) => (
                                <div key={news.newsId} className="list-group-item list-group-item-action border-0 mb-3 shadow-sm rounded">
                                    <div className="d-flex justify-content-between align-items-start">
                                        <div className="ms-2 me-auto">
                                            <div className="fw-bold mb-1">{news.newsTitle}</div>
                                            <div className="text-muted small mb-2">{news.description}</div>
                                            <div className="d-flex align-items-center gap-3">
                                                <div className="badge bg-secondary rounded-pill">
                                                    {new Date(news.createdAt).toLocaleDateString()}
                                                </div>
                                                <div className="d-flex align-items-center">
                                                    <span className="text-primary me-1">
                                                        <i className="bi bi-hand-thumbs-up-fill"></i>
                                                    </span>
                                                    <span className="small">{news.like ? news.like.likeCount : 0}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <button 
                                            className="btn btn-outline-danger btn-sm"
                                            onClick={() => handleDeleteNews(news.newsId)}
                                        >
                                            <FaTrash />
                                        </button>
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