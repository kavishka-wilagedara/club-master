package com.uokclubmanagement.controller;

import com.uokclubmanagement.dto.ForgottenPasswordDTO;
import com.uokclubmanagement.dto.NewPasswordDTO;
import com.uokclubmanagement.service.impl.PasswordResetService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/password")
public class PasswordResetController {

    @Autowired
    private PasswordResetService passwordResetService;

    @PostMapping("/forget")
    public ResponseEntity<String> forgetPassword(@RequestBody ForgottenPasswordDTO forgottenPasswordDTO) {
        String response = passwordResetService.passwordResetLink(forgottenPasswordDTO);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/reset")
    public ResponseEntity<String> resetPassword(@RequestBody NewPasswordDTO newPasswordDTO) {
        String response = passwordResetService.resetPassword(newPasswordDTO);
        return ResponseEntity.ok(response);
    }
}
