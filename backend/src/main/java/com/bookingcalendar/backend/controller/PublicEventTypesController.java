package com.bookingcalendar.backend.controller;

import com.bookingcalendar.backend.service.EventTypeService;
import com.bookingcalendar.dto.EventTypeList;
import com.bookingcalendar.controller.PublicEventTypesApi;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class PublicEventTypesController implements PublicEventTypesApi {

    private final EventTypeService eventTypeService;

    public PublicEventTypesController(EventTypeService eventTypeService) {
        this.eventTypeService = eventTypeService;
    }

    @Override
    public ResponseEntity<EventTypeList> publicEventTypesList() {
        return ResponseEntity.ok(eventTypeService.listAll());
    }
}
