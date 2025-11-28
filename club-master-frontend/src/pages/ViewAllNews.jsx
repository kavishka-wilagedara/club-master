import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { ThumbsUp, ThumbsDown, Calendar, User, Clock, Share2, Bookmark } from "lucide-react";

export default function ViewAllNews() {
  const backendUrl=import.meta.env.VITE_BACKEND_URL;
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const clubId = searchParams.get("clubId");

  // Fetch news data from the backend
  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await axios.get(
          `${backendUrl}/news/${clubId}/getAllNews`
        );
        setNews(response.data);
      } catch (error) {
        console.error("Error fetching news:", error);
      } finally {
        setLoading(false);
      }
    };

    if (clubId) {
      fetchNews();
    }
  }, [clubId]);

  // Format date function
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-8 ml-64">
          <div className="max-w-5xl mx-auto">
            <header className="mb-12 text-center">
              <h1 className="text-4xl font-extrabold text-gray-800 mb-3 tracking-tight">Latest News</h1>
              <p className="text-gray-600 text-lg max-w-2xl mx-auto">Stay updated with the latest announcements, events, and stories from your club</p>
              <div className="mt-6 w-24 h-1 bg-blue-500 mx-auto rounded-full"></div>
            </header>

            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600"></div>
              </div>
            ) : news.length === 0 ? (
              <div className="bg-white rounded-xl shadow-xl p-12 text-center">
                <div className="text-gray-300 text-7xl mb-6">📰</div>
                <h3 className="text-2xl font-bold text-gray-700 mb-3">No News Available</h3>
                <p className="text-gray-500 text-lg">Check back later for updates and announcements.</p>
              </div>
            ) : (
              <div className="space-y-12">
                {news.map((item) => (
                  <article 
                    key={item.newsId} 
                    className="bg-white rounded-xl overflow-hidden shadow-xl transform transition-all duration-300 hover:shadow-2xl hover:-translate-y-1"
                  >
                    {item.imageUrl && (
                      <div className="h-80 overflow-hidden relative">
                        <img 
                          src={item.imageUrl} 
                          alt={item.newsTitle} 
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.src = "https://via.placeholder.com/800x400?text=News+Image";
                          }}
                        />
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6">
                          <h2 className="text-3xl font-bold text-white mb-2 drop-shadow-md">{item.newsTitle}</h2>
                          <div className="flex items-center text-white/90">
                            <User size={16} className="mr-1" />
                            <span className="text-sm font-medium">{item.publisherName}</span>
                            {item.publishDate && (
                              <>
                                <span className="mx-2">•</span>
                                <Calendar size={16} className="mr-1" />
                                <span className="text-sm">{formatDate(item.publishDate)}</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                    <div className="p-8">
                      {!item.imageUrl && (
                        <h2 className="text-3xl font-bold text-gray-800 mb-4">{item.newsTitle}</h2>
                      )}
                      
                      {!item.imageUrl && item.publisherName && (
                        <div className="flex items-center text-gray-600 mb-6">
                          <div className="bg-blue-100 rounded-full p-2 mr-3">
                            <User size={18} className="text-blue-600" />
                          </div>
                          <div>
                            <div className="font-medium">{item.publisherName}</div>
                            {item.publishDate && (
                              <div className="text-sm text-gray-500 flex items-center mt-1">
                                <Calendar size={14} className="mr-1" />
                                <span>{formatDate(item.publishDate)}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                      
                      <div className="text-gray-700 text-lg leading-relaxed space-y-4">
                        {item.description.split('\n\n').map((paragraph, idx) => (
                          <p key={idx}>{paragraph}</p>
                        ))}
                      </div>
                      
                      <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-100">
                        <div className="flex space-x-6">
                          <button className="flex items-center text-gray-700 hover:text-blue-600 transition-colors">
                            <ThumbsUp size={18} className="mr-2" />
                            <span className="font-medium">{item.like?.membersLike?.length || 0}</span>
                          </button>
                          <button className="flex items-center text-gray-700 hover:text-red-600 transition-colors">
                            <ThumbsDown size={18} className="mr-2" />
                            <span className="font-medium">{item.like?.membersDislike?.length || 0}</span>
                          </button>
                        </div>
                        <div className="flex space-x-4">
                          <button className="text-gray-500 hover:text-blue-600 transition-colors p-2 rounded-full hover:bg-blue-50">
                            <Share2 size={20} />
                          </button>
                          <button className="text-gray-500 hover:text-blue-600 transition-colors p-2 rounded-full hover:bg-blue-50">
                            <Bookmark size={20} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}