package com.uokclubmanagement.service.impl;

import com.uokclubmanagement.entity.UserHelp;
import com.uokclubmanagement.entity.UserHelpResponse;
import com.uokclubmanagement.repository.UserHelpRepository;
import com.uokclubmanagement.service.UserHelpService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class UserHelpServiceImpl implements UserHelpService {

    @Autowired
    private UserHelpRepository userHelpRepository;
    @Autowired
    private SequenceGeneratorService sequenceGeneratorService;

    @Override
    public UserHelp createUserHelpMessages(UserHelp userHelp) {

        if (userHelp.getHelpId() == null || userHelp.getHelpId().isEmpty()) {
            long seqValue = sequenceGeneratorService.generateSequence("User-help Sequence");
            String helpId = String.format("Help-%04d", seqValue);
            userHelp.setHelpId(helpId);
        }
        return userHelpRepository.save(userHelp);
    }

    @Override
    public List<UserHelp> getAllUserHelpMessages() {
        return userHelpRepository.findAll();
    }

    @Override
    public void deleteUserHelpMessagesById(String userHelpId) {

        Optional<UserHelp> optionalUserHelp = userHelpRepository.findById(userHelpId);
        if (optionalUserHelp.isPresent()) {
            UserHelp userHelp = optionalUserHelp.get();
            userHelpRepository.delete(userHelp);
        }
        else {
            throw new RuntimeException("Invalid user help id: " + userHelpId);
        }
    }

    @Override
    public UserHelpResponse getAllUserHelpMessagesByFaculty(String faculty) {

        // For case-insensitive
        faculty = faculty.toLowerCase();

        String[] facultyArray = {"science", "art", "management", "fct", "medical"};
        List<UserHelp> userHelpList = new ArrayList<>();

        if(!Arrays.stream(facultyArray).toList().contains(faculty)){
            throw new RuntimeException("Invalid faculty name: " +faculty);
        }

        else {
            for (int j = 0; j < getAllUserHelpMessages().size(); j++) {
                if (getAllUserHelpMessages().get(j).getFaculty().equalsIgnoreCase(faculty)) {
                    userHelpList.add(getAllUserHelpMessages().get(j));
                }
            }

            int helpMessagesCount =userHelpList.size();

            return new UserHelpResponse(helpMessagesCount, userHelpList);
        }
    }

}


