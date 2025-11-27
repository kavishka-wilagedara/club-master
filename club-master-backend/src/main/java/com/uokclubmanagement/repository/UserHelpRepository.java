package com.uokclubmanagement.repository;

import com.uokclubmanagement.entity.UserHelp;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface UserHelpRepository extends MongoRepository<UserHelp, String> {

    List<UserHelp> getAllHelpMessagesByFaculty(String faculty);
}
