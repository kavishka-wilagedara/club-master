package com.uokclubmanagement.repository;

import com.uokclubmanagement.entity.Comment;
import com.uokclubmanagement.entity.ContentSchedule;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface CommentRepository extends MongoRepository<Comment, String> {

    List<Comment> findCommentsByEventId(String eventId);
    List<Comment> findCommentsByMemberIdAndEventId(String memberId, String eventId);
}
