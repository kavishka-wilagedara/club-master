package com.uokclubmanagement.dto;

import lombok.Data;

@Data
public class ClubRoleDTO {

    private String memberId;
    private String memberName;
    private String role;
    private String email;
    private String imageUrl;

    public ClubRoleDTO(String memberId, String memberName, String email, String role, String imageUrl) {
        this.memberId = memberId;
        this.memberName = memberName;
        this.email = email;
        this.role = role;
        this.imageUrl = imageUrl;
    }

    public String getMemberId() {
        return memberId;
    }

    public void setMemberId(String memberId) {
        this.memberId = memberId;
    }

    public String getMemberName() {
        return memberName;
    }

    public void setMemberName(String memberName) {
        this.memberName = memberName;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }
}
