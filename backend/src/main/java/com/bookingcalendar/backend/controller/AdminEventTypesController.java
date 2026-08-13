package com.bookingcalendar.backend.controller;

import com.bookingcalendar.backend.service.EventTypeService;
import com.bookingcalendar.controller.AdminEventTypesApi;
import com.bookingcalendar.dto.CreateEventTypeRequest;
import com.bookingcalendar.dto.EventType;
import com.bookingcalendar.dto.EventTypeList;
import com.bookingcalendar.dto.UpdateEventTypeRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class AdminEventTypesController implements AdminEventTypesApi {

    private final EventTypeService eventTypeService;

    public AdminEventTypesController(EventTypeService eventTypeService) {
        this.eventTypeService = eventTypeService;
    }

    @Override
    public ResponseEntity<EventTypeList> adminEventTypesList() {
        return ResponseEntity.ok(eventTypeService.listAll());
    }

    @Override
    public ResponseEntity<EventType> adminEventTypesCreate(CreateEventTypeRequest createEventTypeRequest) {
        EventType created = eventTypeService.create(createEventTypeRequest);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @Override
    public ResponseEntity<EventType> adminEventTypesUpdate(String id, UpdateEventTypeRequest updateEventTypeRequest) {
        EventType updated = eventTypeService.update(id, updateEventTypeRequest);
        return ResponseEntity.ok(updated);
    }

    @Override
    public ResponseEntity<Void> adminEventTypesDelete(String id) {
        eventTypeService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
