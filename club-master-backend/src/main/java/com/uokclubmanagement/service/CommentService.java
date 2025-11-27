package com.uokclubmanagement.service;

import com.uokclubmanagement.entity.Comment;
import com.uokclubmanagement.entity.Event;

import java.util.List;

public interface CommentService {

    Event addCommentToEvent(String eventId, String clubId, String memberId, Comment comment);
    void deleteCommentFromEvent(String commentId, String eventId, String clubId, String memberId);
    List<Comment> getAllEventCommentsByMemberId(String eventId, String memberId);
    List<Comment> getAllEventCommentsByEventId(String eventId);
    Comment updateCommentInEvent(String commentId, String memberId, Comment comment);
    Integer getCommentCountByCommentId(String eventId, String clubId, String memberId);

}
