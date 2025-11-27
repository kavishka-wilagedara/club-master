package com.uokclubmanagement.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service

public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    public void sendEmail(String to, String username, String resetLink) {

        String subject = "Password Rest Link For "+username+",";

        String body = "Hello " + username + ",\n\n" +
                "Click the following link to reset your password: " + resetLink + "\n\n" +
                "Important: This link valid for 5 minutes!" + "\n\n" +
                "Best regards,\nIT Team,\nClub Master";

        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject(subject);
        message.setText(body);
        mailSender.send(message);
    }
}


