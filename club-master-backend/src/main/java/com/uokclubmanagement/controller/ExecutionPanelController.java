package com.uokclubmanagement.controller;

import com.uokclubmanagement.dto.ClubRoleDTO;
import com.uokclubmanagement.dto.DeleteExecutiveDTO;
import com.uokclubmanagement.entity.Club;
import com.uokclubmanagement.entity.Event;
import com.uokclubmanagement.service.EventService;
import com.uokclubmanagement.service.ExecutivePanelService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/v1/execution-panel")
@CrossOrigin(origins = "http://localhost:${frontend.port}")
public class ExecutionPanelController {

    @Autowired
    private ExecutivePanelService executivePanelService;

    @PostMapping("/{clubId}/save")
    public Club createExecutionPanel(@PathVariable String clubId, @RequestBody ClubRoleDTO clubRoleDTO) {
        return executivePanelService.createClubExecutivePanel(clubId, clubRoleDTO);
    }

    @DeleteMapping("/delete/{clubId}")
    public void deleteExecutionPanel(@PathVariable String clubId, @RequestBody DeleteExecutiveDTO deleteExecutiveDTO) {
        executivePanelService.deleteClubExecutivePanel(clubId, deleteExecutiveDTO);
    }

    @GetMapping("/{clubId}")
    public List<ClubRoleDTO> getExecutionPanel(@PathVariable String clubId) {
        return executivePanelService.getClubRoles(clubId);
    }
}
