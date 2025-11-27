package com.uokclubmanagement.service.impl;

import com.uokclubmanagement.entity.ClubAdmin;
import com.uokclubmanagement.entity.MainAdmin;
import com.uokclubmanagement.entity.Member;
import com.uokclubmanagement.repository.ClubAdminRepository;
import com.uokclubmanagement.repository.MainAdminRepository;
import com.uokclubmanagement.repository.MemberRepository;
import com.uokclubmanagement.service.MainAdminService;
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
public class MainAdminServiceImpl implements MainAdminService {

    @Autowired
    private MainAdminRepository mainAdminRepository;
    @Autowired
    private MemberRepository memberRepository;
    @Autowired
    private ClubAdminRepository clubAdminRepository;
    @Autowired
    private SequenceGeneratorService sequenceGeneratorService;
    @Autowired
    private UpdateEmailUtils updateEmailUtils;
    @Autowired
    private CloudinaryService cloudinaryService;

    @Override
    public MainAdmin createMainAdmin(MainAdmin mainAdmin) {

        // Check username and email exists
        String username = mainAdmin.getMainAdminUsername();
        String email = mainAdmin.getMainAdminEmail();

        // Query the database to check if a user with the same username and email exists
        Optional<Member> existingMemberByUsername = Optional.ofNullable(memberRepository.findMemberByUserName(username));
        Optional<Member> existingMemberByEmail = Optional.ofNullable(memberRepository.findMemberByEmail(email));
        Optional<MainAdmin> existingMainAdminByUsername = Optional.ofNullable(mainAdminRepository.findMainAdminByMainAdminUsername(username));
        Optional<MainAdmin> existingMainAdminByEmail = Optional.ofNullable(mainAdminRepository.findMainAdminByMainAdminEmail(email));
        Optional<ClubAdmin> existingClubAdminByUsername = Optional.ofNullable(clubAdminRepository.findClubAdminByUsername(username));


        if (existingMemberByUsername.isPresent() || existingMainAdminByUsername.isPresent() || existingClubAdminByUsername.isPresent()) {
            throw new RuntimeException("Username already exist");
        }
        else if (existingMemberByEmail.isPresent() || existingMainAdminByEmail.isPresent()) {
            throw new RuntimeException("Email already exist");
        }

        // If not exist
        else{
        // Set adminId
        if (mainAdmin.getMainAdminId()   == null || mainAdmin.getMainAdminId().isEmpty()){
            long seqValue = sequenceGeneratorService.generateSequence("Main Admin Sequence");
            String mainAdminId = String.format("Adm-%04d", seqValue);
            mainAdmin.setMainAdminId(mainAdminId);

            // Encode password
            BCryptPasswordEncoder bCryptPasswordEncoder = new BCryptPasswordEncoder(8);
            String encodedPassword = bCryptPasswordEncoder.encode(mainAdmin.getMainAdminPassword());
            mainAdmin.setMainAdminPassword(encodedPassword);

         }
            return mainAdminRepository.save(mainAdmin);
        }
    }

    @Override
    public List<MainAdmin> getAllMainAdmins() {
        return mainAdminRepository.findAll();
    }

    @Override
    public MainAdmin updateMainAdminById(String mainAdminID, MainAdmin mainAdmin, MultipartFile mainAdminImage) throws IOException {

        Optional<MainAdmin> existingMainAdmin = mainAdminRepository.findById(mainAdminID);
        // Check if existingMainAdmin is null
        if (existingMainAdmin.isEmpty()) {
            throw new RuntimeException("MainAdmin not found with id: " + mainAdminID);
        }
        // Update the mainAdmin fields
        updateMainAdminFields(existingMainAdmin.get(), mainAdmin, mainAdminImage);

        // Save on mainAdmin collection
        return mainAdminRepository.save(existingMainAdmin.get());
    }

    private void updateMainAdminFields(MainAdmin existingMainAdmin, MainAdmin mainAdmin, MultipartFile mainAdminImage) throws IOException {

        if (mainAdmin.getMainAdminName() != null) {
            existingMainAdmin.setMainAdminName(mainAdmin.getMainAdminName());
        }
        if (mainAdmin.getMainAdminEmail() != null) {
            // validate email exist
            String changingType = updateEmailUtils.validateEmail(mainAdmin.getMainAdminEmail());

            if(changingType == "successful"){
                existingMainAdmin.setMainAdminEmail(mainAdmin.getMainAdminEmail());
            }
            else {
                throw new RuntimeException("Email already exists!");
            }
        }
        if (mainAdmin.getMainAdminPhone() != null) {
            existingMainAdmin.setMainAdminPhone(mainAdmin.getMainAdminPhone());
        }
        if (mainAdmin.getMainAdminPassword() != null) {
            BCryptPasswordEncoder bCryptPasswordEncoder = new BCryptPasswordEncoder(8);
            String newEncodedPassword = bCryptPasswordEncoder.encode(mainAdmin.getMainAdminPassword());
            existingMainAdmin.setMainAdminPassword(newEncodedPassword);
        }

        if(mainAdminImage != null && !mainAdminImage.isEmpty()){
            cloudinaryService.deleteImage(existingMainAdmin.getMainAdminImageUrl());
            String mainAdminImageUrl = cloudinaryService.uploadImage(mainAdminImage);
            existingMainAdmin.setMainAdminImageUrl(mainAdminImageUrl);
        }

    }

    @Override
    public void deleteMainAdminById(String mainAdminId) {

        Optional<MainAdmin> deleteMainAdmin = mainAdminRepository.findById(mainAdminId);
            if (deleteMainAdmin.isPresent()) {
                MainAdmin mainAdmin = deleteMainAdmin.get();
                System.out.println("Deleted mainAdmin: " + mainAdminId);
        }
        else {
            throw new RuntimeException("MainAdmin not found with id: " + mainAdminId);
        }
    }

    @Override
    public MainAdmin getMainAdminById(String mainAdminId) {

        Optional<MainAdmin> findMainAdmin = mainAdminRepository.findById(mainAdminId);
        if (findMainAdmin.isEmpty()) {
            throw new RuntimeException("MainAdmin not found with id: " + mainAdminId);
        }
        else {
            return findMainAdmin.get();
        }
    }
}
