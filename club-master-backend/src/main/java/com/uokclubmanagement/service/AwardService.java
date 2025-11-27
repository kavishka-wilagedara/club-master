package com.uokclubmanagement.service;

import com.uokclubmanagement.entity.Award;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

public interface AwardService {

    Award createAward(String clubAdminId , String clubId,  Award award, MultipartFile multipartFile) throws IOException;
    List<Award> getAllAwards();
    List<Award> getAllAwardsByClubId(String clubId);
    Award updateAward(String clubAdminId , String awardId, Award award, MultipartFile multipartFile) throws IOException;
    void deleteAward(String awardId);
    Award getAwardById(String awardId);

}
