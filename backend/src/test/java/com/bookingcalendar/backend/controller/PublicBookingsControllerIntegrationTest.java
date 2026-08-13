package com.bookingcalendar.backend.controller;

import com.bookingcalendar.backend.entity.EventTypeEntity;
import com.bookingcalendar.backend.entity.SlotEntity;
import com.bookingcalendar.backend.repository.EventTypeRepository;
import com.bookingcalendar.backend.repository.SlotRepository;
import com.bookingcalendar.dto.SlotStatus;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.time.OffsetDateTime;
import java.util.Map;

import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
class PublicBookingsControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private SlotRepository slotRepository;

    @Autowired
    private EventTypeRepository eventTypeRepository;

    @Autowired
    private ObjectMapper objectMapper;

    private String slotId;
    private String eventTypeId;

    @BeforeEach
    void setUp() {
        slotRepository.deleteAll();
        eventTypeRepository.deleteAll();
        EventTypeEntity eventType = eventTypeRepository.save(new EventTypeEntity("Consultation", "A consultation", 30));
        eventTypeId = eventType.getId();
        OffsetDateTime start = OffsetDateTime.parse("2026-01-15T10:00:00Z");
        SlotEntity slot = slotRepository.save(new SlotEntity(eventTypeId, start, start.plusMinutes(30), SlotStatus.AVAILABLE));
        slotId = slot.getId();
    }

    @Test
    void createBooking_returns201WithConfirmedStatus() throws Exception {
        Map<String, Object> request = Map.of(
                "slotId", slotId,
                "eventTypeId", eventTypeId,
                "guestName", "John Doe",
                "guestEmail", "john@example.com"
        );

        mockMvc.perform(post("/bookings")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").isNotEmpty())
                .andExpect(jsonPath("$.slotId").value(slotId))
                .andExpect(jsonPath("$.eventTypeId").value(eventTypeId))
                .andExpect(jsonPath("$.guestName").value("John Doe"))
                .andExpect(jsonPath("$.guestEmail").value("john@example.com"))
                .andExpect(jsonPath("$.status").value("confirmed"))
                .andExpect(jsonPath("$.createdAt").isNotEmpty());
    }

    @Test
    void createBooking_marksSlotAsBooked() throws Exception {
        Map<String, Object> request = Map.of(
                "slotId", slotId,
                "eventTypeId", eventTypeId,
                "guestName", "John Doe",
                "guestEmail", "john@example.com"
        );

        mockMvc.perform(post("/bookings")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated());

        SlotEntity slot = slotRepository.findById(slotId).orElseThrow();
        assert slot.getStatus() == SlotStatus.BOOKED;
    }

    @Test
    void createBooking_returns404WhenSlotNotFound() throws Exception {
        Map<String, Object> request = Map.of(
                "slotId", "non-existent-slot",
                "eventTypeId", eventTypeId,
                "guestName", "John Doe",
                "guestEmail", "john@example.com"
        );

        mockMvc.perform(post("/bookings")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isNotFound());
    }

    @Test
    void createBooking_returns409WhenSlotAlreadyBooked() throws Exception {
        Map<String, Object> request = Map.of(
                "slotId", slotId,
                "eventTypeId", eventTypeId,
                "guestName", "John Doe",
                "guestEmail", "john@example.com"
        );

        mockMvc.perform(post("/bookings")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated());

        Map<String, Object> secondRequest = Map.of(
                "slotId", slotId,
                "eventTypeId", eventTypeId,
                "guestName", "Jane Doe",
                "guestEmail", "jane@example.com"
        );

        mockMvc.perform(post("/bookings")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(secondRequest)))
                .andExpect(status().isConflict());
    }

    @Test
    void createBooking_returns400WhenInvalidEmail() throws Exception {
        Map<String, Object> request = Map.of(
                "slotId", slotId,
                "eventTypeId", eventTypeId,
                "guestName", "John Doe",
                "guestEmail", "invalid-email"
        );

        mockMvc.perform(post("/bookings")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest());
    }
}
