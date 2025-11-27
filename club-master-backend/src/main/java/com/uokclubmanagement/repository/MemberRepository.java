package com.uokclubmanagement.repository;

import com.uokclubmanagement.entity.Member;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface MemberRepository extends MongoRepository<Member, String> {

    Member findMemberByUserName(String userName);
    Member findMemberByEmail(String email);
}
