package com.uokclubmanagement.controller;

import com.uokclubmanagement.entity.Comment;
import com.uokclubmanagement.entity.Event;
import com.uokclubmanagement.service.CommentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/comment")
@CrossOrigin(origins = "http://localhost:${frontend.port}")
public class CommentController {

    @Autowired
    private CommentService commentService;

    @PostMapping("/{eventId}/saveComment/{clubId}/{memberId}")
    public Event saveComment(@PathVariable String eventId, @PathVariable String clubId, @PathVariable String memberId, @RequestBody Comment comment) {
        return commentService.addCommentToEvent(eventId, clubId, memberId, comment);
    }

    @PostMapping("/{memberId}/{clubId}/deleteComment/{eventId}/{commentId}")
    public void deleteComment(@PathVariable String memberId, @PathVariable String clubId, @PathVariable String eventId, @PathVariable String commentId) {
        commentService.deleteCommentFromEvent(commentId, eventId, clubId, memberId);
    }

    @GetMapping("/{eventId}/eventCommentsByMember/{memberId}")
    public List<Comment> allEventCommentsByMemberId(@PathVariable String memberId, @PathVariable String eventId) {
        return commentService.getAllEventCommentsByMemberId(eventId, memberId);
    }

    @GetMapping("/allComments/{eventId}")
    public List<Comment> allCommentsByEventId(@PathVariable String eventId) {
        return commentService.getAllEventCommentsByEventId(eventId);
    }

    @PutMapping("/{memberId}/updateComment/{commentId}")
    public Comment updateComment(@PathVariable String memberId, @PathVariable String commentId, @RequestBody Comment comment) {
        return commentService.updateCommentInEvent(commentId, memberId, comment);
    }

    @PostMapping("/{eventId}/commentCountEvent/{clubId}/{memberId}")
    public int commentCountEvent(@PathVariable("eventId") String eventId, @PathVariable("clubId") String clubId, @PathVariable("memberId") String memberId) {
        return commentService.getCommentCountByCommentId(eventId, clubId, memberId);
    }
}
