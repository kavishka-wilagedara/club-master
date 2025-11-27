package com.uokclubmanagement.service.impl;

import com.uokclubmanagement.dto.ForgottenPasswordDTO;
import com.uokclubmanagement.dto.NewPasswordDTO;
import com.uokclubmanagement.entity.ClubAdmin;
import com.uokclubmanagement.entity.MainAdmin;
import com.uokclubmanagement.entity.Member;
import com.uokclubmanagement.entity.PasswordResetToken;
import com.uokclubmanagement.repository.ClubAdminRepository;
import com.uokclubmanagement.repository.MainAdminRepository;
import com.uokclubmanagement.repository.MemberRepository;
import com.uokclubmanagement.repository.PasswordRestTokenRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@Transactional
public class PasswordResetService {

    @Autowired
    private MemberRepository memberRepository;
    @Autowired
    private MainAdminRepository mainAdminRepository;
    @Autowired
    private ClubAdminRepository clubAdminRepository;
    @Autowired
    private PasswordRestTokenRepository passwordRestTokenRepository;
    @Autowired
    private EmailService emailService;

    public String passwordResetLink(ForgottenPasswordDTO forgottenPasswordDTO) {

        String email = forgottenPasswordDTO.getEmail();
        String username = forgottenPasswordDTO.getUsername();

        // Queries to find user role
        Optional<Member> optionalMemberByUsername = Optional.ofNullable(memberRepository.findMemberByUserName(username));
        Optional<Member> optionalMemberByEmail = Optional.ofNullable(memberRepository.findMemberByEmail(email));
        Optional<MainAdmin> optionalMainAdminByUsername = Optional.ofNullable(mainAdminRepository.findMainAdminByMainAdminUsername(username));
        Optional<MainAdmin> optionalMainAdminByEmail = Optional.ofNullable(mainAdminRepository.findMainAdminByMainAdminEmail(email));
        Optional<ClubAdmin> optionalClubAdminByUsername = Optional.ofNullable(clubAdminRepository.findClubAdminByUsername(username));

        if(optionalMemberByUsername.isPresent() && optionalMemberByEmail.isPresent()) {
            return generateAndSendToken(optionalMemberByUsername.get().getUserName(), email, "MEMBER");
        }
        else if(optionalMainAdminByUsername.isPresent() && optionalMainAdminByEmail.isPresent()) {
            return generateAndSendToken(optionalMainAdminByUsername.get().getMainAdminUsername(), email, "MAIN_ADMIN");
        }
        else if(optionalMemberByEmail.isPresent() && optionalClubAdminByUsername.isPresent()) {
            return generateAndSendToken(optionalClubAdminByUsername.get().getUsername(), email, "CLUB_ADMIN");
        }
        else return "Invalid Email or Club Master ID";
    }

    private String generateAndSendToken(String username, String email, String role){

        PasswordResetToken token = new PasswordResetToken(username, role);
        passwordRestTokenRepository.save(token);

        String resetLink = "http://localhost:7000/reset-password?token="+ token.getToken();

        emailService.sendEmail(email, username, resetLink );
        return "Password reset link sent to " + email;
    }

    public String resetPassword(NewPasswordDTO newPasswordDTO) {

        String newPassword = newPasswordDTO.getNewPassword();
        String token = newPasswordDTO.getToken();

        Optional<PasswordResetToken> optionalToken = passwordRestTokenRepository.findByToken(token);

        if(optionalToken.isPresent()) {

            PasswordResetToken resetToken = optionalToken.get();

            if (resetToken.isExpired()){
                return "Token expired";
            }

            String username = resetToken.getUsername();
            String role = resetToken.getRole();

            // Set new password into specific roles
            if(role.equals("MEMBER")) {
                Optional<Member> optionalMemberByUsername = Optional.ofNullable(memberRepository.findMemberByUserName(username));
                if(optionalMemberByUsername.isPresent()) {
                    Member member = optionalMemberByUsername.get();
                    member.setPassword(newPassword);
                    memberRepository.save(member);
                }
            }
            else if(role.equals("MAIN_ADMIN")) {
                Optional<MainAdmin> optionalMainAdminByUsername = Optional.ofNullable(mainAdminRepository.findMainAdminByMainAdminUsername(username));
                if(optionalMainAdminByUsername.isPresent()) {
                    MainAdmin mainAdmin = optionalMainAdminByUsername.get();
                    mainAdmin.setMainAdminPassword(newPassword);
                    mainAdminRepository.save(mainAdmin);
                }
            }
            else if(role.equals("CLUB_ADMIN")) {
                Optional<ClubAdmin> optionalClubAdminByUsername = Optional.ofNullable(clubAdminRepository.findClubAdminByUsername(username));
                if(optionalClubAdminByUsername.isPresent()) {
                    ClubAdmin clubAdmin = optionalClubAdminByUsername.get();
                    clubAdmin.setPassword(newPassword);
                    clubAdminRepository.save(clubAdmin);
                }
            }
            else {
                return "Invalid Role!";
            }

            // Delete token
            passwordRestTokenRepository.delete(resetToken);
            return "Password reset successful";

        }
        else return "Invalid Token!";
    }
}
