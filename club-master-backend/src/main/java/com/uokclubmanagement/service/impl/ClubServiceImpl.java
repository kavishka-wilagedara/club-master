package com.uokclubmanagement.service.impl;

import com.uokclubmanagement.dto.EnrollmentDTO;
import com.uokclubmanagement.entity.Club;
import com.uokclubmanagement.entity.Member;
import com.uokclubmanagement.repository.ClubRepository;
import com.uokclubmanagement.repository.MemberRepository;
import com.uokclubmanagement.service.ClubService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class ClubServiceImpl implements ClubService {

    @Autowired
    private ClubRepository clubRepository;
    @Autowired
    private MemberRepository memberRepository;
    @Autowired
    private SequenceGeneratorService sequenceGeneratorService;
    @Autowired
    private CloudinaryService cloudinaryService;

    @Override
    public Club createClub(Club club, MultipartFile logo, MultipartFile[] backgroundImages) throws IOException {

        // Check the club exist
        Optional<Club> optionalClubByName = Optional.ofNullable(clubRepository.findClubByClubName(club.getClubName()));
        if (optionalClubByName.isPresent()) {
            throw new RuntimeException("A club with the same name already exists.");
        }
        // If not exist
        else {
            if (club.getClubId() == null || club.getClubId().isEmpty()) {
                long seqValue = sequenceGeneratorService.generateSequence("Clubs Sequence");
                String clubId = String.format("Club-%03d", seqValue);
                club.setClubId(clubId);
            }

            // Set clubImages
            saveClubImages(club, logo, backgroundImages);

            return clubRepository.save(club);
        }
    }

    @Override
    public List<Club> getAllClubs() {
        return clubRepository.findAll();
    }

    @Override
    public Club updateClubById(String clubId, Club club, MultipartFile newLogoFile, MultipartFile[] newBackgroundImages ) throws IOException {
        Optional<Club> existingClub = clubRepository.findById(clubId);
        // Check if existingClub is null
        if (existingClub.isEmpty()) {
            throw new RuntimeException("Club not found with id: " + clubId);
        }

        // Update the club fields
        updateClubFields(existingClub.get(), club);
        // Update clubImages
        saveClubImages(existingClub.get(), newLogoFile, newBackgroundImages);

        return clubRepository.save(existingClub.get());
    }

    @Override
    public void deleteClubById(String clubId) {

        Optional<Club> deleteClub = clubRepository.findById(clubId);
        if (deleteClub.isPresent()) {

            List<String> associatedMembers = new ArrayList<>();
            associatedMembers = deleteClub.get().getAssociatedMembers();

            for (int i = 0; i < associatedMembers.size(); i++) {

                Optional<Member> member = memberRepository.findById(associatedMembers.get(i));
                if (member.isPresent()) {
                    Member memberEntity = member.get();
                    List<String> associatedClub = new ArrayList<>();
                    associatedClub = memberEntity.getAssociatedClubs();

                    if(associatedClub.contains(clubId)){
                        associatedClub.remove(clubId);
                    }
                    memberRepository.save(memberEntity);
                }
            }

            clubRepository.delete(deleteClub.get());
            System.out.println("Deleted Club with id: " + clubId);
        }
        else{
            throw new RuntimeException("Club not found with id: " + clubId);
        }
    }

    @Override
    public Club getClubByClubId(String clubId) {

        Optional<Club> findClub = clubRepository.findById(clubId);
        if (findClub.isEmpty()) {
            throw new RuntimeException("Club not found with Id: " + clubId);
        }
        else {
            return findClub.get();
        }
    }

    @Override
    public Member enrollMemberToClub(String memberId, String clubId, EnrollmentDTO enrollmentKey) {

        // Find member and club is exist
        Optional<Member> optionalMember = memberRepository.findById(memberId);
        Optional<Club> optionalClub = clubRepository.findById(clubId);

        // Check already enrolled in to club
        if(optionalMember.isPresent() && optionalClub.isPresent()){
            Member member = optionalMember.get();
            List<String> memberAssociatedClubs = member.getAssociatedClubs();

            for (String id : memberAssociatedClubs) {
                if (id.equals(clubId)) {
                    throw new RuntimeException("Already enrolled with clubId: "+clubId);
                }
            }

            // If not enrolled in club
            Club club = optionalClub.get();

            // Enrollment key checking
            if(!enrollmentKey.getEnrollmentKey().equals(clubId)) {
                throw new RuntimeException("Enrollment key not correct with clubId: "+clubId);

            }

            // Update member and club
            member.getAssociatedClubs().add(clubId);
            club.getAssociatedMembers().add(memberId);

            memberRepository.save(member);
            clubRepository.save(club);

            return member;
        }
        else if (optionalMember.isEmpty()) {
            throw new RuntimeException("Invalid memberId.");
        }
        else {
            throw new RuntimeException("Invalid clubId.");
        }
    }

    @Override
    public Member unrollMemberFromClub(String memberId, String clubId) {

        // Find member and club is exist
        Optional<Member> optionalMember = memberRepository.findById(memberId);
        Optional<Club> optionalClub = clubRepository.findById(clubId);

        if (optionalMember.isPresent() && optionalClub.isPresent()) {
            Member member = optionalMember.get();
            Club club = optionalClub.get();

            // Update member and club
            member.getAssociatedClubs().remove(clubId);
            club.getAssociatedMembers().remove(memberId);

            memberRepository.save(member);
            clubRepository.save(club);

            return member;
        }
        else if (optionalMember.isEmpty()) {
            throw new RuntimeException("Invalid memberId.");
        }
        else {
            throw new RuntimeException("Invalid clubId.");
        }
    }

    @Override
    public List<Club> getClubsByMemberId(String memberId) {

        Optional<Member> optionalMember = memberRepository.findById(memberId);
        if (optionalMember.isPresent()) {
            Member member = optionalMember.get();

            // Get clubs in to List
            List<String> memberAssociatedClubs = member.getAssociatedClubs();
            List<Club> memberAssociatedClubsDetails = new ArrayList<>();


            // update club names in to List
            for (int i = 0; i < memberAssociatedClubs.size(); i++) {
                Optional<Club> optionalClub = clubRepository.findById(memberAssociatedClubs.get(i));
                if (optionalClub.isPresent()) {
                    Club club = optionalClub.get();
                    memberAssociatedClubsDetails.add(club);
                }
            }
            return memberAssociatedClubsDetails;
        }
        else {
            throw new RuntimeException("Member not found with id: " + memberId);
        }
    }

    private void saveClubImages(Club club, MultipartFile logo, MultipartFile[] backgroundImages) throws IOException {

        // Set clubLogoUrl
        String clubLogoUrl = cloudinaryService.uploadImage(logo);
        club.setClubLogoUrl(clubLogoUrl);

        // Set backgroundImageUrl
        List<String> backgroundImageUrl = new ArrayList<>();
        for (int i = 0; i < 3; i++) {
            backgroundImageUrl.add(cloudinaryService.uploadImage(backgroundImages[i]));
        }

        club.setBackgroundImageUrls(backgroundImageUrl);
    }

    private void updateClubFields(Club existingClub, Club club) {

        Optional<Club> findClubByName = Optional.ofNullable(clubRepository.findClubByClubName(club.getClubName()));
        Optional<Club> findClubByEmail = Optional.ofNullable(clubRepository.findClubByClubEmail(club.getClubEmail()));
        Optional<Club> findClubByPhone = Optional.ofNullable(clubRepository.findClubByClubPhone(club.getClubPhone()));

        // Check club name / email / phone number exists
        if (findClubByName.isPresent()) {
            throw new RuntimeException("A club with the same name already exists.");
        }
        else {
            if(club.getClubName()!= null) {
                existingClub.setClubName(club.getClubName());
            }
        }
        if (findClubByEmail.isPresent()) {
            throw new RuntimeException("A club with the same email already exists.");
        }
        else {
            if(club.getClubEmail() != null) {
                existingClub.setClubEmail(club.getClubEmail());
            }
        }
        if (findClubByPhone.isPresent()) {
            throw new RuntimeException("A club with the same phone number already exists.");
        }
        else {
            if(club.getClubPhone() != null) {
                existingClub.setClubPhone(club.getClubPhone());
            }
        }

        // Update other fields
        if (club.getClubAddress() != null) {
            existingClub.setClubAddress(club.getClubAddress());
        }
        if (club.getClubSeniorAdviser() != null) {
            existingClub.setClubSeniorAdviser(club.getClubSeniorAdviser());
        }
        if (club.getClubDescription() != null){
            existingClub.setClubDescription(club.getClubDescription());
        }
    }
}
