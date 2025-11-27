package com.uokclubmanagement.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.uokclubmanagement.entity.MainAdmin;
import com.uokclubmanagement.service.MainAdminService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/v1/mainAdmin")
@CrossOrigin(origins = "http://localhost:${frontend.port}")
public class MainAdminController {

    @Autowired
    private MainAdminService mainAdminService;

    @PostMapping("/save")
    public MainAdmin createMainAdmin(@RequestBody MainAdmin mainAdmin) {
        return mainAdminService.createMainAdmin(mainAdmin);
    }

    @GetMapping("/all")
    public List<MainAdmin> getAllMainAdmin() {
        return mainAdminService.getAllMainAdmins();
    }

    @PutMapping("/update/{mainAdminId}")
    public ResponseEntity<?> updateMainAdmin(@PathVariable("mainAdminId") String mainAdminId,
                                             @RequestPart("mainAdmin") String mainAdminJason,
                                             @RequestPart("file") MultipartFile mainAdminImage) throws IOException {

        ObjectMapper objectMapper = new ObjectMapper();
        objectMapper.registerModule(new JavaTimeModule());

        MainAdmin mainAdmin = objectMapper.readValue(mainAdminJason, MainAdmin.class);

        try {
            mainAdminService.updateMainAdminById(mainAdminId, mainAdmin, mainAdminImage);
            return ResponseEntity.ok().build();
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    @DeleteMapping("/delete/{mainAdminId}")
    public void deleteMainAdmin(@PathVariable("mainAdminId") String mainAdminId) {
        mainAdminService.deleteMainAdminById(mainAdminId);
    }

    @PostMapping("/login")
    public ResponseEntity<String> loginMainAdmin(@RequestBody MainAdmin loginMainAdmin) {
        MainAdmin mainAdmin = mainAdminService.getMainAdminById(loginMainAdmin.getMainAdminId());
        if(mainAdmin.getMainAdminPassword().equals(loginMainAdmin.getMainAdminPassword())) {
            return ResponseEntity.ok("Login successful");
        }
        else
            throw new RuntimeException("Login failed");
    }

    @GetMapping("/find-mainAdmin/{id}")
    public ResponseEntity<MainAdmin> findMember(@PathVariable("id") String mainAdminId) {
        MainAdmin mainAdmin = mainAdminService.getMainAdminById(mainAdminId);
        return ResponseEntity.ok(mainAdmin);
    }
}
