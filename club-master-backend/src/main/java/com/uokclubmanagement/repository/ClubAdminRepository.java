package com.uokclubmanagement.repository;

import com.uokclubmanagement.entity.ClubAdmin;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
//import org.springframework.data.mongodb.repository.MongoRepository;


public interface ClubAdminRepository extends MongoRepository<ClubAdmin, String> {

    ClubAdmin findClubAdminByUsername(String userName);
    ClubAdmin findClubAdminByMemberId(String memberId);
    ClubAdmin findClubAdminByEmail(String email);
    List<ClubAdmin> findClubAdminByClubId(String clubId);
}
