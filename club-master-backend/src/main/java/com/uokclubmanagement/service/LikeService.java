package com.uokclubmanagement.service;

import com.uokclubmanagement.entity.Event;
import com.uokclubmanagement.entity.News;

public interface LikeService {

    News addLikeToNews(String newsId, String clubId, String memberId);
    News removeLikeFromNews(String newsId, String clubId, String memberId);
    Event addLikeToEvent(String eventId, String clubId, String memberId);
    Event removeLikeFromEvent(String eventId, String clubId, String memberId);
    Integer getNewsLikeCount(String newsId, String clubId, String memberId);
    Integer getNewsDislikeCount(String newsId, String clubId, String memberId);
    Integer getEventLikeCount(String eventId, String clubId, String memberId);
    Integer getEventDislikeCount(String eventId, String clubId, String memberId);

}
