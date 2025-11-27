package com.uokclubmanagement.controller;

import com.uokclubmanagement.entity.ClubAdmin;
import com.uokclubmanagement.service.ClubAdminService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/v1/clubAdmin")
@CrossOrigin(origins = "http://localhost:${frontend.port}")
public class ClubAdminController {

    @Autowired
    ClubAdminService clubAdminService;

    @PostMapping("/{memberId}/save/{clubId}")
    public ClubAdmin saveClubAdmin(@PathVariable("memberId") String memberId, @PathVariable("clubId") String clubId, @RequestBody ClubAdmin clubAdmin) {
        return clubAdminService.createClubAdmin(memberId, clubId, clubAdmin);
    }

    @GetMapping("/all")
    public List<ClubAdmin> getAllClubAdmin() {
        return clubAdminService.getAllClubAdmins();
    }

    @GetMapping("/allClubsAdmins/{clubId}")
    public List<ClubAdmin> getAllClubAdminsByClubId(@PathVariable("clubId") String clubId) {
        return clubAdminService.getAllClubAdminsByClubId(clubId);
    }

    @GetMapping("/getClubAdmin/{clubAdminId}")
    public ClubAdmin getClubAdmin(@PathVariable("clubAdminId") String clubAdminId) {
        return clubAdminService.getClubAdminById(clubAdminId);
    }

    @DeleteMapping("/delete/{clubAdminId}")
    public void deleteClubAdmin(@PathVariable("clubAdminId") String clubAdminId) {
        clubAdminService.deleteClubAdmin(clubAdminId);
    }

    @PutMapping("/update/{clubAdminId}")
    public ClubAdmin updateClubAdmin(@RequestBody ClubAdmin clubAdmin, @PathVariable("clubAdminId") String clubAdminId) {
        return clubAdminService.updateClubAdmin(clubAdminId, clubAdmin);
    }
}
