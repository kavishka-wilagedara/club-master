package com.uokclubmanagement.repository;

import com.uokclubmanagement.entity.Event;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.time.LocalDate;
import java.util.Date;
import java.util.List;

public interface EventRepository extends MongoRepository<Event, String> {

    List<Event> getAllEventsByResponseClub(String clubId);
}
