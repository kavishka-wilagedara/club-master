import React, { useContext, useEffect, useState } from 'react';
import { UserContext } from '../common/UserContext';
import axios from 'axios';
import Swal from 'sweetalert2';

export default function ViewClubAdminNews() {
    const [news, setNews] = useState([]);
    const { user } = useContext(UserContext);
    const clubId = user?.id?.split(':')[0];
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [selectedNews, setSelectedNews] = useState(null);
    const [updatedNews, setUpdatedNews] = useState({
        newsTitle: '',
        description: ''
    });
    const [memberDetails, setMemberDetails] = useState({});
    const [showMembersModal, setShowMembersModal] = useState(false);
    const [modalContent, setModalContent] = useState({
        title: '',
        members: []
    });

    useEffect(() => {
        getAllNews();
    }, []);

    useEffect(() => {
        if (selectedNews) {
            setUpdatedNews({
                newsTitle: selectedNews.newsTitle,
                description: selectedNews.description
            });
        }
    }, [selectedNews]);

    useEffect(() => {
        // Collect all member IDs from likes and dislikes
        const memberIds = new Set();
        news.forEach(item => {
            item.like.membersLike.forEach(id => memberIds.add(id));
            item.like.membersDislike.forEach(id => memberIds.add(id));
        });
        
        // Fetch member details for all collected IDs
        fetchMemberDetails(Array.from(memberIds));
    }, [news]);

    const fetchMemberDetails = async (memberIds) => {
        if (!memberIds.length) return;
        
        const details = {};
        
        for (const memberId of memberIds) {
            try {
                const response = await axios.get(`http://localhost:7000/api/v1/member/getMember-memberId/${memberId}`);
                details[memberId] = {
                    name: `${response.data.firstName} ${response.data.lastName}`,
                    imageUrl: response.data.memberImageUrl
                };
            } catch (error) {
                console.error(`Error fetching details for member ${memberId}:`, error);
                details[memberId] = { name: 'Unknown Member', imageUrl: null };
            }
        }
        
        setMemberDetails(details);
    };

    const getAllNews = async () => {
        try {
            const response = await axios.get(`http://localhost:7000/api/v1/news/${clubId}/getAllNews`);
            console.log(response.data);
            setNews(response.data);
        } catch (error) {
            console.log('Error while getting all news:', error);
        }
    };

    const formatDateTime = (dateArray, timeArray) => {
        const [year, month, day] = dateArray;
        const [hour, minute, second] = timeArray;
        return `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')} ${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}:${second.toString().padStart(2, '0')}`;
    };

    const handleUpdate = (newsItem) => {
        setSelectedNews(newsItem);
        setShowUpdateModal(true);
    };

    const handleCloseModal = () => {
        setShowUpdateModal(false);
        setSelectedNews(null);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUpdatedNews({
            ...updatedNews,
            [name]: value
        });
    };

    const handleUpdateSubmit = async (e) => {
        e.preventDefault();
        
        try {
            await axios.put(
                `http://localhost:7000/api/v1/news/${user.id}/update/${selectedNews.newsId}`,
                updatedNews
            );
            
            Swal.fire({
                title: 'Updated!',
                text: 'The news item has been updated successfully.',
                icon: 'success',
                timer: 2000,
                showConfirmButton: false,
            });
            
            handleCloseModal();
            getAllNews();
        } catch (error) {
            console.error('Error while updating news:', error);
            
            Swal.fire({
                title: 'Error!',
                text: 'Failed to update the news item. Please try again.',
                icon: 'error',
            });
        }
    };

    const handleDelete = async (newsId) => {
        Swal.fire({
            title: 'Are you sure?',
            text: 'You wont be able to revert this!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!',
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await axios.delete(`http://localhost:7000/api/v1/news/delete/${newsId}`);
                    
                    Swal.fire({
                        title: 'Deleted!',
                        text: 'The news item has been deleted.',
                        icon: 'success',
                        timer: 2000,
                        showConfirmButton: false,
                    });
    
                    getAllNews();
                } catch (error) {
                    console.error('Error while deleting news:', error);
                    
                    Swal.fire({
                        title: 'Error!',
                        text: 'Failed to delete the news item. Please try again.',
                        icon: 'error',
                    });
                }
            }
        });
    };

    const showLikeDetails = (newsItem) => {
        setModalContent({
            title: 'Members who liked',
            members: newsItem.like.membersLike
        });
        setShowMembersModal(true);
    };

    const showDislikeDetails = (newsItem) => {
        setModalContent({
            title: 'Members who disliked',
            members: newsItem.like.membersDislike
        });
        setShowMembersModal(true);
    };

    const closeMembersModal = () => {
        setShowMembersModal(false);
        setModalContent({
            title: '',
            members: []
        });
    };

    return (
        <div className="max-w-6xl mx-auto p-6">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-800">Club News Dashboard</h1>
            </div>

            {news.length === 0 ? (
                <div className="text-center p-10 bg-gray-50 rounded-lg shadow-sm">
                    <p className="text-gray-600">No news items available.</p>
                </div>
            ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {news.map((item) => (
                        <div key={item.newsId} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                            <div className="p-6">
                                <div className="flex justify-between items-start">
                                    <h2 className="text-xl font-semibold text-gray-800 mb-2">{item.newsTitle}</h2>
                                    <div className="flex space-x-2">
                                        <button 
                                            onClick={() => handleUpdate(item)}
                                            className="text-blue-500 hover:text-blue-700"
                                            title="Edit"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                            </svg>
                                        </button>
                                        <button 
                                            onClick={() => handleDelete(item.newsId)}
                                            className="text-red-500 hover:text-red-700"
                                            title="Delete"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                                <div className="text-sm text-gray-500 mb-3 flex items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                    <span>{item.publisherName}</span>
                                    <span className="mx-2">•</span>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    <span>{formatDateTime(item.publishedDate, item.publishedTime)}</span>
                                </div>
                                <p className="text-gray-700 mb-4">{item.description}</p>
                                <div className="flex space-x-4 text-sm">
                                    <button 
                                        onClick={() => showLikeDetails(item)}
                                        className="flex items-center text-gray-600 hover:text-green-600 transition-colors duration-200"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                                            <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
                                        </svg>
                                        <span>{item.like.membersLike.length} Likes</span>
                                    </button>
                                    
                                    <button 
                                        onClick={() => showDislikeDetails(item)}
                                        className="flex items-center text-gray-600 hover:text-red-600 transition-colors duration-200"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                                            <path d="M18 9.5a1.5 1.5 0 11-3 0v-6a1.5 1.5 0 013 0v6zM14 9.667v-5.43a2 2 0 00-1.105-1.79l-.05-.025A4 4 0 0011.055 2H5.64a2 2 0 00-1.962 1.608l-1.2 6A2 2 0 004.44 12H8v4a2 2 0 002 2 1 1 0 001-1v-.667a4 4 0 01.8-2.4l1.4-1.866a4 4 0 00.8-2.4z" />
                                        </svg>
                                        <span>{item.like.membersDislike.length} Dislikes</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Update Modal */}
            {showUpdateModal && selectedNews && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg w-full max-w-md p-6 mx-4">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold text-gray-800">Update News</h2>
                            <button 
                                onClick={handleCloseModal}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        
                        <form onSubmit={handleUpdateSubmit}>
                            <div className="mb-4">
                                <label htmlFor="newsTitle" className="block text-sm font-medium text-gray-700 mb-1">
                                    News Title
                                </label>
                                <input
                                    type="text"
                                    id="newsTitle"
                                    name="newsTitle"
                                    value={updatedNews.newsTitle}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                            </div>
                            
                            <div className="mb-4">
                                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                                    Description
                                </label>
                                <textarea
                                    id="description"
                                    name="description"
                                    value={updatedNews.description}
                                    onChange={handleInputChange}
                                    rows="4"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                ></textarea>
                            </div>
                            
                            <div className="flex justify-end space-x-3">
                                <button
                                    type="button"
                                    onClick={handleCloseModal}
                                    className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    Update
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Members Modal (for Likes/Dislikes) */}
            {showMembersModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg w-full max-w-md p-6 mx-4">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold text-gray-800">{modalContent.title}</h2>
                            <button 
                                onClick={closeMembersModal}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        
                        <div className="max-h-96 overflow-y-auto">
                            {modalContent.members.length === 0 ? (
                                <div className="text-center py-8">
                                    <p className="text-gray-500">No members found</p>
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    {modalContent.members.map(memberId => (
                                        <div 
                                            key={memberId} 
                                            className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                                        >
                                            {memberDetails[memberId]?.imageUrl ? (
                                                <img 
                                                    src={memberDetails[memberId].imageUrl} 
                                                    alt={memberDetails[memberId]?.name || 'Member'} 
                                                    className="h-10 w-10 rounded-full mr-3 object-cover border border-gray-200"
                                                />
                                            ) : (
                                                <div className="h-10 w-10 rounded-full bg-gray-200 mr-3 flex items-center justify-center">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                                                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                                    </svg>
                                                </div>
                                            )}
                                            <div>
                                                <p className="font-medium text-gray-800">
                                                    {memberDetails[memberId]?.name || 'Unknown Member'}
                                                </p>
                                                <p className="text-xs text-gray-500">
                                                    ID: {memberId}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                        
                        <div className="mt-4 text-right">
                            <button
                                onClick={closeMembersModal}
                                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
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