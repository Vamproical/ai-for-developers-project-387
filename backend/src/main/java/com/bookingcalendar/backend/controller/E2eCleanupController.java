package com.bookingcalendar.backend.controller;

import com.bookingcalendar.backend.repository.BookingRepository;
import com.bookingcalendar.backend.repository.EventTypeRepository;
import com.bookingcalendar.backend.repository.ScheduleRepository;
import com.bookingcalendar.backend.repository.SlotRepository;
import org.springframework.context.annotation.Profile;
import org.springframework.http.HttpStatus;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@Profile("e2e")
public class E2eCleanupController {

    private final BookingRepository bookingRepository;
    private final SlotRepository slotRepository;
    private final ScheduleRepository scheduleRepository;
    private final EventTypeRepository eventTypeRepository;

    public E2eCleanupController(
            BookingRepository bookingRepository,
            SlotRepository slotRepository,
            ScheduleRepository scheduleRepository,
            EventTypeRepository eventTypeRepository) {
        this.bookingRepository = bookingRepository;
        this.slotRepository = slotRepository;
        this.scheduleRepository = scheduleRepository;
        this.eventTypeRepository = eventTypeRepository;
    }

    @PostMapping("/e2e/cleanup")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @Transactional
    public void cleanup() {
        bookingRepository.deleteAll();
        slotRepository.deleteAll();
        scheduleRepository.deleteAll();
        eventTypeRepository.deleteAll();
    }
}
