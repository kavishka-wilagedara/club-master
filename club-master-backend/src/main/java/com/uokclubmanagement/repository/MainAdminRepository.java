package com.uokclubmanagement.repository;

import com.uokclubmanagement.entity.MainAdmin;
import com.uokclubmanagement.entity.Member;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface MainAdminRepository extends MongoRepository<MainAdmin, String> {

    MainAdmin findMainAdminByMainAdminUsername(String username);
    MainAdmin findMainAdminByMainAdminEmail(String email);
}
