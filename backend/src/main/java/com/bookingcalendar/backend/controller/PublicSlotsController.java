package com.bookingcalendar.backend.controller;

import com.bookingcalendar.backend.service.SlotService;
import com.bookingcalendar.controller.PublicSlotsApi;
import com.bookingcalendar.dto.SlotList;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;

import java.time.OffsetDateTime;

@RestController
public class PublicSlotsController implements PublicSlotsApi {

    private final SlotService slotService;

    public PublicSlotsController(SlotService slotService) {
        this.slotService = slotService;
    }

    @Override
    public ResponseEntity<SlotList> publicSlotsList(String eventTypeId, OffsetDateTime from, OffsetDateTime to) {
        return ResponseEntity.ok(slotService.list(eventTypeId, from, to));
    }
}
