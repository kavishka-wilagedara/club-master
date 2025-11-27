package com.uokclubmanagement.controller;

import com.uokclubmanagement.entity.Event;
import com.uokclubmanagement.entity.News;
import com.uokclubmanagement.repository.NewsRepository;
import com.uokclubmanagement.service.NewsService;
import jdk.jfr.ContentType;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/news")
@CrossOrigin(origins = "http://localhost:${frontend.port}")
public class NewsController {

    @Autowired
    private NewsService newsService;
    @Autowired
    private NewsRepository newsRepository;

    @PostMapping("/{clubId}/save/{clubAdminId}")
    public News createNews(@PathVariable("clubId") String clubId, @PathVariable("clubAdminId") String clubAdminId, @RequestBody News news) {
        return newsService.createNews(news, clubId, clubAdminId);
    }

    @GetMapping("/all")
    public List<News> getAllNews() {
        return newsService.getAllNews();
    }

    @GetMapping("/getAllNews/{memberId}")
    public List<News> getAllNewsByMemberId(@PathVariable("memberId") String memberId) {
        return newsService.getAllNewsByMemberId(memberId);
    }

    @PutMapping("/{clubAdminId}/update/{newsId}")
    public News updateNews(@PathVariable("clubAdminId") String clubAdminId, @PathVariable("newsId") String newsId, @RequestBody News news) {
        return newsService.updateNewsById(clubAdminId, newsId, news);
    }

    @DeleteMapping("/delete/{newsId}")
    public void deleteNews(@PathVariable("newsId") String newsId) {
        newsService.deleteNewsById(newsId);
    }

    @GetMapping("/getNews/{newsId}")
    public News getEvent(@PathVariable("newsId") String newsId) {
        return newsService.getNewsById(newsId);
    }

    @GetMapping("/{clubId}/getAllNews")
    public List<News> getAllNewsByClubId(@PathVariable("clubId") String clubId) {
        return newsRepository.getAllNewsByResponseClub(clubId);
    }
}
