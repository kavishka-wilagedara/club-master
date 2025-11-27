package com.uokclubmanagement.service.impl;

import com.uokclubmanagement.entity.*;
import com.uokclubmanagement.repository.ClubAdminRepository;
import com.uokclubmanagement.repository.ClubRepository;
import com.uokclubmanagement.repository.EventRepository;
import com.uokclubmanagement.repository.MemberRepository;
import com.uokclubmanagement.service.EventService;
import com.uokclubmanagement.utills.ClubAdminUtils;
import com.uokclubmanagement.utills.ContentScheduleUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
public class EventServiceImpl implements EventService {

    @Autowired
    private EventRepository eventRepository;
    @Autowired
    private ClubRepository clubRepository;
    @Autowired
    private MemberRepository memberRepository;
    @Autowired
    private ClubAdminRepository clubAdminRepository;
    @Autowired
    private SequenceGeneratorService sequenceGeneratorService;
    @Autowired
    private ClubAdminUtils clubAdminUtils;
    @Autowired
    private ContentScheduleUtils contentScheduleUtils;
    @Autowired
    private CloudinaryService cloudinaryService;


    @Override
    public Event createEvent(Event event, String clubId, String clubAdminId, MultipartFile eventImage) throws IOException {

        // Validate clubAdminId and clubId
        ClubAdmin clubAdmin = clubAdminUtils.validateClubAdminAndClub(clubAdminId, clubId);

        // Check clubAdmin exist the clubId
        if (!clubAdmin.getClubId().equals(clubId)){
            throw new RuntimeException("Club ID does not match with Club Admin ID");
        }

        else {

            // Set the eventId
            if (event.getEventId() == null || event.getEventId().isEmpty()) {
                long seqValue = sequenceGeneratorService.generateSequence("Events Sequence");
                String eventId = String.format("Event-%04d", seqValue);
                event.setEventId(eventId);
            }

            // Set eventImage url
            String eventImageUrl = cloudinaryService.uploadImage(eventImage);
            event.setEventImageUrl(eventImageUrl);

            // Validate date and time
            validateDateAndTime(event);

            // Set the organizing club and publisher name
            event.setResponseClub(clubId);
            event.setPublisherName(clubAdmin.getFullName());
            return eventRepository.save(event);
        }

    }

    @Override
    public List<Event> getAllEvents() {
        return eventRepository.findAll();
    }

    @Override
    public Event updateEventById(String clubAdminId, String eventId, Event event, MultipartFile newEventImage) throws IOException {

        // Find event and clubAdmin are existing
        Optional<Event> findEvent = eventRepository.findById(eventId);
        Optional<ClubAdmin> findClubAdmin = clubAdminRepository.findById(clubAdminId);

        if(findEvent.isEmpty()) {
            throw new RuntimeException("Invalid Event ID");
        }

        else if(findClubAdmin.isEmpty()) {
            throw new RuntimeException("Invalid Club Admin ID");
        }

        else if (!findClubAdmin.get().getClubId().equals(findEvent.get().getResponseClub())){
            throw new RuntimeException("Club Admin ID does not match with response club ID");
        }

        else {
            Event exisitingEvent = findEvent.get();
            updateEventFields(exisitingEvent, event);
            contentScheduleUtils.contentScheduleUpdating(exisitingEvent, event);

            // Set publisher name
            exisitingEvent.setPublisherName(findClubAdmin.get().getFullName());

            // Set new event image url
            if(newEventImage != null && !newEventImage.isEmpty()){
                cloudinaryService.deleteImage(exisitingEvent.getEventImageUrl());
                String newEventImageUrl = cloudinaryService.uploadImage(newEventImage);
                exisitingEvent.setEventImageUrl(newEventImageUrl);
            }

            // Save updated fields on events collection
            return eventRepository.save(exisitingEvent);
        }
    }

    @Override
    public void deleteEventById(String eventId) {
        Optional<Event> deleteEvent = eventRepository.findById(eventId);
        if (deleteEvent.isPresent()) {
            eventRepository.delete(deleteEvent.get());
            System.out.println("Deleted event: " + eventId);
        }
        else{
            throw new RuntimeException("Invalid Event ID: "+eventId);
        }
    }

    @Override
    public List<Event> getAllEventsByClubId(String clubId) {

        Optional<Club> findClub = clubRepository.findById(clubId);
        if (findClub.isPresent()) {
            return eventRepository.getAllEventsByResponseClub(clubId);
        }
        else {
            throw new RuntimeException("Invalid Club ID: "+clubId);
        }
    }

    @Override
    public List<Event> getAllOngoingEventsByClubId(String clubId) {

        LocalDate currentDate = LocalDate.now();

        // List events by clubId
        List<Event> events = eventRepository.getAllEventsByResponseClub(clubId);

        List<Event> ongoingEvents =  events.stream()
                .filter(event -> event.getScheduledDate().isEqual(currentDate))
                .collect(Collectors.toList());

        // Check event availability
        if (ongoingEvents.isEmpty()) {
            throw new RuntimeException("No ongoing events found");
        }
        return ongoingEvents;
    }

    @Override
    public List<Event> getAllUpcomingEventsByClubId(String clubId) {

        LocalDate currentDate = LocalDate.now();

        // List events by clubId
        List<Event> events = eventRepository.getAllEventsByResponseClub(clubId);

        List<Event> upcomingEvents =  events.stream()
                .filter(event -> event.getScheduledDate().isAfter(currentDate))
                .collect(Collectors.toList());

        // Check event availability
        if (upcomingEvents.isEmpty()) {
            throw new RuntimeException("No upcoming events found");
        }
        return upcomingEvents;
    }

    @Override
    public List<Event> getAllPastEventsByClubId(String clubId) {

        LocalDate currentDate = LocalDate.now();

        // List events by clubId
        List<Event> events = eventRepository.getAllEventsByResponseClub(clubId);

        List<Event> pastEvents =  events.stream()
                .filter(event -> event.getScheduledDate().isBefore(currentDate))
                .collect(Collectors.toList());

        // Check event availability
        if (pastEvents.isEmpty()) {
            throw new RuntimeException("No past events found");
        }
        return pastEvents;
    }

    @Override
    public Event getEventById(String eventId) {

        Optional<Event> optionalEvent = eventRepository.findById(eventId);

        if (optionalEvent.isEmpty()){
            throw new RuntimeException("Event not found with: "+eventId);
        }

        return optionalEvent.get();
    }

    @Override
    public List<Event> getAllOngoingEvents() {

        LocalDate currentDate = LocalDate.now();

        // List all events
        List<Event> events = eventRepository.findAll();

        List<Event> allOngoingEvents =  events.stream()
                .filter(event -> event.getScheduledDate().isEqual(currentDate))
                .collect(Collectors.toList());

        // Check event availability
        if (allOngoingEvents.isEmpty()) {
            throw new RuntimeException("No ongoing events found");
        }
        return allOngoingEvents;
    }

    @Override
    public List<Event> getAllUpcomingEvents() {

        LocalDate currentDate = LocalDate.now();

        // List all events
        List<Event> events = eventRepository.findAll();

        List<Event> allUpComingEvents =  events.stream()
                .filter(event -> event.getScheduledDate().isAfter(currentDate))
                .collect(Collectors.toList());

        // Check event availability
        if (allUpComingEvents.isEmpty()) {
            throw new RuntimeException("No upcoming events found");
        }
        return allUpComingEvents;
    }

    @Override
    public List<Event> getAllPastEvents() {

        LocalDate currentDate = LocalDate.now();

        // List all events
        List<Event> events = eventRepository.findAll();

        List<Event> allPastEvents =  events.stream()
                .filter(event -> event.getScheduledDate().isBefore(currentDate))
                .collect(Collectors.toList());

        // Check event availability
        if (allPastEvents.isEmpty()) {
            throw new RuntimeException("No past events found");
        }
        return allPastEvents;
    }

    @Override
    public List<Event> getAllOngoingEventsByMemberId(String memberId) {
        Optional<Member> findMember = memberRepository.findById(memberId);

        if(findMember.isPresent()){
            Member member = findMember.get();

            List<String> assigningClubs = member.getAssociatedClubs();
            List<Event> allOngoingEvents = new ArrayList<>();

            for (int i = 0; i < assigningClubs.size(); i++) {

                String clubId = assigningClubs.get(i);
                List<Event> addEvents = getAllOngoingEventsByClubId(clubId);
                allOngoingEvents.addAll(addEvents);

            }
            return allOngoingEvents;
        }
        else {
            throw new RuntimeException("Invalid Member ID");
        }

    }

    @Override
    public List<Event> getAllUpcomingEventsByMemberId(String memberId) {
        Optional<Member> findMember = memberRepository.findById(memberId);

        if(findMember.isPresent()){
            Member member = findMember.get();

            List<String> assigningClubs = member.getAssociatedClubs();
            List<Event> allUpcomingEvents = new ArrayList<>();

            for (int i = 0; i < assigningClubs.size(); i++) {

                String clubId = assigningClubs.get(i);
                List<Event> addEvents = getAllUpcomingEventsByClubId(clubId);
                allUpcomingEvents.addAll(addEvents);

            }
            return allUpcomingEvents;
        }
        else {
            throw new RuntimeException("Invalid Member ID");
        }
    }

    @Override
    public List<Event> getAllPastEventsByMemberId(String memberId) {
        Optional<Member> findMember = memberRepository.findById(memberId);

        if(findMember.isPresent()){
            Member member = findMember.get();

            List<String> assigningClubs = member.getAssociatedClubs();
            List<Event> allPastEvents = new ArrayList<>();

            for (int i = 0; i < assigningClubs.size(); i++) {

                String clubId = assigningClubs.get(i);
                List<Event> addEvents = getAllPastEventsByClubId(clubId);
                allPastEvents.addAll(addEvents);

            }
            return allPastEvents;
        }
        else {
            throw new RuntimeException("Invalid Member ID");
        }
    }

    private void validateDateAndTime(Event validateDate) {
        // Check the date is valid
        LocalDate currentDate = LocalDate.now();

        // Event should display to member before at least three days //
        LocalDate twoDaysBeforeEventDate = validateDate.getScheduledDate().minusDays(1);
        if(!currentDate.isBefore(twoDaysBeforeEventDate)){
            throw new RuntimeException("The event date is not at least two days before the current date");
        }

        // Set publish date and time without seconds
        LocalTime currentTime = LocalTime.now();
        LocalTime timeWithoutSeconds = currentTime.withNano(0);

        validateDate.setPublishedDate(currentDate);
        validateDate.setPublishedTime(timeWithoutSeconds);
    }

    private void updateEventFields(Event exisitingEvent, Event event){

        if(exisitingEvent.getEventName() != null){
            exisitingEvent.setEventName(event.getEventName());
        }
        if(exisitingEvent.getEventType() != null){
            exisitingEvent.setEventType(event.getEventType());
        }
        if(exisitingEvent.getEventLocation() != null){
            exisitingEvent.setEventLocation(event.getEventLocation());
        }
        if (exisitingEvent.getScheduledDate() != null) {
            validateDateAndTime(event);
            exisitingEvent.setScheduledDate(event.getScheduledDate());
        }
//        if (exisitingEvent.getEventImage() != null){
//            exisitingEvent.setEventImage(event.getEventImage());
//        }
        if (exisitingEvent.getDescription() != null){
            exisitingEvent.setDescription(event.getDescription());
        }
    }
}

