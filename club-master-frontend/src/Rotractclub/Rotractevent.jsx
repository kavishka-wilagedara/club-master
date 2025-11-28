import React, { useEffect, useState, useContext } from "react";
import {
  Heart,
  MessageCircle,
  Share2,
  Calendar,
  MapPin,
  Clock,
  Trash2,
  Edit,
  X,
  Check,
} from "lucide-react";
import Rotractnav from "../components/Rotractnav";
import Rotractfooter from "../components/Rotractfooter";
import axios from "axios";
import { useSearchParams } from "react-router-dom";
import { UserContext } from "../common/UserContext";

const RotracEvent = () => {
  const backendUrl=import.meta.env.BACKEND_URL;

  const [events, setEvents] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [editingComment, setEditingComment] = useState(null);
  const [editText, setEditText] = useState("");
  const [searchParams] = useSearchParams();
  const clubId = searchParams.get("clubId");
  const clubName = searchParams.get("clubName");

  const { user } = useContext(UserContext);
  const memberId = user.id;

  useEffect(() => {
    if (clubId) {
      getEventsByClubId();
    }
  }, [clubId]);

  const getEventsByClubId = async () => {
    try {
      const response = await axios.get(
        `${backendUrl}/event/${clubId}/events`
      );
      console.log("Fetched Events:", response.data);

      const eventsWithComments = await Promise.all(
        response.data.map(async (event) => {
          const commentsResponse = await axios.get(
            `${backendUrl}/comment/allComments/${event.eventId}`
          );
          return {
            ...event,
            comments: commentsResponse.data || [],
          };
        })
      );

      setEvents(eventsWithComments);
    } catch (error) {
      console.log("Error while getting events or comments", error);
    }
  };

  const handleLike = async (eventId) => {
    if (!memberId || !clubId) return;

    try {
      const event = events.find((e) => e.eventId === eventId);
      const isLiked = event.like.membersLike.includes(memberId);

      if (isLiked) {
        await axios.post(
          `${backendUrl}/like/${eventId}/removeLikeEvent/${clubId}/${memberId}`
        );
      } else {
        await axios.post(
          `${backendUrl}/like/${eventId}/addLikeEvent/${clubId}/${memberId}`
        );
      }

      setEvents(
        events.map((event) => {
          if (event.eventId === eventId) {
            return {
              ...event,
              like: {
                ...event.like,
                membersLike: isLiked
                  ? event.like.membersLike.filter((id) => id !== memberId)
                  : [...event.like.membersLike, memberId],
              },
            };
          }
          return event;
        })
      );

      getEventsByClubId();
    } catch (error) {
      console.log(
        "Error handling like",
        error.response ? error.response.data : error.message
      );
      getEventsByClubId();
    }
  };

  const handleDislike = async (eventId) => {
    if (!memberId || !clubId) return;

    try {
      const event = events.find((e) => e.eventId === eventId);
      const isDisliked = event.like.membersDislike.includes(memberId);

      await axios.post(
        `${backendUrl}/like/${eventId}/removeLikeEvent/${clubId}/${memberId}`
      );

      setEvents(
        events.map((event) => {
          if (event.eventId === eventId) {
            return {
              ...event,
              like: {
                ...event.like,
                membersDislike: isDisliked
                  ? event.like.membersDislike.filter((id) => id !== memberId)
                  : [...event.like.membersDislike, memberId],
                membersLike: event.like.membersLike.filter(
                  (id) => id !== memberId
                ),
              },
            };
          }
          return event;
        })
      );

      getEventsByClubId();
    } catch (error) {
      console.log(
        "Error handling dislike",
        error.response ? error.response.data : error.message
      );
      getEventsByClubId();
    }
  };

  const handleAddComment = async (eventId) => {
    if (!newComment.trim() || !memberId) return;

    try {
      const commentObj = {
        comment: newComment,
      };

      await axios.post(
        `${backendUrl}/comment/${eventId}/saveComment/${clubId}/${memberId}`,
        commentObj
      );
      getEventsByClubId();
      setNewComment("");
    } catch (error) {
      console.log(
        "Error adding comment",
        error.response ? error.response.data : error.message
      );
    }
  };

  const handleUpdateComment = async (commentId) => {
    if (!editText.trim() || !memberId) return;

    try {
      const commentObj = {
        comment: editText,
      };

      await axios.put(
        `${backendUrl}/comment/${memberId}/updateComment/${commentId}`,
        commentObj
      );
      getEventsByClubId();
      setEditingComment(null);
      setEditText("");
    } catch (error) {
      console.log("Error updating comment", error);
    }
  };

  const handleDeleteComment = async (eventId, commentId) => {
    if (!memberId) return;

    try {
      await axios.post(
        `${backendUrl}/comment/${memberId}/${clubId}/deleteComment/${eventId}/${commentId}`
      );

      getEventsByClubId();
    } catch (error) {
      console.log("Error deleting comment", error);
    }
  };

  const startEditComment = (comment) => {
    setEditingComment(comment.commentId);
    setEditText(comment.commentText);
  };

  const cancelEditComment = () => {
    setEditingComment(null);
    setEditText("");
  };

  const formatDateTime = (dateArray, timeArray) => {
    if (!dateArray || !timeArray) return "Unknown";
    const date = new Date(
      dateArray[0],
      dateArray[1] - 1,
      dateArray[2],
      timeArray[0],
      timeArray[1],
      timeArray[2] || 0
    );
    return date.toLocaleString();
  };

  const formatCommentDate = (dateTime) => {
    if (!dateTime) return "";
    const date = new Date(dateTime);
    return date.toLocaleString();
  };

  const isMyComment = (comment) => {
    return comment.memberId === memberId;
  };

  const toCamelCase = (str) => {
    return str
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join("");
  };

  return (
    <div>
      <Rotractnav
        clubNewsPage={`/rotractnews?clubId=${clubId}&clubName=${clubName}`}
        clubEventPage={`/rotractevent?clubId=${clubId}&clubName=${clubName}`}
        clubName={clubName}
        clubId={clubId}
      />
      <div className="min-h-screen bg-gradient-to-tl from-indigo-900 via-purple-900 to-pink-900">
        <div className="max-w-6xl mx-auto p-8 pt-32">
          <div className="text-center mb-16 mt-8">
            <h1 className="text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-400 mb-6">
              {toCamelCase(clubName)} Club Events
            </h1>
            <p className="text-cyan-100 text-xl font-light">
              Join us in making a difference through leadership, service, and
              innovation
            </p>
          </div>

          <div className="grid grid-cols-1 gap-12">
            {events.length > 0 ? (
              events.map((event) => (
                <div
                  key={event.eventId}
                  className="relative bg-black/30 backdrop-blur-xl rounded-2xl overflow-hidden border border-white/10"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-blue-500/10"></div>

                  <div className="relative p-6">
                    <div className="grid md:grid-cols-2 gap-8">
                      <div className="space-y-6">
                        <div className="w-full aspect-video bg-gray-700/50 rounded-xl flex items-center justify-center text-cyan-100 overflow-hidden">
                          <img
                            src={event.eventImageUrl}
                            alt={event.eventName}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex flex-wrap gap-4">
                          <div className="flex items-center gap-2 bg-white/10 backdrop-blur px-4 py-2 rounded-full text-cyan-100">
                            <Calendar className="w-4 h-4" />
                            <span>
                              {formatDateTime(
                                event.scheduledDate,
                                event.scheduledTime
                              )}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 bg-white/10 backdrop-blur px-4 py-2 rounded-full text-cyan-100">
                            <MapPin className="w-4 h-4" />
                            <span>{event.eventLocation}</span>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-6">
                        <div>
                          <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400 mb-4">
                            {event.eventName}
                          </h2>
                          <p className="text-cyan-100 leading-relaxed">
                            {event.description || "No description available."}
                          </p>
                        </div>

                        <div className="space-y-4">
                          <h3 className="text-xl font-semibold text-cyan-300">
                            Comments ({event.comments ? event.comments.length : 0})
                          </h3>
                          <div className="space-y-4 max-h-64 overflow-y-auto pr-4">
                            {event.comments &&
                              event.comments.map((comment) => (
                                <div
                                  key={comment.commentId}
                                  className="flex items-start gap-3 bg-white/5 backdrop-blur p-4 rounded-xl"
                                >
                                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-400 to-blue-400 flex items-center justify-center text-white font-medium">
                                    {comment.memberName
                                      ? comment.memberName[0]
                                      : "U"}
                                  </div>

                                  <div className="flex-1">
                                    <div className="flex justify-between items-start">
                                      <div className="text-cyan-300 text-sm mb-1">
                                        {comment.memberName || "User"} •{" "}
                                        {formatCommentDate(comment.dateTime)}
                                      </div>

                                      {isMyComment(comment) && (
                                        <div className="flex gap-2">
                                          {editingComment !==
                                          comment.commentId ? (
                                            <>
                                              <button
                                                onClick={() =>
                                                  startEditComment(comment)
                                                }
                                                className="text-cyan-400 hover:text-cyan-300"
                                              >
                                                <Edit className="w-4 h-4" />
                                              </button>
                                              <button
                                                onClick={() =>
                                                  handleDeleteComment(
                                                    event.eventId,
                                                    comment.commentId
                                                  )
                                                }
                                                className="text-red-400 hover:text-red-300"
                                              >
                                                <Trash2 className="w-4 h-4" />
                                              </button>
                                            </>
                                          ) : (
                                            <>
                                              <button
                                                onClick={() =>
                                                  handleUpdateComment(
                                                    comment.commentId
                                                  )
                                                }
                                                className="text-green-400 hover:text-green-300"
                                              >
                                                <Check className="w-4 h-4" />
                                              </button>
                                              <button
                                                onClick={cancelEditComment}
                                                className="text-red-400 hover:text-red-300"
                                              >
                                                <X className="w-4 h-4" />
                                              </button>
                                            </>
                                          )}
                                        </div>
                                      )}
                                    </div>

                                    {editingComment === comment.commentId ? (
                                      <input
                                        type="text"
                                        value={editText}
                                        onChange={(e) =>
                                          setEditText(e.target.value)
                                        }
                                        className="w-full bg-white/10 backdrop-blur text-cyan-100 px-3 py-2 rounded-lg border border-white/10 focus:outline-none focus:border-cyan-400"
                                        autoFocus
                                      />
                                    ) : (
                                      <p className="text-cyan-100">
                                        {comment.comment}
                                      </p>
                                    )}
                                  </div>
                                </div>
                              ))}

                            {(!event.comments ||
                              event.comments.length === 0) && (
                              <div className="text-center text-cyan-300/50 py-4">
                                No comments yet. Be the first to comment!
                              </div>
                            )}
                          </div>
                        </div>

                        {memberId ? (
                          <div className="flex gap-3">
                            <input
                              type="text"
                              placeholder="Add a comment..."
                              value={newComment}
                              onChange={(e) => setNewComment(e.target.value)}
                              className="flex-1 bg-white/10 backdrop-blur text-cyan-100 px-4 py-2 rounded-xl border border-white/10 focus:outline-none focus:border-cyan-400 placeholder-cyan-300/50"
                            />
                            <button
                              onClick={() => handleAddComment(event.eventId)}
                              className="px-6 py-2 bg-gradient-to-r from-cyan-400 to-blue-400 text-white rounded-xl hover:from-cyan-500 hover:to-blue-500 transition-colors"
                            >
                              Post
                            </button>
                          </div>
                        ) : (
                          <div className="text-center p-3 bg-white/5 backdrop-blur rounded-xl text-cyan-300">
                            Please log in to add comments
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="relative border-t border-white/10 p-4 bg-white/5 backdrop-blur">
                    <div className="flex justify-between w-full">
                      <div className="flex gap-4">
                        <button
                          className={`flex items-center gap-2 px-4 py-2 rounded-xl hover:bg-white/10 transition-colors text-cyan-100`}
                          onClick={() => handleLike(event.eventId)}
                          disabled={!memberId}
                        >
                          <Heart
                            className={`w-5 h-5 ${
                              event.like &&
                              event.like.membersLike &&
                              event.like.membersLike.includes(memberId)
                                ? "fill-pink-500 text-pink-500"
                                : ""
                            }`}
                          />
                          <span>
                            {event.like && event.like.membersLike
                              ? event.like.membersLike.length
                              : 0}
                          </span>
                        </button>

                        <button
                          className={`flex items-center gap-2 px-4 py-2 rounded-xl hover:bg-white/10 transition-colors text-cyan-100`}
                          onClick={() => handleDislike(event.eventId)}
                          disabled={!memberId}
                        >
                          <Heart
                            className={`w-5 h-5 rotate-180 ${
                              event.like &&
                              event.like.membersDislike &&
                              event.like.membersDislike.includes(memberId)
                                ? "fill-indigo-500 text-indigo-500"
                                : ""
                            }`}
                          />
                          <span>
                            {event.like && event.like.membersDislike
                              ? event.like.membersDislike.length
                              : 0}
                          </span>
                        </button>
                      </div>

                      <button
                        className="flex items-center gap-2 px-4 py-2 rounded-xl hover:bg-white/10 transition-colors text-cyan-100"
                        onClick={() => {
                          const commentInput = document.querySelector(
                            `input[placeholder="Add a comment..."]`
                          );
                          commentInput?.focus();
                        }}
                      >
                        <MessageCircle className="w-5 h-5" />
                        <span>
                          {event.comments ? event.comments.length : 0}
                        </span>
                      </button>

                      <button
                        className="flex items-center gap-2 px-4 py-2 rounded-xl hover:bg-white/10 transition-colors text-cyan-100"
                        onClick={() => handleShare(event.eventId)}
                      >
                        <Share2 className="w-5 h-5" />
                        <span>Share</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center text-cyan-100">
                No events found. Check back later!
              </div>
            )}
          </div>
        </div>
      </div>
      <Rotractfooter />
    </div>
  );
};

export default RotracEvent;