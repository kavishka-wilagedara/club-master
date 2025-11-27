package com.uokclubmanagement.dto;

public class MemberRoleDTO {

    private String clubId;
    private String role;

    public MemberRoleDTO(String clubId, String role) {
        this.clubId = clubId;
        this.role = role;
    }

    public String getClubId() {
        return clubId;
    }

    public void setClubId(String clubId) {
        this.clubId = clubId;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }
}
