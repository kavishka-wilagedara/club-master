package com.uokclubmanagement.entity;

import com.uokclubmanagement.dto.MemberRoleDTO;
import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Data
@Document("member")
public class Member {

    @Id
    private String memberId;

    private String firstName;
    private String lastName;
    private String email;
    private String phoneNo;
    private String faculty;
    @Indexed(unique = true)
    private String userName;
    private String password;
    private List<MemberRoleDTO> positionHoldingClubAndRoles = new ArrayList<>();
    private String memberImageUrl;

    private List<String> associatedClubs = new ArrayList<>();

    public Member() {
    }

    public String getMemberId() {
        return memberId;
    }

    public void setMemberId(String memberId) {
        this.memberId = memberId;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhoneNo() {
        return phoneNo;
    }

    public void setPhoneNo(String phoneNo) {
        this.phoneNo = phoneNo;
    }

    public String getFaculty() {
        return faculty;
    }

    public void setFaculty(String faculty) {
        this.faculty = faculty;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public List<String> getAssociatedClubs() {
        return associatedClubs;
    }

    public void setAssociatedClubs(List<String> associatedClubs) {
        this.associatedClubs = associatedClubs;
    }

    public List<MemberRoleDTO>getPositionHoldingClubAndRoles() {
        return positionHoldingClubAndRoles;
    }

    public void setPositionHoldingClubAndRoles(List<MemberRoleDTO> positionHoldingClubAndRoles) {
        this.positionHoldingClubAndRoles = positionHoldingClubAndRoles.stream()
                .map(role -> new MemberRoleDTO(role.getClubId(), role.getRole())) // Using constructor on ClubRole
                .collect(Collectors.toList());
    }

    public String getMemberImageUrl() {
        return memberImageUrl;
    }

    public void setMemberImageUrl(String memberImageUrl) {
        this.memberImageUrl = memberImageUrl;
    }
}
