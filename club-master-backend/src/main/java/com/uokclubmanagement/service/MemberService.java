package com.uokclubmanagement.service;

import com.uokclubmanagement.entity.Member;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

public interface MemberService {
    Member createMember(Member member);
    Member getMemberById(String memberId);
    List<Member> getAllMembers();
    Member updateMemberById(String memberId, Member member, MultipartFile file) throws IOException;
    void deleteMemberById(String memberId);
    Member getMemberByUserName(String userName);
}
