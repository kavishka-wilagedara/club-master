package com.uokclubmanagement.utills;

import com.uokclubmanagement.entity.MainAdmin;
import com.uokclubmanagement.entity.Member;
import com.uokclubmanagement.repository.MainAdminRepository;
import com.uokclubmanagement.repository.MemberRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
public class UpdateEmailUtils {

    @Autowired
    private MemberRepository memberRepository;
    @Autowired
    private MainAdminRepository mainAdminRepository;

    public String validateEmail(String email){
        Optional<Member> findMemberWithSameEmail = Optional.ofNullable(memberRepository.findMemberByEmail(email));
        Optional<MainAdmin> findMainAdminWithSameEmail = Optional.ofNullable(mainAdminRepository.findMainAdminByMainAdminEmail(email));
        // If member and main admin not exist with new email
        if(findMemberWithSameEmail.isEmpty() && findMainAdminWithSameEmail.isEmpty()) {
            return "successful";
        }
        else {
            return "unsuccessful";
        }
    }
}

