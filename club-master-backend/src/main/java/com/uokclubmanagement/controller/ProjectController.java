package com.uokclubmanagement.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.uokclubmanagement.entity.Award;
import com.uokclubmanagement.entity.News;
import com.uokclubmanagement.entity.Project;
import com.uokclubmanagement.service.ProjectService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/v1/project")
@CrossOrigin(origins = "http://localhost:${frontend.port}")
public class ProjectController {

    @Autowired
    private ProjectService projectService;

    @PostMapping("/{clubId}/save/{clubAdminId}")
    public Project createProject(@PathVariable("clubId") String clubId,
                                 @PathVariable("clubAdminId") String clubAdminId,
                                 @RequestPart("project") String projectJason,
                                 @RequestPart("file") MultipartFile image) throws IOException {

        ObjectMapper objectMapper = new ObjectMapper();
        objectMapper.registerModule(new JavaTimeModule());

        Project project = objectMapper.readValue(projectJason, Project.class);

        return projectService.createProject(clubAdminId, clubId, project, image);
    }

    @GetMapping("/all")
    public List<Project> getAllProjects() {
        return projectService.getAllProjects();
    }

    @GetMapping("/{clubId}/getAllProjectsByClubId")
    public List<Project> getAllProjectsByClubId(@PathVariable String clubId) {
        return projectService.getAllProjectsByClubId(clubId);
    }

    @DeleteMapping("/{projectId}/deleteProject")
    public void deleteAward(@PathVariable String projectId) {
        projectService.deleteProject(projectId);
    }

    @PutMapping("/{clubAdminId}/update/{projectId}")
    public Project updateProject(@PathVariable String clubAdminId,
                                 @PathVariable String projectId,
                                 @RequestPart("project") String projectJason,
                                 @RequestPart("file") MultipartFile newImage) throws IOException{

        ObjectMapper objectMapper = new ObjectMapper();
        objectMapper.registerModule(new JavaTimeModule());

        Project project = objectMapper.readValue(projectJason, Project.class);

        return projectService.updateProject(clubAdminId, projectId, project, newImage);
    }

    @GetMapping("/findProjectById/{projectId}")
    public Project findProjectById(@PathVariable("projectId") String projectId) {
        return projectService.getProjectById(projectId);
    }
}
