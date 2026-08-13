package com.bookingcalendar.backend.controller;

import com.bookingcalendar.backend.service.SlotService;
import com.bookingcalendar.controller.AdminSlotsApi;
import com.bookingcalendar.dto.CreateSlotRequest;
import com.bookingcalendar.dto.Slot;
import com.bookingcalendar.dto.SlotList;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;

import java.time.OffsetDateTime;

@RestController
public class AdminSlotsController implements AdminSlotsApi {

    private final SlotService slotService;

    public AdminSlotsController(SlotService slotService) {
        this.slotService = slotService;
    }

    @Override
    public ResponseEntity<SlotList> adminSlotsList(String eventTypeId, OffsetDateTime from, OffsetDateTime to) {
        return ResponseEntity.ok(slotService.list(eventTypeId, from, to));
    }

    @Override
    public ResponseEntity<Slot> adminSlotsCreate(CreateSlotRequest createSlotRequest) {
        Slot created = slotService.create(createSlotRequest);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }
}
