package com.uokclubmanagement.utills;

import com.uokclubmanagement.entity.Club;
import com.uokclubmanagement.entity.Event;
import com.uokclubmanagement.entity.Member;
import com.uokclubmanagement.repository.ClubRepository;
import com.uokclubmanagement.repository.EventRepository;
import com.uokclubmanagement.repository.MemberRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
public class LikeCommentUtils {

    @Autowired
    private ClubRepository clubRepository;
    @Autowired
    private MemberRepository memberRepository;
    @Autowired
    private EventRepository eventRepository;

    public Event validateClubIdWithEventAndMembers(String eventId, String clubId, String memberId) {

        // Query the database to check if member, event, club exist by id
        Optional<Event> optionalEvent = eventRepository.findById(eventId);
        Optional<Club> clubOptional = clubRepository.findById(clubId);
        Optional<Member> memberOptional = memberRepository.findById(memberId);

        if(optionalEvent.isEmpty()) {
            throw new RuntimeException("Invalid Event ID");
        }
        else if(clubOptional.isEmpty()){
            throw new RuntimeException("Invalid Club ID");
        }
        else if(memberOptional.isEmpty()){
            throw new RuntimeException("Invalid Member ID");
        }

        // Club id check with member associated clubs and event response club
        else if(!optionalEvent.get().getResponseClub().equals(clubId) || !memberOptional.get().getAssociatedClubs().contains(clubId)){
            throw new RuntimeException("Club ID error");
        }

        return optionalEvent.get();
    }
}
