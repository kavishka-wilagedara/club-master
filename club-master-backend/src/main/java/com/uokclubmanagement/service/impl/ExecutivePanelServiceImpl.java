package com.uokclubmanagement.service.impl;

import com.uokclubmanagement.dto.ClubRoleDTO;
import com.uokclubmanagement.dto.DeleteExecutiveDTO;
import com.uokclubmanagement.dto.MemberRoleDTO;
import com.uokclubmanagement.entity.Club;
import com.uokclubmanagement.entity.Member;
import com.uokclubmanagement.repository.ClubRepository;
import com.uokclubmanagement.repository.MemberRepository;
import com.uokclubmanagement.service.ExecutivePanelService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class ExecutivePanelServiceImpl implements ExecutivePanelService {

    @Autowired
    private ClubRepository clubRepository;
    @Autowired
    private MemberRepository memberRepository;

    @Override
    public Club createClubExecutivePanel(String clubId, ClubRoleDTO clubRoleDTO) {
        // Assigning values of ClubRoleDTO
        String memberId = clubRoleDTO.getMemberId();
        String role = clubRoleDTO.getRole();

        Optional<Member> memberOptional = memberRepository.findById(memberId);
        Optional<Club> clubOptional = clubRepository.findById(clubId);

        if (memberOptional.isPresent() && clubOptional.isPresent()) {

            Member member = memberOptional.get();
            Club club = clubOptional.get();

            if(member.getAssociatedClubs().contains(clubId)) {

                // Query for find the member already holds the position of club
                Optional<MemberRoleDTO> matchingMemberHoldsPosition = member.getPositionHoldingClubAndRoles().stream().
                        filter(clubRole -> clubRole.getClubId().equals(clubId)) // Member can hold single position of a club
                        .findFirst();

                if (matchingMemberHoldsPosition.isPresent()) {
                    throw new RuntimeException("Member already holds the position of club " + clubId);
                }

                // Query for find the position already taken
                Optional<ClubRoleDTO> matchingClubRole = club.getPositionHoldingMembersAndRoles().stream().
                        filter(clubRole -> clubRole.getRole().equals(role))
                        .findFirst();

                if (matchingClubRole.isPresent()) {
                    throw new RuntimeException(role + " already holds the club");
                }

                else{
                    // Set member full name and mail
                    String memberFullName = member.getFirstName()+" "+(member.getLastName());
                    String email = member.getEmail();
                    String imageUrl = member.getMemberImageUrl();

                    MemberRoleDTO memberInput = new MemberRoleDTO(clubId, role);
                    ClubRoleDTO clubInput = new ClubRoleDTO(memberId, memberFullName, email, role, imageUrl);

                    List<MemberRoleDTO> memberClubRoles = member.getPositionHoldingClubAndRoles();
                    List<ClubRoleDTO> clubRoles = club.getPositionHoldingMembersAndRoles();

                    // Fill member and club attributes
                    memberClubRoles.add(memberInput);
                    clubRoles.add(clubInput);

                    // update member and club fields
                    memberRepository.save(member);
                    clubRepository.save(club);

                    return club;
                }
            }

            else throw new RuntimeException("Member not associated with the club " + clubId);
        }
        else throw new RuntimeException("Invalid member id or club id");
    }

    @Override
    public void deleteClubExecutivePanel(String clubId, DeleteExecutiveDTO deleteExecutiveDTO) {

        String memberId = deleteExecutiveDTO.getMemberId();

        Optional<Club> clubOptional = clubRepository.findById(clubId);
        Optional<Member> memberOptional = memberRepository.findById(memberId);

        if (clubOptional.isPresent() && memberOptional.isPresent()) {

            if (memberOptional.get().getAssociatedClubs().contains(clubId)) {

                Club club = clubOptional.get();
                Member member = memberOptional.get();

                List<ClubRoleDTO> findMemberExistedRoles = club.getPositionHoldingMembersAndRoles();

                // Query for find object that contain memberId
                Optional<ClubRoleDTO> memberExistedObject = findMemberExistedRoles.stream()
                        .filter(clubRole -> clubRole.getMemberId().equals(memberId))
                        .findFirst();

                List<MemberRoleDTO> findClubExistedRoles = member.getPositionHoldingClubAndRoles();

                // Query for find object that contain clubId
                Optional<MemberRoleDTO> clubExistedObject = findClubExistedRoles.stream()
                        .filter(memberRole -> memberRole.getClubId().equals(clubId))
                        .findFirst();

                if (memberExistedObject.isPresent() && clubExistedObject.isPresent()) {

                    club.getPositionHoldingMembersAndRoles().remove(memberExistedObject.get()); // Remove memberId containing object
                    member.getPositionHoldingClubAndRoles().remove(clubExistedObject.get()); // Remove clubId containing object

                    // Update member and club fields
                    memberRepository.save(member);
                    clubRepository.save(club);
                }
                else throw new RuntimeException("Member not contain position of the club " + clubId);
            }
            else throw new RuntimeException("Member not associated with the club " + clubId);
        }
        else throw new RuntimeException("Invalid member id or club id");
    }

    @Override
    public List<ClubRoleDTO> getClubRoles(String clubId) {

        Optional<Club> clubOptional = clubRepository.findById(clubId);

        if (clubOptional.isPresent()) {

            List<ClubRoleDTO> allClubRoles = clubOptional.get().getPositionHoldingMembersAndRoles();
            return allClubRoles;
        }
        else throw new RuntimeException("Invalid club id: "+clubId);
    }
}
