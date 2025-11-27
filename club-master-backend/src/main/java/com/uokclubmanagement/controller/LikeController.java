package com.uokclubmanagement.controller;

import com.uokclubmanagement.entity.Event;
import com.uokclubmanagement.entity.News;
import com.uokclubmanagement.service.LikeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/like")
@CrossOrigin(origins = "http://localhost:${frontend.port}")
public class LikeController {

    @Autowired
    private LikeService likeService;

    @PostMapping("/{newsId}/addLikeNews/{clubId}/{memberId}")
    public News addLikeToNews(@PathVariable("newsId") String newsId, @PathVariable("clubId") String clubId, @PathVariable("memberId") String memberId) {
        return likeService.addLikeToNews(newsId, clubId, memberId);
    }

    @PostMapping("/{eventId}/addLikeEvent/{clubId}/{memberId}")
    public Event addLikeToEvent(@PathVariable("eventId") String newsId, @PathVariable("clubId") String clubId, @PathVariable("memberId") String memberId) {
        return likeService.addLikeToEvent(newsId, clubId, memberId);
    }

    @PostMapping("/{newsId}/removeLikeNews/{clubId}/{memberId}")
    public News removeLikeFromNews(@PathVariable("newsId") String newsId, @PathVariable("clubId") String clubId, @PathVariable("memberId") String memberId) {
        return likeService.removeLikeFromNews(newsId, clubId, memberId);
    }

    @PostMapping("/{eventId}/removeLikeEvent/{clubId}/{memberId}")
    public Event removeLikeFromEvent(@PathVariable("eventId") String eventId, @PathVariable("clubId") String clubId, @PathVariable("memberId") String memberId) {
        return likeService.removeLikeFromEvent(eventId, clubId, memberId);
    }

    @PostMapping("/{newsId}/likeCountNews/{clubId}/{memberId}")
    public int likeCountNews(@PathVariable("newsId") String newsId, @PathVariable("clubId") String clubId, @PathVariable("memberId") String memberId) {
        return likeService.getNewsLikeCount(newsId, clubId, memberId);
    }

    @PostMapping("/{newsId}/dislikeCountNews/{clubId}/{memberId}")
    public int dislikeCountNews(@PathVariable("newsId") String newsId, @PathVariable("clubId") String clubId, @PathVariable("memberId") String memberId) {
        return likeService.getNewsDislikeCount(newsId, clubId, memberId);
    }

    @PostMapping("/{eventId}/likeCountEvent/{clubId}/{memberId}")
    public int likeCountEvent(@PathVariable("eventId") String eventId, @PathVariable("clubId") String clubId, @PathVariable("memberId") String memberId) {
        return likeService.getEventLikeCount(eventId, clubId, memberId);
    }

    @PostMapping("/{eventId}/dislikeCountEvent/{clubId}/{memberId}")
    public int dislikeCountEvent(@PathVariable("eventId") String eventId, @PathVariable("clubId") String clubId, @PathVariable("memberId") String memberId) {
        return likeService.getEventDislikeCount(eventId, clubId, memberId);
    }
}
