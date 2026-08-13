package com.bookingcalendar.backend.controller;

import com.bookingcalendar.backend.service.ScheduleService;
import com.bookingcalendar.controller.AdminSchedulesApi;
import com.bookingcalendar.dto.CreateScheduleRequest;
import com.bookingcalendar.dto.Schedule;
import com.bookingcalendar.dto.ScheduleList;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class AdminSchedulesController implements AdminSchedulesApi {

    private final ScheduleService scheduleService;

    public AdminSchedulesController(ScheduleService scheduleService) {
        this.scheduleService = scheduleService;
    }

    @Override
    public ResponseEntity<ScheduleList> adminSchedulesList() {
        return ResponseEntity.ok(scheduleService.list());
    }

    @Override
    public ResponseEntity<Schedule> adminSchedulesCreate(CreateScheduleRequest createScheduleRequest) {
        Schedule created = scheduleService.create(createScheduleRequest);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }
}
