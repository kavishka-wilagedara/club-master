package com.uokclubmanagement.utills;

import com.uokclubmanagement.entity.ContentSchedule;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.LocalTime;

@Component
public class ContentScheduleUtils {

    public static void contentScheduleUpdating(ContentSchedule existingEvent, ContentSchedule contentSchedule) {

        LocalDate currentDate = LocalDate.now();
        LocalTime currentTime = LocalTime.now();
        LocalTime timeWithoutSeconds = currentTime.withNano(0);

        existingEvent.setPublishedDate(currentDate);
        existingEvent.setPublishedTime(timeWithoutSeconds);

        if (existingEvent.getDescription() != null) {
            existingEvent.setDescription(contentSchedule.getDescription());
        }
    }
}
