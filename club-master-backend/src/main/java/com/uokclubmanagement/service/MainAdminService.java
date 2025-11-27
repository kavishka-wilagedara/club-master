package com.uokclubmanagement.service;

import com.uokclubmanagement.entity.MainAdmin;
import com.uokclubmanagement.entity.Member;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

public interface MainAdminService {
    MainAdmin createMainAdmin(MainAdmin mainAdmin);
    List<MainAdmin> getAllMainAdmins();
    MainAdmin updateMainAdminById(String mainAdminId, MainAdmin mainAdmin, MultipartFile mainAdminImage) throws IOException;
    void deleteMainAdminById(String mainAdminId);
    MainAdmin getMainAdminById(String mainAdminId);

}
