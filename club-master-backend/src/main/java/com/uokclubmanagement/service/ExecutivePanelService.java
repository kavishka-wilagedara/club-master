package com.uokclubmanagement.service;

import com.uokclubmanagement.dto.ClubRoleDTO;
import com.uokclubmanagement.dto.DeleteExecutiveDTO;
import com.uokclubmanagement.entity.Club;

import java.util.List;

public interface ExecutivePanelService {

    Club createClubExecutivePanel(String clubId, ClubRoleDTO clubRoleDTO);
    void deleteClubExecutivePanel(String clubId, DeleteExecutiveDTO deleteExecutiveDTO);
    List<ClubRoleDTO> getClubRoles(String clubId);
}
