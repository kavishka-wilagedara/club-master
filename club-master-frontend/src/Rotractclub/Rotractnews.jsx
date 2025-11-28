import React, { useEffect, useState, useContext } from 'react';
import { ThumbsDown, ThumbsUp } from 'lucide-react';
import Rotractnav from "../components/Rotractnav";
import Rotractfooter from "../components/Rotractfooter";
import axios from 'axios';
import { useSearchParams } from 'react-router-dom';
import { UserContext } from '../common/UserContext';

const RotaractNewsFeed = () => {
  const backendUrl=import.meta.env.BACKEND_URL;

  const [interactions, setInteractions] = useState({});
  const [news, setNews] = useState([]);
  const [searchParams] = useSearchParams();
  const clubId = searchParams.get('clubId');
  const { user } = useContext(UserContext);
  const memberId = user?.id; 
  const clubName = searchParams.get("clubName");

  useEffect(() => {
    if (clubId) {
      getNewsByClub();
    }
  }, [clubId]);

  const getNewsByClub = async () => {
    try {
      const response = await axios.get(
        `${backendUrl}/news/${clubId}/getAllNews`
      );
      console.log("Fetched News:", response.data);
      setNews(response.data);

      // Initialize interactions state
      const initialInteractions = {};
      response.data.forEach((item) => {
        initialInteractions[item.newsId] = {
          liked: item.like?.membersLike?.includes(memberId),
          disliked: item.like?.membersDislike?.includes(memberId),
        };
      });
      setInteractions(initialInteractions);
    } catch (error) {
      console.error('Error while getting news:', error);
    }
  };

  const handleLike = async (id) => {
    try {
      if (!clubId || !memberId) return;

      const hasLiked = interactions[id]?.liked;
      const hasDisliked = interactions[id]?.disliked;

      if (hasLiked) {
        await axios.post(
          `${backendUrl}/like/${id}/removeLikeNews/${clubId}/${memberId}`
        );
      } else {
        await axios.post(
          `${backendUrl}/like/${id}/addLikeNews/${clubId}/${memberId}`
        );
        if (hasDisliked) {
          await axios.post(
            `${backendUrl}/dislike/${id}/removeDislikeNews/${clubId}/${memberId}`
          );
        }
      }

      // Update interactions state
      setInteractions((prev) => ({
        ...prev,
        [id]: { liked: !hasLiked, disliked: false },
      }));

      // Refresh news data
      getNewsByClub();
    } catch (error) {
      console.error('Error while handling like:', error);
    }
  };

  const handleDislike = async (id) => {
    try {
      if (!clubId || !memberId) return;

      const hasDisliked = interactions[id]?.disliked;
      const hasLiked = interactions[id]?.liked;

      if (hasDisliked) {
        await axios.post(
          `${backendUrl}/dislike/${id}/removeDislikeNews/${clubId}/${memberId}`
        );
      } else {
        await axios.post(
          `${backendUrl}/dislike/${id}/addDislikeNews/${clubId}/${memberId}`
        );
        if (hasLiked) {
          await axios.post(
            `${backendUrl}/like/${id}/removeLikeNews/${clubId}/${memberId}`
          );
        }
      }

      // Update interactions state
      setInteractions((prev) => ({
        ...prev,
        [id]: { disliked: !hasDisliked, liked: false },
      }));

      // Refresh news data
      getNewsByClub();
    } catch (error) {
      console.error('Error while handling dislike:', error);
    }
  };

  const formatDateTime = (dateArray, timeArray) => {
    if (!dateArray || !timeArray) return "Unknown";
    const date = new Date(
      dateArray[0],
      dateArray[1] - 1,
      dateArray[2],
      timeArray[0],
      timeArray[1],
      timeArray[2]
    );
    return date.toLocaleString();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <Rotractnav
        clubNewsPage={`/rotractnews?clubId=${clubId}&clubName=${clubName}`}
        clubEventPage={`/rotractevent?clubId=${clubId}&clubName=${clubName}`}
        clubName={clubName}
        clubId={clubId}
      />
      <div className="max-w-2xl mx-auto pt-32">
        <div className="bg-white/30 backdrop-blur-sm rounded-xl mb-4">
          <div className="px-4 py-6">
            <h1 className="text-4xl font-bold text-center bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {clubName} News Feed
            </h1>
            <div className="mt-1 w-24 h-1 mx-auto bg-gradient-to-r from-blue-600 to-purple-600 rounded-full"></div>
          </div>
        </div>

        <div className="space-y-4 p-4">
          {news.length === 0 ? (
            <div className="bg-white/70 backdrop-blur-sm rounded-xl p-8 text-center">
              <p className="text-gray-600 text-lg">No news items available</p>
            </div>
          ) : (
            news.map((item) => (
              <div
                key={item.newsId}
                className="bg-gradient-to-r from-blue-50 to-green-50 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 border border-white/50 backdrop-blur-sm"
              >
                <div className="p-6">
                  <div className="flex items-center">
                    <span className="font-bold text-lg text-gray-900">
                      {item.publisherName}
                    </span>
                    <span className="mx-2 text-gray-600">·</span>
                    <span className="text-gray-600 font-medium">
                      {formatDateTime(item.publishedDate, item.publishedTime)}
                    </span>
                  </div>

                  <h2 className="mt-2 text-xl font-bold text-gray-900">
                    {item.newsTitle}
                  </h2>

                  <div className="mt-4">
                    <p className="text-gray-800 text-lg leading-relaxed whitespace-pre-line font-medium">
                      {item.description}
                    </p>
                  </div>

                  <div className="mt-6 flex items-center space-x-8">
                    <button
                      onClick={() => handleLike(item.newsId)}
                      className={`flex items-center group ${
                        interactions[item.newsId]?.liked ? 'text-red-600' : 'text-gray-600'
                      }`}
                    >
                      <div className="p-2 rounded-full group-hover:bg-red-100 transition-colors duration-200">
                        <ThumbsUp
                          size={22}
                          className={`${
                            interactions[item.newsId]?.liked ? 'fill-current' : ''
                          }`}
                        />
                      </div>
                      <span className="ml-1 text-base font-semibold group-hover:text-red-600">
                        {item.like?.membersLike?.length || 0}
                      </span>
                    </button>

                    <button
                      onClick={() => handleDislike(item.newsId)}
                      className={`flex items-center group ${
                        interactions[item.newsId]?.disliked ? 'text-blue-600' : 'text-gray-600'
                      }`}
                    >
                      <div className="p-2 rounded-full group-hover:bg-blue-100 transition-colors duration-200">
                        <ThumbsDown
                          size={22}
                          className={`${
                            interactions[item.newsId]?.disliked ? 'fill-current' : ''
                          }`}
                        />
                      </div>
                      <span className="ml-1 text-base font-semibold group-hover:text-blue-600">
                        {item.like?.membersDislike?.length || 0}
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      <Rotractfooter />
    </div>
  );
};

export default RotaractNewsFeed;