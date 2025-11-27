package com.uokclubmanagement.service;

import com.uokclubmanagement.entity.UserHelp;
import com.uokclubmanagement.entity.UserHelpResponse;

import java.util.List;

public interface UserHelpService {

    UserHelp createUserHelpMessages(UserHelp userHelp);
    List<UserHelp> getAllUserHelpMessages();
    void deleteUserHelpMessagesById(String userHelpId);
    UserHelpResponse getAllUserHelpMessagesByFaculty(String faculty);
}
