package com.uokclubmanagement.controller;

import com.uokclubmanagement.entity.UserHelp;
import com.uokclubmanagement.entity.UserHelpResponse;
import com.uokclubmanagement.service.UserHelpService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/help")
@CrossOrigin(origins = "http://localhost:5176")
public class UserHelpController {

    @Autowired
    private UserHelpService userHelpService;

    @PostMapping("/save")
    public UserHelp saveHelpMessages(@RequestBody UserHelp userHelp) {
        return userHelpService.createUserHelpMessages(userHelp);
    }

    @GetMapping("/all")
    public List<UserHelp> getAllHelpMessages() {
        return userHelpService.getAllUserHelpMessages();
    }

    @DeleteMapping("/{userHelpId}/delete")
    public void deleteHelpMessages(@PathVariable String userHelpId) {
        userHelpService.deleteUserHelpMessagesById(userHelpId);
    }

    @GetMapping("/{faculty}/getByFaculty")
    public UserHelpResponse getHelpMessagesByFaculty(@PathVariable String faculty) {
        return userHelpService.getAllUserHelpMessagesByFaculty(faculty);
    }
}
