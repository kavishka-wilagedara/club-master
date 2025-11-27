package com.uokclubmanagement.service;

import com.uokclubmanagement.entity.Award;
import com.uokclubmanagement.entity.Project;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOError;
import java.io.IOException;
import java.util.List;

public interface ProjectService {

    Project createProject(String clubAdminId , String clubId, Project project, MultipartFile projectImage) throws IOException;
    List<Project> getAllProjects();
    List<Project> getAllProjectsByClubId(String clubId);
    Project updateProject(String clubAdminId , String projectId, Project project, MultipartFile newProjectImage) throws IOException;
    void deleteProject(String projectId);
    Project getProjectById(String projectId);
}
