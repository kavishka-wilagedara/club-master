package com.uokclubmanagement.service;

import com.uokclubmanagement.entity.News;

import java.util.List;

public interface NewsService {

    News createNews(News news, String clubId, String clubAdminId);
    List<News> getAllNews();
    News getNewsById(String newsId);
    News updateNewsById(String clubAdminId, String newsId, News news);
    void deleteNewsById(String newsId);
    List<News> getAllNewsByMemberId(String clubId);
}
