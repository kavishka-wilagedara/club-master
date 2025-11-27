package com.uokclubmanagement.service.impl;

import com.uokclubmanagement.dto.UserDTO;
import com.uokclubmanagement.entity.ClubAdmin;
import com.uokclubmanagement.entity.MainAdmin;
import com.uokclubmanagement.entity.Member;
import com.uokclubmanagement.repository.ClubAdminRepository;
import com.uokclubmanagement.repository.MainAdminRepository;
import com.uokclubmanagement.repository.MemberRepository;
import com.uokclubmanagement.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class LoginServiceImpl {

    @Autowired
    private MainAdminRepository mainAdminRepository;

    @Autowired
    private MemberRepository memberRepository;

    @Autowired
    private ClubAdminRepository clubAdminRepository;

    @Autowired
    private JwtUtil jwtUtil;

    private BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public UserDTO login(String username, String password) {
        String role = null;
        String userId = null;

        // Check main-admin collection
        MainAdmin mainAdmin = mainAdminRepository.findMainAdminByMainAdminUsername(username);
        if (mainAdmin != null && passwordEncoder.matches(password, mainAdmin.getMainAdminPassword())) {
            role = "MAIN_ADMIN";
            userId = mainAdmin.getMainAdminId();
        }

        // Check club-admin collection
        if (role == null) {
            ClubAdmin clubAdmin = clubAdminRepository.findClubAdminByUsername(username);
            if (clubAdmin != null && passwordEncoder.matches(password, clubAdmin.getPassword())) {
                role = "CLUB_ADMIN";
                userId = clubAdmin.getClubAdminId();
            }
        }

        // Check member collection
        if (role == null) {
            Member member = memberRepository.findMemberByUserName(username);
            if (member != null && passwordEncoder.matches(password, member.getPassword())) {
                role = "MEMBER";
                userId = member.getMemberId();
            }
        }

        if (role == null) {
            throw new RuntimeException("Invalid username or password");
        }

        // Generate token with userId instead of username
        String token = jwtUtil.generateToken(userId, role);

        return new UserDTO(role, username, userId, token);
    }
}
