package com.uokclubmanagement.repository;

import com.uokclubmanagement.entity.Project;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface ProjectRepository extends MongoRepository<Project, String> {

    List<Project> getAllProjectsByResponseClub(String clubId);
}
