import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { useSearchParams } from "react-router-dom";
import axios from "axios";

export default function ViewAllMyOngoingEvents() {
  const backendUrl=import.meta.env.VITE_BACKEND_URL;
  const [events, setEvents] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const clubId = searchParams.get("clubId");
  const eventStatus = searchParams.get("eventStatus") || "ongoing";

  useEffect(() => {
    const fetchOngoingEvents = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${backendUrl}/event/${eventStatus}/${clubId}`);
        setEvents(response.data);
        setError(null);
      } catch (error) {
        console.error("Error fetching ongoing events:", error);
        setError("Failed to load events. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    if (clubId) {
      fetchOngoingEvents();
    } else {
      setError("No club ID provided");
      setLoading(false);
    }
  }, [clubId, eventStatus]);

  // Format time properly
  const formatTime = (timeArray) => {
    if (!timeArray || !Array.isArray(timeArray) || timeArray.length < 2) return 'N/A';
    const hours = timeArray[0].toString().padStart(2, '0');
    const minutes = timeArray[1].toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <div className="flex-1 p-8">
          <div className="max-w-7xl mx-auto">
            <header className="mb-8">
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                {eventStatus.charAt(0).toUpperCase() + eventStatus.slice(1)} Events
              </h1>
              <p className="text-gray-600">
                Discover and manage all {eventStatus} events for your club
              </p>
            </header>
            
            {loading && (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            )}
            
            {error && (
              <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded shadow mb-6">
                <div className="flex items-center">
                  <svg className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <p>{error}</p>
                </div>
              </div>
            )}
            
            {!loading && !error && events.length === 0 && (
              <div className="bg-white rounded-lg shadow-md p-8 text-center">
                <svg className="h-16 w-16 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No events found</h3>
                <p className="text-gray-600">There are no {eventStatus} events for this club at the moment.</p>
              </div>
            )}
            
            {events.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {events.map((event) => (
                  <div key={event.eventId} className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
                    <div className="relative h-48 bg-gradient-to-r from-blue-500 to-purple-600">
                      {event.eventImageUrl ? (
                        <img 
                          src={event.eventImageUrl} 
                          alt={event.eventName} 
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = 'https://via.placeholder.com/300x200?text=Event+Image';
                          }}
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full text-white">
                          <span className="text-xl font-medium">{event.eventName}</span>
                        </div>
                      )}
                      <div className="absolute top-4 right-4 bg-white px-3 py-1 rounded-full text-xs font-medium text-gray-800">
                        {event.eventType}
                      </div>
                    </div>
                    
                    <div className="p-6">
                      <h2 className="text-2xl font-bold text-gray-800 mb-2 line-clamp-2">{event.eventName}</h2>
                      
                      <div className="flex items-center mb-4">
                        <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-500 mr-2">
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                        </div>
                        <span className="text-sm text-gray-600">{event.publisherName}</span>
                      </div>
                      
                      <p className="text-gray-600 mb-4 line-clamp-3">{event.description}</p>
                      
                      <div className="border-t border-gray-100 pt-4 grid grid-cols-2 gap-4">
                        <div className="flex items-center">
                          <svg className="h-5 w-5 text-gray-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          <span className="text-sm text-gray-600">{event.eventLocation}</span>
                        </div>
                        
                        <div className="flex items-center">
                          <svg className="h-5 w-5 text-gray-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <span className="text-sm text-gray-600">{new Date(event.scheduledDate).toLocaleDateString()}</span>
                        </div>
                        
                        <div className="flex items-center">
                          <svg className="h-5 w-5 text-gray-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span className="text-sm text-gray-600">{formatTime(event.scheduledTime)}</span>
                        </div>
                        
                        <div className="flex items-center">
                          <svg className="h-5 w-5 text-gray-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                          </svg>
                          <span className="text-sm text-gray-600">Event #{event.eventId}</span>
                        </div>
                      </div>
                      
                      <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
                        <div className="flex space-x-4">
                          <div className="flex items-center">
                            <svg className="h-5 w-5 text-red-500 mr-1" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                            </svg>
                            <span className="text-sm">{event.like.membersLike.length}</span>
                          </div>
                          
                          <div className="flex items-center">
                            <svg className="h-5 w-5 text-gray-500 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14H5.236a2 2 0 01-1.789-2.894l3.5-7A2 2 0 018.736 3h4.018a2 2 0 01.485.06l3.76.94m-7 10v5a2 2 0 002 2h.096c.5 0 .905-.405.905-.904 0-.715.211-1.413.608-2.008L17 13V4m-7 10h2m5-10h2a2 2 0 012 2v6a2 2 0 01-2 2h-2.5" />
                            </svg>
                            <span className="text-sm">{event.like.membersDislike.length}</span>
                          </div>
                          
                          <div className="flex items-center">
                            <svg className="h-5 w-5 text-gray-500 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                            </svg>
                            <span className="text-sm">{event.comments.length}</span>
                          </div>
                        </div>
                        
                        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition duration-300">
                          View Details
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}