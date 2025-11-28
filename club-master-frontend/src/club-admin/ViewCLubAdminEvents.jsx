import React, { useContext, useEffect, useState } from 'react';
import { UserContext } from '../common/UserContext';
import axios from 'axios';
import Swal from 'sweetalert2';

export default function ViewClubAdminEvents() {
      const backendUrl=import.meta.env.BACKEND_URL;

    const [events, setEvents] = useState([]);
    const { user } = useContext(UserContext);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [currentEvent, setCurrentEvent] = useState(null);
    const [formData, setFormData] = useState(null);
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState('');
    const [updating, setUpdating] = useState(false);
    // New state for comments modal
    const [showCommentsModal, setShowCommentsModal] = useState(false);
    const [selectedEventComments, setSelectedEventComments] = useState([]);
    const [selectedEventName, setSelectedEventName] = useState('');

    const clubId = user?.id?.split(':')[0];
    const clubAdminId = user?.id;

    useEffect(() => {
        getAllEvents();
    }, []);

    const getAllEvents = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${backendUrl}/event/${clubId}/events`);
            console.log(response.data);
            setEvents(response.data);
            setLoading(false);
        } catch (error) {
            console.log('error while getting clubs', error);
            setError('Failed to load events. Please try again later.');
            setLoading(false);
        }
    };

    // Format date array to readable string
    const formatDate = (dateArray) => {
        if (!dateArray) return 'TBD';
        const [year, month, day] = dateArray;
        return new Date(year, month - 1, day).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    // Format time array to readable string
    const formatTime = (timeArray) => {
        if (!timeArray) return 'TBD';
        const [hours, minutes] = timeArray;
        return new Date(0, 0, 0, hours, minutes).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // Format date for date input
    const formatDateForInput = (dateArray) => {
        if (dateArray && dateArray.length === 3) {
            const [year, month, day] = dateArray;
            // Month and day need to be zero-padded
            const formattedMonth = month.toString().padStart(2, '0');
            const formattedDay = day.toString().padStart(2, '0');
            return `${year}-${formattedMonth}-${formattedDay}`;
        }
        return '';
    };
    
    // Format time for time input
    const formatTimeForInput = (timeArray) => {
        if (timeArray && timeArray.length === 2) {
            const [hours, minutes] = timeArray;
            // Hours and minutes need to be zero-padded
            const formattedHours = hours.toString().padStart(2, '0');
            const formattedMinutes = minutes.toString().padStart(2, '0');
            return `${formattedHours}:${formattedMinutes}`;
        }
        return '';
    };

    const handleEdit = (eventId) => {
        const eventToEdit = events.find(event => event.eventId === eventId);
        if (eventToEdit) {
            setCurrentEvent(eventToEdit);
            setFormData({...eventToEdit});
            setImagePreview(eventToEdit.eventImageUrl);
            setShowEditModal(true);
        }
    };

    const handleDelete = async (eventId) => {
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: 'You will not be able to recover this event!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        });
    
        if (result.isConfirmed) {
            try {
                await axios.delete(`${backendUrl}/event/delete/${eventId}`);
                setEvents(events.filter(event => event.eventId !== eventId));
                Swal.fire(
                    'Deleted!',
                    'Your event has been deleted.',
                    'success'
                );
            } catch (error) {
                console.error('Error deleting event:', error);
                Swal.fire(
                    'Failed!',
                    'Failed to delete event. Please try again.',
                    'error'
                );
            }
        }
    };

    // New function to handle viewing comments
    const handleViewComments = (event) => {
        setSelectedEventComments(event.comments || []);
        setSelectedEventName(event.eventName);
        setShowCommentsModal(true);
    };

    const handleCloseCommentsModal = () => {
        setShowCommentsModal(false);
        setSelectedEventComments([]);
        setSelectedEventName('');
    };

    const handleCloseModal = () => {
        setShowEditModal(false);
        setCurrentEvent(null);
        setFormData(null);
        setImageFile(null);
        setImagePreview('');
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };
    
    const handleDateChange = (e) => {
        const dateValue = e.target.value;
        if (dateValue) {
            const [year, month, day] = dateValue.split('-').map(Number);
            setFormData({
                ...formData,
                scheduledDate: [year, month, day]
            });
        }
    };
    
    const handleTimeChange = (e) => {
        const timeValue = e.target.value;
        if (timeValue) {
            const [hours, minutes] = timeValue.split(':').map(Number);
            setFormData({
                ...formData,
                scheduledTime: [hours, minutes]
            });
        }
    };
    
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            // Create preview URL
            const previewUrl = URL.createObjectURL(file);
            setImagePreview(previewUrl);
        }
    };
    
    const handleSubmitEdit = async (e) => {
        e.preventDefault();
        
        try {
            setUpdating(true);
            
            // Create FormData for file upload
            const formDataObj = new FormData();
            formDataObj.append('event', JSON.stringify(formData));
            
            if (imageFile) {
                // Changed from 'eventImage' to 'file' to match the backend controller's expected parameter name
                formDataObj.append('file', imageFile);
            } else {
                // Handle case where no new image is selected
                // This ensures we explicitly tell the server there's no new image
                formDataObj.append('file', new Blob([''], { type: 'application/octet-stream' }));
            }
            
            // Use PUT request for update
            const response = await axios.put(
                `${backendUrl}/event/${clubAdminId}/update/${currentEvent.eventId}`,
                formDataObj,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                }
            );
            
            // Check if response was successful
            if (response.status === 200) {
                // Update the events list with the updated event
                getAllEvents();
                
                // Close the modal
                handleCloseModal();
                
                Swal.fire({
                    title: 'Success!',
                    text: 'Event updated successfully!',
                    icon: 'success',
                    confirmButtonColor: '#3085d6'
                });
            }
        } catch (error) {
            console.error('Error updating event:', error);
            
            Swal.fire({
                title: 'Error!',
                text: 'Failed to update event. Please try again.',
                icon: 'error',
                confirmButtonColor: '#3085d6'
            });
        } finally {
            setUpdating(false);
        }
    };

    if (loading) return <div className="p-4 text-center">Loading events...</div>;
    if (error) return <div className="p-4 text-center text-red-500">{error}</div>;
    if (events.length === 0) return <div className="p-4 text-center">No events found.</div>;

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-6">Club Events</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {events.map((event) => (
                    <div key={event.eventId} className="bg-white rounded-lg shadow-md overflow-hidden">
                        <div className="h-48 overflow-hidden relative">
                            <img 
                                src={event.eventImageUrl} 
                                alt={event.eventName} 
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = 'https://via.placeholder.com/400x200?text=Event+Image';
                                }}
                            />
                            <div className="absolute top-2 right-2 flex space-x-2">
                                <button 
                                    onClick={() => handleEdit(event.eventId)}
                                    className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-full shadow"
                                    title="Edit Event"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path>
                                    </svg>
                                </button>
                                <button 
                                    onClick={() => handleDelete(event.eventId)}
                                    className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-full shadow"
                                    title="Delete Event"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                                    </svg>
                                </button>
                            </div>
                        </div>
                        <div className="p-4">
                            <div className="flex items-center justify-between mb-2">
                                <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded">
                                    {event.eventType}
                                </span>
                                <div className="flex items-center">
                                    <span className="text-gray-600 text-sm mr-2">
                                        {event.like?.membersLike?.length || 0} 👍
                                    </span>
                                    <span className="text-gray-600 text-sm">
                                        {event.like?.membersDislike?.length || 0} 👎
                                    </span>
                                </div>
                            </div>
                            <h2 className="text-xl font-semibold mb-2">{event.eventName}</h2>
                            <p className="text-gray-600 mb-3 text-sm">{event.description}</p>
                            <div className="flex items-center mb-2">
                                <svg className="w-4 h-4 text-gray-500 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                                <span className="text-gray-600 text-sm">{event.eventLocation}</span>
                            </div>
                            <div className="flex items-center mb-2">
                                <svg className="w-4 h-4 text-gray-500 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                                <span className="text-gray-600 text-sm">{formatDate(event.scheduledDate)}</span>
                            </div>
                            {event.scheduledTime && (
                                <div className="flex items-center mb-2">
                                    <svg className="w-4 h-4 text-gray-500 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                    <span className="text-gray-600 text-sm">{formatTime(event.scheduledTime)}</span>
                                </div>
                            )}
                            <div className="mt-3 pt-3 border-t border-gray-200 flex justify-between items-center">
                                <span className="text-xs text-gray-500">Published by: {event.publisherName}</span>
                                <button 
                                    onClick={() => handleViewComments(event)}
                                    className="text-xs text-blue-600 hover:text-blue-800 hover:underline"
                                >
                                    Comments: {event.comments?.length || 0}
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Edit Event Modal */}
            {showEditModal && formData && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-screen overflow-y-auto">
                        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                            <h2 className="text-xl font-semibold">Edit Event</h2>
                            <button 
                                onClick={handleCloseModal}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                                </svg>
                            </button>
                        </div>
                        
                        <form onSubmit={handleSubmitEdit} className="p-4 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Event Name
                                </label>
                                <input
                                    type="text"
                                    name="eventName"
                                    value={formData.eventName || ''}
                                    onChange={handleInputChange}
                                    className="w-full p-2 border border-gray-300 rounded"
                                    required
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Event Type
                                </label>
                                <select
                                    name="eventType"
                                    value={formData.eventType || ''}
                                    onChange={handleInputChange}
                                    className="w-full p-2 border border-gray-300 rounded"
                                    required
                                >
                                    <option value="">Select an event type</option>
                                    <option value="Conference">Conference</option>
                                    <option value="Workshop">Workshop</option>
                                    <option value="Social">Social</option>
                                    <option value="Competition">Competition</option>
                                    <option value="Outdoor Adventure">Outdoor Adventure</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Location
                                </label>
                                <input
                                    type="text"
                                    name="eventLocation"
                                    value={formData.eventLocation || ''}
                                    onChange={handleInputChange}
                                    className="w-full p-2 border border-gray-300 rounded"
                                    required
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Date
                                </label>
                                <input
                                    type="date"
                                    value={formatDateForInput(formData.scheduledDate)}
                                    onChange={handleDateChange}
                                    className="w-full p-2 border border-gray-300 rounded"
                                    required
                                />
                                <small className="text-gray-500">
                                    Event must be scheduled at least 2 days in the future
                                </small>
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Time
                                </label>
                                <input
                                    type="time"
                                    value={formatTimeForInput(formData.scheduledTime)}
                                    onChange={handleTimeChange}
                                    className="w-full p-2 border border-gray-300 rounded"
                                    required
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Description
                                </label>
                                <textarea
                                    name="description"
                                    value={formData.description || ''}
                                    onChange={handleInputChange}
                                    rows="4"
                                    className="w-full p-2 border border-gray-300 rounded"
                                    required
                                ></textarea>
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Event Image
                                </label>
                                <div className="mb-2">
                                    <img 
                                        src={imagePreview || 'https://via.placeholder.com/400x200?text=No+Image'} 
                                        alt="Event preview" 
                                        className="h-48 w-full object-cover rounded border border-gray-300"
                                    />
                                </div>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="w-full p-2 border border-gray-300 rounded"
                                />
                                <small className="text-gray-500">
                                    Leave empty to keep the current image
                                </small>
                            </div>
                            
                            <div className="flex justify-end space-x-3 pt-3 border-t border-gray-200">
                                <button
                                    type="button"
                                    onClick={handleCloseModal}
                                    className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded"
                                    disabled={updating}
                                >
                                    {updating ? 'Updating...' : 'Save Changes'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Comments Modal */}
            {showCommentsModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-xl max-w-lg w-full">
                        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                            <h2 className="text-xl font-semibold">Comments - {selectedEventName}</h2>
                            <button 
                                onClick={handleCloseCommentsModal}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                                </svg>
                            </button>
                        </div>
                        <div className="p-4 max-h-96 overflow-y-auto">
                            {selectedEventComments.length > 0 ? (
                                <ul className="space-y-2">
                                    {selectedEventComments.map((comment, index) => (
                                        <li 
                                            key={index} 
                                            className="p-3 bg-gray-50 rounded border border-gray-200"
                                        >
                                            <div className="flex items-start">
                                                <div className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 mr-3">
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                                                    </svg>
                                                </div>
                                                <div>
                                                    <p className="text-gray-700">{comment}</p>
                                                </div>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <div className="text-center py-8 text-gray-500">No comments yet.</div>
                            )}
                        </div>
                        <div className="p-4 border-t border-gray-200">
                            <button
                                onClick={handleCloseCommentsModal}
                                className="w-full px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}