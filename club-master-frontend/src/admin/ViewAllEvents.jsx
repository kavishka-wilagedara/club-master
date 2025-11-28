import axios from 'axios';
import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FaNewspaper, FaSpinner, FaTrash, FaTimes, FaCalendarAlt, FaTrophy, FaMapMarkerAlt, FaClock, FaThumbsUp, FaThumbsDown, FaComment } from 'react-icons/fa';
import { Modal, Button } from 'react-bootstrap';
import Swal from 'sweetalert2';

export default function ViewAllEvents() {
    const backendUrl=import.meta.env.VITE_BACKEND_URL;
 
    const [clubs, setClubs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    // Events modal states
    const [showModal, setShowModal] = useState(false);
    const [selectedClub, setSelectedClub] = useState(null);
    const [clubEvents, setClubEvents] = useState([]);
    const [loadingEvents, setLoadingEvents] = useState(false);
    const [eventsError, setEventsError] = useState(null);

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

    const handleViewEvents = async (club) => {
        setSelectedClub(club);
        setShowModal(true);
        setLoadingEvents(true);
        
        try {
            const response = await axios.get(`${backendUrl}/event/${club.clubId}/events`);
            setClubEvents(response.data);
            setEventsError(null);
        } catch (error) {
            console.error('Error fetching events:', error);
            setEventsError('Failed to load events. Please try again later.');
        } finally {
            setLoadingEvents(false);
        }
    };

    const handleDeleteEvent = (eventId) => {
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
                    await axios.delete(`${backendUrl}/event/delete/${eventId}`);
                    
                    // Update the events list
                    setClubEvents(clubEvents.filter(event => event.eventId !== eventId));
                    
                    Swal.fire(
                        'Deleted!',
                        'The event has been deleted successfully.',
                        'success'
                    );
                } catch (error) {
                    console.error('Error deleting event:', error);
                    Swal.fire(
                        'Error!',
                        'Failed to delete the event. Please try again.',
                        'error'
                    );
                }
            }
        });
    };

    const closeModal = () => {
        setShowModal(false);
        setSelectedClub(null);
        setClubEvents([]);
    };

    // Convert array date format [year, month, day] to a Date object
    const parseArrayDate = (dateArray) => {
        if (!dateArray || !Array.isArray(dateArray) || dateArray.length < 3) {
            return null;
        }
        // Note: Month is 0-indexed in JavaScript Date, but 1-indexed in the API response
        return new Date(dateArray[0], dateArray[1] - 1, dateArray[2]);
    };

    // Format date for display
    const formatDate = (dateArray) => {
        if (!dateArray) return 'Date not specified';
        
        const date = parseArrayDate(dateArray);
        if (!date) return 'Invalid date';
        
        return date.toLocaleDateString();
    };

    // Convert array time format [hour, minute, second?] to a formatted string
    const formatTime = (timeArray) => {
        if (!timeArray || !Array.isArray(timeArray) || timeArray.length < 2) {
            return 'Time not specified';
        }
        
        const hours = timeArray[0];
        const minutes = timeArray[1].toString().padStart(2, '0');
        const ampm = hours >= 12 ? 'PM' : 'AM';
        const displayHours = hours % 12 || 12;
        
        return `${displayHours}:${minutes} ${ampm}`;
    };

    // Function to determine if an event is upcoming, ongoing, or past
    const getEventStatus = (event) => {
        if (!event.scheduledDate) return 'unknown';
        
        const today = new Date();
        const eventDate = parseArrayDate(event.scheduledDate);
        
        if (!eventDate) return 'unknown';
        
        // Reset time parts for date comparison
        today.setHours(0, 0, 0, 0);
        eventDate.setHours(0, 0, 0, 0);
        
        if (eventDate.getTime() > today.getTime()) {
            return 'upcoming';
        } else if (eventDate.getTime() === today.getTime()) {
            return 'ongoing';
        } else {
            return 'past';
        }
    };

    // Function to get badge color based on event status
    const getStatusBadgeColor = (status) => {
        switch (status) {
            case 'upcoming':
                return '#2ecc71'; // Green
            case 'ongoing':
                return '#3498db'; // Blue
            case 'past':
                return '#95a5a6'; // Gray
            default:
                return '#e74c3c'; // Red
        }
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
                <p className="lead text-muted">Browse our clubs and discover events</p>
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
                                            onClick={() => handleViewEvents(club)}
                                            className="btn btn-primary w-100 d-flex align-items-center justify-content-center gap-2"
                                            style={{ backgroundColor: '#4a6cf7', borderColor: '#4a6cf7' }}
                                        >
                                            <FaCalendarAlt />
                                            <span>View Events</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Events Modal */}
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
                                <span>{selectedClub.clubName} - Events</span>
                            </div>
                        )}
                    </Modal.Title>
                    <Button variant="close" onClick={closeModal} aria-label="Close" />
                </Modal.Header>
                <Modal.Body style={{ maxHeight: '70vh', overflowY: 'auto' }}>
                    {loadingEvents ? (
                        <div className="text-center py-5">
                            <FaSpinner className="fa-spin mb-3" style={{ fontSize: '1.5rem', color: '#4a6cf7' }} />
                            <p>Loading events...</p>
                        </div>
                    ) : eventsError ? (
                        <div className="alert alert-danger">{eventsError}</div>
                    ) : clubEvents.length === 0 ? (
                        <div className="text-center py-4">
                            <p className="mb-0">No events available for this club.</p>
                        </div>
                    ) : (
                        <div className="row g-4">
                            {clubEvents.map((event) => {
                                const eventStatus = getEventStatus(event);
                                const statusColor = getStatusBadgeColor(eventStatus);
                                const likesCount = event.like?.membersLike?.length || 0;
                                const dislikesCount = event.like?.membersDislike?.length || 0;
                                const commentsCount = event.comments?.length || 0;
                                
                                return (
                                    <div key={event.eventId} className="col-md-6">
                                        <div className="card h-100 shadow-sm border-0 rounded-3">
                                            <div className="position-relative">
                                                <img 
                                                    src={event.eventImageUrl} 
                                                    alt={event.eventName}
                                                    className="card-img-top"
                                                    style={{ height: '180px', objectFit: 'cover' }}
                                                    onError={(e) => {
                                                        e.target.src = 'https://via.placeholder.com/300x180?text=Event';
                                                    }}
                                                />
                                                <div className="position-absolute top-0 start-0 m-2">
                                                    <span className="badge" style={{ backgroundColor: statusColor }}>
                                                        {eventStatus.charAt(0).toUpperCase() + eventStatus.slice(1)}
                                                    </span>
                                                </div>
                                                <button 
                                                    className="btn btn-danger btn-sm position-absolute top-0 end-0 m-2"
                                                    onClick={() => handleDeleteEvent(event.eventId)}
                                                >
                                                    <FaTrash />
                                                </button>
                                            </div>
                                            <div className="card-body">
                                                <h5 className="card-title fw-bold">{event.eventName}</h5>
                                                <div className="d-flex align-items-center mb-2 text-muted small">
                                                    <FaCalendarAlt className="me-1" />
                                                    <span>{formatDate(event.scheduledDate)}</span>
                                                    {event.scheduledTime && (
                                                        <>
                                                            <FaClock className="ms-2 me-1" />
                                                            <span>{formatTime(event.scheduledTime)}</span>
                                                        </>
                                                    )}
                                                </div>
                                                {event.eventLocation && (
                                                    <div className="d-flex align-items-center mb-2 text-muted small">
                                                        <FaMapMarkerAlt className="me-1" />
                                                        <span>{event.eventLocation}</span>
                                                    </div>
                                                )}
                                                <p className="card-text" style={{ 
                                                    overflow: 'hidden', 
                                                    textOverflow: 'ellipsis',
                                                    display: '-webkit-box',
                                                    WebkitLineClamp: 3,
                                                    WebkitBoxOrient: 'vertical'
                                                }}>
                                                    {event.description || "No description available."}
                                                </p>
                                                <div className="d-flex justify-content-between align-items-center mt-3">
                                                    <div className="small text-muted">
                                                        Published by: {event.publisherName || 'Unknown'}
                                                    </div>
                                                    <div className="d-flex gap-3">
                                                        <span className="d-flex align-items-center small text-muted">
                                                            <FaThumbsUp className="me-1 text-primary" />
                                                            {likesCount}
                                                        </span>
                                                        <span className="d-flex align-items-center small text-muted">
                                                            <FaThumbsDown className="me-1 text-danger" />
                                                            {dislikesCount}
                                                        </span>
                                                        <span className="d-flex align-items-center small text-muted">
                                                            <FaComment className="me-1 text-info" />
                                                            {commentsCount}
                                                        </span>
                                                    </div>
                                                </div>
                                                {event.eventType && (
                                                    <div className="mt-2">
                                                        <span className="badge bg-secondary">{event.eventType}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
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