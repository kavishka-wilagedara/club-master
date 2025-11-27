package com.uokclubmanagement.service.impl;

import com.uokclubmanagement.entity.ClubAdmin;
import com.uokclubmanagement.entity.MainAdmin;
import com.uokclubmanagement.entity.Member;
import com.uokclubmanagement.repository.ClubAdminRepository;
import com.uokclubmanagement.repository.MainAdminRepository;
import com.uokclubmanagement.repository.MemberRepository;
import com.uokclubmanagement.service.MemberService;
import com.uokclubmanagement.utills.UpdateEmailUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class MemberServiceImpl implements MemberService {

    @Autowired
    private MemberRepository memberRepository;
    @Autowired
    private ClubAdminRepository clubAdminRepository;
    @Autowired
    private MainAdminRepository mainAdminRepository;
    @Autowired
    private SequenceGeneratorService sequenceGeneratorService;
    @Autowired
    private UpdateEmailUtils updateEmailUtils;
    @Autowired
    private CloudinaryService cloudinaryService;

    @Override
    public Member createMember(Member member) {

        // Check the username and email already exist
        String userName = member.getUserName();
        String email = member.getEmail();

        // Query the database to check if a user with the same username and email exists
        Optional<Member> existingMemberByUserName = Optional.ofNullable(memberRepository.findMemberByUserName(userName));
        Optional<Member> existingMemberByEmail = Optional.ofNullable(memberRepository.findMemberByEmail(email));
        Optional<MainAdmin> existingMainAdminByUserName = Optional.ofNullable(mainAdminRepository.findMainAdminByMainAdminUsername(userName));
        Optional<MainAdmin> existingMainAdminByEmail = Optional.ofNullable(mainAdminRepository.findMainAdminByMainAdminEmail(email));
        Optional<ClubAdmin> existingClubAdminByUserName = Optional.ofNullable(clubAdminRepository.findClubAdminByUsername(userName));


        if (existingMemberByUserName.isPresent() || existingMainAdminByUserName.isPresent() || existingClubAdminByUserName.isPresent()) {
            throw new RuntimeException("Username already exist");
        }
        else if (existingMemberByEmail.isPresent() || existingMainAdminByEmail.isPresent()) {
            throw new RuntimeException("Email already exist");
        }

        // If not exist
        else{
        if (member.getMemberId()   == null || member.getMemberId().isEmpty()){
            long seqValue = sequenceGeneratorService.generateSequence("Member Sequence");
            String memberId = String.format("Mem-%05d", seqValue);
            member.setMemberId(memberId);

            BCryptPasswordEncoder bCryptPasswordEncoder = new BCryptPasswordEncoder(8);
            String encodedPassword = bCryptPasswordEncoder.encode(member.getPassword());
            member.setPassword(encodedPassword);
            }
            return memberRepository.save(member);
        }
    }

    @Override
    public Member getMemberById(String memberId) {
        Optional<Member> findMember = memberRepository.findById(memberId);
        if (findMember.isEmpty()) {
            throw new RuntimeException("Member not found with memberId: " + memberId);
        }
        return findMember.get();
    }

    @Override
    public List<Member> getAllMembers() {
        return memberRepository.findAll();
    }

    @Override
    public Member updateMemberById(String memberId, Member member, MultipartFile memberImage) throws IOException {

        Optional<Member> existingMember = memberRepository.findById(memberId);

        // Check the existingMember is null
        if (existingMember.isEmpty()) {
            throw new RuntimeException("MainAdmin not found with id: " + memberId);
        }

        // Update the fields
        updateMemberFields(existingMember.get(), member, memberImage);

        // Check if member is clubAdmin
        Optional<ClubAdmin> optionalClubAdmin = Optional.ofNullable(clubAdminRepository.findClubAdminByMemberId(memberId));
        if (optionalClubAdmin.isPresent()) {
            ClubAdmin clubAdmin = optionalClubAdmin.get();
            // Update clubAdmin fields
            clubAdmin.setFullName(member.getFirstName()+" "+member.getLastName());
            clubAdmin.setEmail(member.getEmail());
            clubAdmin.setPhone(member.getPhoneNo());
            clubAdmin.setImageUrl(member.getMemberImageUrl());
            clubAdminRepository.save(clubAdmin);
        }

        return memberRepository.save(existingMember.get());

    }

    private void updateMemberFields(Member existingMember, Member member, MultipartFile memberImage) throws IOException {
        if (member.getFirstName() != null) {
            existingMember.setFirstName(member.getFirstName());
        }
        if (member.getLastName() != null) {
            existingMember.setLastName(member.getLastName());
        }
        if (member.getEmail() != null) {
            // validate email exist
            String changingType = updateEmailUtils.validateEmail(member.getEmail());

            if(changingType == "successful"){
                existingMember.setEmail(member.getEmail());
            }
            else {
                throw new RuntimeException("Email already exists!");
            }
        }
        if (member.getPhoneNo() != null) {
            existingMember.setPhoneNo(member.getPhoneNo());
        }
        if (member.getPassword() != null) {
            BCryptPasswordEncoder bCryptPasswordEncoder = new BCryptPasswordEncoder(8);
            String newEncodedPassword = bCryptPasswordEncoder.encode(member.getPassword());
            existingMember.setPassword(newEncodedPassword);
        }

        if(memberImage != null && !memberImage.isEmpty()){
            cloudinaryService.deleteImage(existingMember.getMemberImageUrl());
            String memberImageUrl = cloudinaryService.uploadImage(memberImage);
            existingMember.setMemberImageUrl(memberImageUrl);
        }
    }

    @Override
    public void deleteMemberById(String memberId) {
        Optional<Member> deleteMember = memberRepository.findById(memberId);
        if (deleteMember.isPresent()) {
            memberRepository.delete(deleteMember.get());
            System.out.println("Deleted member with id: " + memberId);
        }
        else {
            throw new RuntimeException("Member not found with id: " + memberId);
        }
    }

    @Override
    public Member getMemberByUserName(String userName) {
        Member findMember = memberRepository.findMemberByUserName(userName);
        if (findMember == null) {
            throw new RuntimeException("Member not found with username: " + userName);
        }
        return findMember;
    }
}
