package com.uokclubmanagement.entity;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Document("news")
public class News extends ContentSchedule{

    @Id
    private String newsId;

    private String newsTitle;
    private Like like = new Like();

    public News() {}

    public String getNewsId() {
        return newsId;
    }

    public void setNewsId(String newsId) {
        this.newsId = newsId;
    }

    public String getNewsTitle() {
        return newsTitle;
    }

    public Like getLike() {
        return like;
    }

    public void setLike(Like like) {
        this.like = like;
    }

    public void setNewsTitle(String newsTitle) {
        this.newsTitle = newsTitle;
    }

}
