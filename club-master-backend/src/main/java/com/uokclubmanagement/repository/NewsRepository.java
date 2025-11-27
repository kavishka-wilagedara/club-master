package com.uokclubmanagement.repository;

import com.uokclubmanagement.entity.News;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.repository.CrudRepository;

import java.util.List;

public interface NewsRepository extends MongoRepository<News, String> {

    List<News> getAllNewsByResponseClub(String responseClub);
}
