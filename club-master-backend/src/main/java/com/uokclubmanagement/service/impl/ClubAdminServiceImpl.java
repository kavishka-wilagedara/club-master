package com.uokclubmanagement.service.impl;

import com.uokclubmanagement.entity.Club;
import com.uokclubmanagement.entity.ClubAdmin;
import com.uokclubmanagement.entity.MainAdmin;
import com.uokclubmanagement.entity.Member;
import com.uokclubmanagement.repository.ClubAdminRepository;
import com.uokclubmanagement.repository.ClubRepository;
import com.uokclubmanagement.repository.MainAdminRepository;
import com.uokclubmanagement.repository.MemberRepository;
import com.uokclubmanagement.service.ClubAdminService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

@Service
public class ClubAdminServiceImpl implements ClubAdminService {

    @Autowired
    private MemberRepository memberRepository;
    @Autowired
    private ClubRepository clubRepository;
    @Autowired
    private ClubAdminRepository clubAdminRepository;
    @Autowired
    private MainAdminRepository mainAdminRepository;
    @Autowired
    private SequenceGeneratorService sequenceGeneratorService;

    @Override
    public ClubAdmin createClubAdmin(String memberId, String clubId, ClubAdmin clubAdmin) {

        // Check already registered as clubAdmin. one memberId can be a one club admin
        Optional<ClubAdmin> existClubAdmin = Optional.ofNullable(clubAdminRepository.findClubAdminByMemberId(memberId));
        if (existClubAdmin.isPresent()) {
            throw new RuntimeException("Club Admin already exists with clubId: " + existClubAdmin.get().getClubId());
        }

        // Find member and club are exist
        Optional<Member> optionalMember = memberRepository.findById(memberId);
        Optional<Club> optionalClub = clubRepository.findById(clubId);

        if (optionalMember.isEmpty()) {
            throw new RuntimeException("Member not found with memberId " + memberId);
        }
        else if (optionalClub.isEmpty()) {
            throw new RuntimeException("Club not found with clubId " + clubId);
        }

        // Query the database to check if a user with the same username
        Optional<ClubAdmin> optionalClubAdmin = Optional.ofNullable(clubAdminRepository.findClubAdminByUsername(clubAdmin.getUsername()));
        Optional<MainAdmin> existingMainAdminByUserName = Optional.ofNullable(mainAdminRepository.findMainAdminByMainAdminUsername(clubAdmin.getUsername()));
        Optional<Member> existingMemberByUsername = Optional.ofNullable(memberRepository.findMemberByUserName(clubAdmin.getUsername()));

        if (optionalClubAdmin.isPresent() || existingMainAdminByUserName.isPresent()) {
            throw new RuntimeException("username already exist: " + clubAdmin.getUsername());
        }
        // Check club admin username with member username
        else if(existingMemberByUsername.isPresent()){
            throw new RuntimeException("ClubAdmin username can not as your member profile's username: " + clubAdmin.getUsername());
        }

        // Check the availability of clubId on member associated clubs
        Member member = optionalMember.get();

        List<String> memberAssociatedClub = member.getAssociatedClubs();

        if(!memberAssociatedClub.contains(clubId)){
            throw new RuntimeException("Member is not associated with clubId: " + clubId);
        }

        // Create club admin
        else{
            if(clubAdmin.getClubAdminId() == null || clubAdmin.getClubAdminId().isEmpty()) {
                long seqValue = sequenceGeneratorService.generateSequence("Main Admin Sequence");
                String clubAdminId = String.format(clubId + ":" + "Admin-%03d", seqValue);

                clubAdmin.setClubId(clubId);
                clubAdmin.setClubAdminId(clubAdminId);
                clubAdmin.setMemberId(memberId);
                clubAdmin.setFullName(member.getFirstName()+" "+member.getLastName());
                clubAdmin.setEmail(member.getEmail());

                // Encode password
                BCryptPasswordEncoder bCryptPasswordEncoder = new BCryptPasswordEncoder(8);
                String encodedPassword = bCryptPasswordEncoder.encode(clubAdmin.getPassword());
                clubAdmin.setPassword(encodedPassword);
            }
        }
        return clubAdminRepository.save(clubAdmin);
    }

    @Override
    public List<ClubAdmin> getAllClubAdmins() {
        return clubAdminRepository.findAll();
    }

    @Override
    public List<ClubAdmin> getAllClubAdminsByClubId(String clubId) {
            Optional<Club> optionalClub = clubRepository.findById(clubId);

            if (optionalClub.isPresent()) {
                return clubAdminRepository.findClubAdminByClubId(clubId);  // Use repository method to directly
            }

        else {
            throw new RuntimeException("Club not found with clubId: " + clubId);
        }
    }

    @Override
    public ClubAdmin getClubAdminById(String clubAdminId) {

        Optional<ClubAdmin> optionalClubAdmin = clubAdminRepository.findById(clubAdminId);

        if (optionalClubAdmin.isEmpty()){
            throw new RuntimeException("Club admin id not found with: "+clubAdminId);
        }
        else{
            ClubAdmin clubAdmin = optionalClubAdmin.get();
            return clubAdmin;
        }
    }

    @Override
    public void deleteClubAdmin(String clubAdminId) {

        Optional<ClubAdmin> optionalClubAdmin = clubAdminRepository.findById(clubAdminId);

        if (optionalClubAdmin.isEmpty()){
            throw new RuntimeException("Club admin not found with: "+clubAdminId);
        }

        clubAdminRepository.delete(optionalClubAdmin.get());
    }

    @Override
    public ClubAdmin updateClubAdmin(String clubAdminId, ClubAdmin clubAdmin) {

        Optional<ClubAdmin> optionalClubAdmin = clubAdminRepository.findById(clubAdminId);
        if (optionalClubAdmin.isEmpty()){
            throw new RuntimeException("Club admin not found with: "+clubAdminId);
        }
        else {
            ClubAdmin clubAdminToUpdate = optionalClubAdmin.get();

            BCryptPasswordEncoder bCryptPasswordEncoder = new BCryptPasswordEncoder(8);
            String newEncodedPassword = bCryptPasswordEncoder.encode(clubAdmin.getPassword());
            clubAdminToUpdate.setPassword(newEncodedPassword);
            clubAdminRepository.save(clubAdminToUpdate);
            return clubAdminToUpdate;
        }
    }
}

