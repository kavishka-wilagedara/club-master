package com.uokclubmanagement.service;

import com.uokclubmanagement.dto.EnrollmentDTO;
import com.uokclubmanagement.entity.Club;
import com.uokclubmanagement.entity.Member;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

public interface ClubService {

    Club createClub(Club club, MultipartFile logoFile, MultipartFile[] backgroundImages ) throws IOException;
    List<Club> getAllClubs();
    Club updateClubById(String clubId, Club club, MultipartFile newLogoFile, MultipartFile[] backgroundImages ) throws IOException;
    void deleteClubById(String clubId);
    Club getClubByClubId(String clubId);
    Member enrollMemberToClub(String memberId, String clubId, EnrollmentDTO enrollmentKey);
    Member unrollMemberFromClub(String memberId, String clubId);

    List<Club> getClubsByMemberId(String memberId);
}
