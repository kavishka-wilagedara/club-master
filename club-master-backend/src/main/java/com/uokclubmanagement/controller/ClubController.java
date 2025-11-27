package com.uokclubmanagement.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.uokclubmanagement.dto.EnrollmentDTO;
import com.uokclubmanagement.entity.Club;
import com.uokclubmanagement.entity.Member;
import com.uokclubmanagement.service.ClubService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/v1/club")
@CrossOrigin(origins = "http://localhost:${frontend.port}")
public class ClubController {

    @Autowired
    private ClubService clubService;

    @PostMapping("/save")
    public Club saveClub(@RequestPart String clubJason,
                         @RequestPart("clubLogo") MultipartFile clubLogo,
                         @RequestPart("backgroundImages") MultipartFile[] backgroundImages) throws IOException {

        // Register the JavaTimeModule
        ObjectMapper objectMapper = new ObjectMapper();
        objectMapper.registerModule(new JavaTimeModule());

        // Deserialize the JSON string to Club object
        Club club = objectMapper.readValue(clubJason, Club.class);

        return clubService.createClub(club, clubLogo, backgroundImages);
    }

    @GetMapping("/all")
    public List<Club> getAllClubs() {
        return clubService.getAllClubs();
    }

    @PutMapping("/update/{clubId}")
    public Club updateClub(@PathVariable String clubId,
                           @RequestPart("club") String clubJason,
                           @RequestPart("clubLogo") MultipartFile newClubLogo,
                           @RequestPart("BackgroundImages") MultipartFile[] newBackgroundImages) throws IOException {

        // Register the JavaTimeModule
        ObjectMapper objectMapper = new ObjectMapper();
        objectMapper.registerModule(new JavaTimeModule());

        // Deserialize the JSON string to Club object
        Club club = objectMapper.readValue(clubJason, Club.class);

        return clubService.updateClubById(clubId, club, newClubLogo, newBackgroundImages);
    }

    @DeleteMapping("/delete/{id}")
    public void deleteClub(@PathVariable("id") String clubId) {
        clubService.deleteClubById(clubId);
    }

    @GetMapping("/findClub/{id}")
    public Club findClubById(@PathVariable("id") String clubId) {
        return clubService.getClubByClubId(clubId);
    }

    @PostMapping("/{memberId}/enroll-member/{clubId}")
    public Member assignMember(@PathVariable String memberId, @PathVariable String clubId, @RequestBody EnrollmentDTO enrollmentKey) {
        return clubService.enrollMemberToClub(memberId, clubId, enrollmentKey);
    }

    @DeleteMapping("/{memberId}/unroll-member/{clubId}")
    public Member unassignMember(@PathVariable String memberId, @PathVariable String clubId) {
        return clubService.unrollMemberFromClub(memberId, clubId);
    }

    @GetMapping("/{memberId}/getClubs")
    public List<Club> getClubsByMemberId(@PathVariable String memberId) {
        return clubService.getClubsByMemberId(memberId);
    }
}
