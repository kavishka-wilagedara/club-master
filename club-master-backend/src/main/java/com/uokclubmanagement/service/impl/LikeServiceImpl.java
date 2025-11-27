package com.uokclubmanagement.service.impl;

import com.uokclubmanagement.entity.*;
import com.uokclubmanagement.repository.*;
import com.uokclubmanagement.service.LikeService;
import com.uokclubmanagement.utills.LikeCommentUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@Transactional
public class LikeServiceImpl implements LikeService {

    @Autowired
    private NewsRepository newsRepository;
    @Autowired
    private ClubRepository clubRepository;
    @Autowired
    private MemberRepository memberRepository;
    @Autowired
    private EventRepository eventRepository;
    @Autowired
    private LikeCommentUtils likeCommentUtils;

    @Override
    public News addLikeToNews(String newsId, String clubId, String memberId) {
        News news = validateClubIdWithNewsAndMembers(newsId, clubId, memberId);
        handleLike(news.getLike(), memberId);
        newsRepository.save(news);
        return news;
    }

    @Override
    public News removeLikeFromNews(String newsId, String clubId, String memberId) {
        News news = validateClubIdWithNewsAndMembers(newsId, clubId, memberId);
        handleDislike(news.getLike(), memberId);
        newsRepository.save(news);
        return news;
    }

    @Override
    public Event addLikeToEvent(String eventId, String clubId, String memberId) {
        Event event = likeCommentUtils.validateClubIdWithEventAndMembers(eventId, clubId, memberId);
        handleLike(event.getLike(), memberId);
        eventRepository.save(event);
        return event;
    }

    @Override
    public Event removeLikeFromEvent(String eventId, String clubId, String memberId) {
        Event event = likeCommentUtils.validateClubIdWithEventAndMembers(eventId, clubId, memberId);
        handleDislike(event.getLike(), memberId);
        eventRepository.save(event);
        return event;
    }

    @Override
    public Integer getNewsLikeCount(String newsId, String clubId, String memberId) {
        News news = validateClubIdWithNewsAndMembers(newsId, clubId, memberId);

        int likeCount = news.getLike().getMembersLike().size();
        return likeCount;
    }

    @Override
    public Integer getNewsDislikeCount(String newsId, String clubId, String memberId) {
        News news = validateClubIdWithNewsAndMembers(newsId, clubId, memberId);

        int dislikeCount = news.getLike().getMembersDislike().size();
        return dislikeCount;
    }

    @Override
    public Integer getEventLikeCount(String eventId, String clubId, String memberId) {
        Event event = likeCommentUtils.validateClubIdWithEventAndMembers(eventId, clubId, memberId);

        int likeCount = event.getLike().getMembersLike().size();
        return likeCount;
    }

    @Override
    public Integer getEventDislikeCount(String eventId, String clubId, String memberId) {
        Event event = likeCommentUtils.validateClubIdWithEventAndMembers(eventId, clubId, memberId);

        int dislikeCount = event.getLike().getMembersDislike().size();
        return dislikeCount;
    }

    private void handleLike(Like contentLike, String memberId){

        // Check member already add a like
        if(contentLike.getMembersLike().contains(memberId)){
            throw new RuntimeException("Already liked!");
        }

        // If member already disliked, dislike will delete and add a like
        else if(contentLike.getMembersDislike().contains(memberId)){
            contentLike.getMembersDislike().remove(memberId);
            contentLike.getMembersLike().add(memberId);
        }

        // Normal like
        else{
            contentLike.getMembersLike().add(memberId);
        }
    }

    private void handleDislike(Like contentDislike, String memberId){

        // Check member already add a dislike
        if(contentDislike.getMembersDislike().contains(memberId)){
            throw new RuntimeException("Already disliked!");
        }

        // If member already liked, like will delete and add a dislike
        else if(contentDislike.getMembersLike().contains(memberId)){
            contentDislike.getMembersLike().remove(memberId);
            contentDislike.getMembersDislike().add(memberId);
        }

        // Normal dislike
        else {
            contentDislike.getMembersDislike().add(memberId);
        }
    }


    private News validateClubIdWithNewsAndMembers(String newsId, String clubId, String memberId) {

        // Query the database to check if member, news, club exist by id
        Optional<News> optionalNews = newsRepository.findById(newsId);
        Optional<Club> clubOptional = clubRepository.findById(clubId);
        Optional<Member> memberOptional = memberRepository.findById(memberId);

        if(optionalNews.isEmpty()) {
            throw new RuntimeException("Invalid News ID");
        }
        else if(clubOptional.isEmpty()){
            throw new RuntimeException("Invalid Club ID");
        }
        else if(memberOptional.isEmpty()){
            throw new RuntimeException("Invalid Member ID");
        }

        // Club id check with member associated clubs and news response club
        else if(!optionalNews.get().getResponseClub().equals(clubId) || !memberOptional.get().getAssociatedClubs().contains(clubId)){
            throw new RuntimeException("Club ID error");
        }

        return optionalNews.get();
    }
}
