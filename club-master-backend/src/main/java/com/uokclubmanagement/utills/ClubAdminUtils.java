package com.uokclubmanagement.utills;

import com.uokclubmanagement.entity.Club;
import com.uokclubmanagement.entity.ClubAdmin;
import com.uokclubmanagement.repository.ClubAdminRepository;
import com.uokclubmanagement.repository.ClubRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import java.util.Optional;

@Component
public class ClubAdminUtils {

    @Autowired
    private ClubAdminRepository clubAdminRepository;
    @Autowired
    private ClubRepository clubRepository;

    public ClubAdmin validateClubAdminAndClub(String clubAdminId, String clubId) {

        // Find club and clubAdmin are exist
        Optional<ClubAdmin> clubAdminOptional = clubAdminRepository.findById(clubAdminId);
        Optional<Club> clubOptional = clubRepository.findById(clubId);

        if(clubAdminOptional.isEmpty()){
            throw new RuntimeException("Invalid Club Admin");
        }

        else if(clubOptional.isEmpty()){
            throw new RuntimeException("Invalid Club ID");
        }

        // Get clubAdmin
        else {
            ClubAdmin clubAdmin = clubAdminOptional.get();
            return clubAdmin;
        }
    }
}
