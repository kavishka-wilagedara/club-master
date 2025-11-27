package com.uokclubmanagement.service.impl;

import com.uokclubmanagement.entity.Club;
import com.uokclubmanagement.entity.ClubAdmin;
import com.uokclubmanagement.entity.Project;
import com.uokclubmanagement.repository.ClubAdminRepository;
import com.uokclubmanagement.repository.ClubRepository;
import com.uokclubmanagement.repository.ProjectRepository;
import com.uokclubmanagement.service.ProjectService;
import com.uokclubmanagement.utills.ClubAdminUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class ProjectServiceImpl implements ProjectService {

    @Autowired
    private ProjectRepository projectRepository;
    @Autowired
    private SequenceGeneratorService sequenceGeneratorService;
    @Autowired
    private ClubAdminRepository clubAdminRepository;
    @Autowired
    private ClubRepository clubRepository;
    @Autowired
    private ClubAdminUtils clubAdminUtils;
    @Autowired
    private CloudinaryService cloudinaryService;

    @Override
    public Project createProject(String clubAdminId, String clubId, Project project, MultipartFile projectImage) throws IOException {

        // Validate clubAdminId and clubId
        ClubAdmin clubAdmin = clubAdminUtils.validateClubAdminAndClub(clubAdminId, clubId);

        // Check clubAdmin exist the clubId
        if (!clubAdmin.getClubId().equals(clubId)){
            throw new RuntimeException("Club ID does not match with Club Admin ID");
        }

        else {
            // Set the projectId
            if (project.getProjectId() == null || project.getProjectId().isEmpty()) {
                long seqValue = sequenceGeneratorService.generateSequence("Project Sequence");
                String projectId = String.format("Project-%04d", seqValue);
                project.setProjectId(projectId);
            }

            // Set projectImageUrl
            String projectImageUrl = cloudinaryService.uploadImage(projectImage);
            project.setProjectImageUrl(projectImageUrl);

            LocalDate currentDate = LocalDate.now();
            LocalTime currentTime = LocalTime.now();
            LocalTime timeWithoutSeconds = currentTime.withNano(0);

            // Set ContentSchedule fields
            project.setResponseClub(clubId);
            project.setPublisherName(clubAdmin.getFullName());
            project.setPublishedDate(currentDate);
            project.setPublishedTime(timeWithoutSeconds);

            // Check project held date is before today or previous day
            if(project.getProjectHeldDate().isEqual(currentDate) || project.getProjectHeldDate().isBefore(currentDate)){
                // Set award date
                project.setProjectHeldDate(project.getProjectHeldDate());
            }
            else {
                throw new RuntimeException("Invalid project held date");
            }

            return projectRepository.save(project);
        }
    }

    @Override
    public List<Project> getAllProjects() {
        return projectRepository.findAll();
    }

    @Override
    public List<Project> getAllProjectsByClubId(String clubId) {

        Optional<Club> optionalClub = clubRepository.findById(clubId);

        if (optionalClub.isPresent()) {

            List<Project> projectListByClubId = projectRepository.getAllProjectsByResponseClub(clubId);
            return projectListByClubId;
        }
        else {
            throw new RuntimeException("Invalid club ID");
        }
    }

    @Override
    public Project updateProject(String clubAdminId, String projectId, Project project, MultipartFile newProjectImage) throws IOException {

        // Find project and clubAdmin are existing
        Optional<Project> projectById = projectRepository.findById(projectId);
        Optional<ClubAdmin> optionalClubAdmin = clubAdminRepository.findById(clubAdminId);

        if (projectById.isEmpty()){
            throw new RuntimeException("Invalid Project ID");
        }

        else if (optionalClubAdmin.isEmpty()){
            throw new RuntimeException("Invalid club admin ID");
        }

        else if(!optionalClubAdmin.get().getClubId().equals(projectById.get().getResponseClub())){
            throw new RuntimeException("Club ID does not match with Club Admin ID");
        }
        else {
            Project existingProject = projectById.get();

            LocalDate currentDate = LocalDate.now();
            LocalTime currentTime = LocalTime.now();
            LocalTime timeWithoutSeconds = currentTime.withNano(0);

            // Set Project and ContentSchedule fields
            existingProject.setProjectName(project.getProjectName());
            existingProject.setDescription(project.getDescription());
            existingProject.setPublisherName(optionalClubAdmin.get().getFullName());
            existingProject.setPublishedDate(currentDate);
            existingProject.setPublishedTime(timeWithoutSeconds);

            // Set new project image url
            if(newProjectImage != null && !newProjectImage.isEmpty()){
                cloudinaryService.deleteImage(existingProject.getProjectImageUrl());
                String newProjectImageUrl = cloudinaryService.uploadImage(newProjectImage);
                existingProject.setProjectImageUrl(newProjectImageUrl);
            }

            // Check project held date is before today or previous day
            if(project.getProjectHeldDate().isEqual(currentDate) || project.getProjectHeldDate().isBefore(currentDate)){
                // Set project held date
                existingProject.setProjectHeldDate(project.getProjectHeldDate());
            }
            else {
                throw new RuntimeException("Invalid project held date");
            }

            // Save updated fields on projects collection
            return projectRepository.save(existingProject);
        }
    }

    @Override
    public void deleteProject(String projectId) {

        Optional<Project> projectById = projectRepository.findById(projectId);

        if (projectById.isPresent()) {
            projectRepository.delete(projectById.get());
        }
        else{
            throw new RuntimeException("Project does not exist with " +projectId);
        }
    }

    @Override
    public Project getProjectById(String projectId) {

        Optional<Project> projectById = projectRepository.findById(projectId);

        if (projectById.isPresent()) {
            return projectById.get();
        }
        else {
            throw new RuntimeException("Project does not exist with " +projectId);
        }
    }
}
