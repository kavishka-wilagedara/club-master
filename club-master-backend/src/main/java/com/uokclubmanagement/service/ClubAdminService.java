package com.uokclubmanagement.service;

import com.uokclubmanagement.entity.ClubAdmin;

import java.util.List;
import java.util.Optional;

public interface ClubAdminService {

    ClubAdmin createClubAdmin(String memberId, String clubId, ClubAdmin clubAdmin);
    List<ClubAdmin> getAllClubAdmins();
    List<ClubAdmin> getAllClubAdminsByClubId(String clubId);
    ClubAdmin getClubAdminById(String clubAdminId);
    void deleteClubAdmin(String clubAdminId);
    ClubAdmin updateClubAdmin(String clubAdminId, ClubAdmin clubAdmin);

}
