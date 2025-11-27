package com.uokclubmanagement.entity;

import com.uokclubmanagement.dto.ClubRoleDTO;
import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.ArrayList;
import java.util.List;

import static java.util.stream.Collectors.toList;

@Data
@Document("clubs")
public class Club {

    @Id
    private String clubId;
    @Indexed(unique = true)
    private String clubName;
    private String clubAddress;
    @Indexed(unique = true)
    private String clubSeniorAdviser;
    @Indexed(unique = true)
    private String clubProducer;
    private String clubVision;
    private String clubEmail;
    private String clubPhone;
    private String clubDescription;
    private String clubLogoUrl;
    private List<String> backgroundImageUrls = new ArrayList<>();

    private List<String> associatedMembers = new ArrayList<>();
    private List<ClubRoleDTO> positionHoldingMembersAndRoles = new ArrayList<>();


    public Club() {
    }

    public String getClubId() {
        return clubId;
    }

    public void setClubId(String clubId) {
        this.clubId = clubId;
    }

    public String getClubName() {
        return clubName;
    }

    public void setClubName(String clubName) {
        this.clubName = clubName;
    }

    public String getClubAddress() {
        return clubAddress;
    }

    public void setClubAddress(String clubAddress) {
        this.clubAddress = clubAddress;
    }

    public String getClubSeniorAdviser() {
        return clubSeniorAdviser;
    }

    public void setClubSeniorAdviser(String clubSeniorAdviser) {
        this.clubSeniorAdviser = clubSeniorAdviser;
    }

    public String getClubProducer() {
        return clubProducer;
    }

    public void setClubProducer(String clubProducer) {
        this.clubProducer = clubProducer;
    }

    public String getClubVision() {
        return clubVision;
    }

    public void setClubVision(String clubVision) {
        this.clubVision = clubVision;
    }

    public List<String> getAssociatedMembers() {
        return associatedMembers;
    }

    public void setAssociatedMembers(List<String> associatedMembers) {
        this.associatedMembers = associatedMembers;
    }

    public List<ClubRoleDTO> getPositionHoldingMembersAndRoles() {
        return positionHoldingMembersAndRoles;
    }

    public void setPositionHoldingMembersAndRoles(List<ClubRoleDTO> clubRole) {
        this.positionHoldingMembersAndRoles = positionHoldingMembersAndRoles.stream()
                .map(role -> new ClubRoleDTO(role.getMemberId(), role.getMemberName(), role.getEmail(), role.getRole(), role.getImageUrl())) // Using constructor on CreateExecutivePanelDTO
                .collect(toList());
    }

    public String getClubEmail() {
        return clubEmail;
    }

    public void setClubEmail(String clubEmail) {
        this.clubEmail = clubEmail;
    }

    public String getClubPhone() {
        return clubPhone;
    }

    public void setClubPhone(String clubPhone) {
        this.clubPhone = clubPhone;
    }

    public String getClubDescription() {
        return clubDescription;
    }

    public void setClubDescription(String clubDescription) {
        this.clubDescription = clubDescription;
    }

    public String getClubLogoUrl() {
        return clubLogoUrl;
    }

    public void setClubLogoUrl(String clubLogoUrl) {
        this.clubLogoUrl = clubLogoUrl;
    }

    public List<String> getBackgroundImageUrls() {
        return backgroundImageUrls;
    }

    public void setBackgroundImageUrls(List<String> backgroundImageUrls) {
        this.backgroundImageUrls = backgroundImageUrls;
    }
}
