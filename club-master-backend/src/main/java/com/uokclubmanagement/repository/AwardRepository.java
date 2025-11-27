package com.uokclubmanagement.repository;

import com.uokclubmanagement.entity.Award;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface AwardRepository extends MongoRepository<Award, String> {

    List<Award> getAllAwardsByResponseClub(String clubId);
}
