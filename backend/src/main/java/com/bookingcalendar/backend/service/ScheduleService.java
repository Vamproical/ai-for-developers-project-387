package com.bookingcalendar.backend.service;

import com.bookingcalendar.backend.entity.EventTypeEntity;
import com.bookingcalendar.backend.entity.ScheduleEntity;
import com.bookingcalendar.backend.entity.SlotEntity;
import com.bookingcalendar.backend.mapper.ScheduleMapper;
import com.bookingcalendar.backend.repository.EventTypeRepository;
import com.bookingcalendar.backend.repository.ScheduleRepository;
import com.bookingcalendar.backend.repository.SlotRepository;
import com.bookingcalendar.dto.CreateScheduleRequest;
import com.bookingcalendar.dto.ScheduleList;
import com.bookingcalendar.dto.SlotStatus;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.time.LocalTime;
import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
@Transactional(readOnly = true)
public class ScheduleService {

    private static final int DAYS_IN_WEEK = 7;

    private final ScheduleRepository scheduleRepository;
    private final ScheduleMapper scheduleMapper;
    private final EventTypeRepository eventTypeRepository;
    private final SlotRepository slotRepository;

    public ScheduleService(
            ScheduleRepository scheduleRepository,
            ScheduleMapper scheduleMapper,
            EventTypeRepository eventTypeRepository,
            SlotRepository slotRepository) {
        this.scheduleRepository = scheduleRepository;
        this.scheduleMapper = scheduleMapper;
        this.eventTypeRepository = eventTypeRepository;
        this.slotRepository = slotRepository;
    }

    public ScheduleList list() {
        return scheduleMapper.toScheduleList(scheduleRepository.findAll());
    }

    @Transactional
    public com.bookingcalendar.dto.Schedule create(CreateScheduleRequest request) {
        validate(request);
        ScheduleEntity entity = scheduleMapper.toEntity(request);
        ScheduleEntity saved = scheduleRepository.save(entity);
        generateSlots(request);
        return scheduleMapper.toDto(saved);
    }

    private void validate(CreateScheduleRequest request) {
        if (request.getDaysOfWeek() == null || request.getDaysOfWeek().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "daysOfWeek must not be empty");
        }
        for (Integer day : request.getDaysOfWeek()) {
            if (day < 0 || day > 6) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "daysOfWeek must be between 0 and 6");
            }
        }
        if (!request.getStartDate().isBefore(request.getEndDate())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "startDate must be before endDate");
        }
        if (!LocalTime.parse(request.getStartTime()).isBefore(LocalTime.parse(request.getEndTime()))) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "startTime must be before endTime");
        }
        if (request.getSlotDurationMinutes() != null && request.getSlotDurationMinutes() <= 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "slotDurationMinutes must be greater than 0");
        }
    }

    private boolean matchesDaysOfWeek(CreateScheduleRequest request, LocalDate date) {
        int dayOfWeek = date.getDayOfWeek().getValue() % DAYS_IN_WEEK;
        return request.getDaysOfWeek().contains(dayOfWeek);
    }

    private void generateSlots(CreateScheduleRequest request) {
        LocalTime startTime = LocalTime.parse(request.getStartTime());
        LocalTime endTime = LocalTime.parse(request.getEndTime());
        List<SlotEntity> slots = new ArrayList<>();

        for (LocalDate date = request.getStartDate().toLocalDate();
             !date.isAfter(request.getEndDate().toLocalDate());
             date = date.plusDays(1)) {
            if (!matchesDaysOfWeek(request, date)) {
                continue;
            }

            for (EventTypeEntity eventType : eventTypeRepository.findAll()) {
                int durationMinutes = request.getSlotDurationMinutes() != null
                        ? request.getSlotDurationMinutes()
                        : eventType.getDurationMinutes();
                OffsetDateTime cursor = OffsetDateTime.of(date, startTime, request.getStartDate().getOffset());
                OffsetDateTime dayEnd = OffsetDateTime.of(date, endTime, request.getStartDate().getOffset());

                while (!cursor.plusMinutes(durationMinutes).isAfter(dayEnd)) {
                    OffsetDateTime slotEnd = cursor.plusMinutes(durationMinutes);
                    if (!slotRepository.existsByEventTypeIdAndStartDateTimeAndEndDateTime(
                            eventType.getId(), cursor, slotEnd)) {
                        slots.add(new SlotEntity(
                                eventType.getId(), cursor, slotEnd, SlotStatus.AVAILABLE));
                    }
                    cursor = slotEnd;
                }
            }
        }

        slotRepository.saveAll(slots);
    }
}
