package com.bookingcalendar.backend.controller;

import com.bookingcalendar.backend.entity.BookingEntity;
import com.bookingcalendar.backend.entity.EventTypeEntity;
import com.bookingcalendar.backend.entity.SlotEntity;
import com.bookingcalendar.backend.repository.BookingRepository;
import com.bookingcalendar.backend.repository.EventTypeRepository;
import com.bookingcalendar.backend.repository.SlotRepository;
import com.bookingcalendar.dto.BookingStatus;
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
class AdminBookingsControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private SlotRepository slotRepository;

    @Autowired
    private EventTypeRepository eventTypeRepository;

    @Autowired
    private ObjectMapper objectMapper;

    private String bookingId;
    private String slotId;
    private String eventTypeId;

    @BeforeEach
    void setUp() {
        bookingRepository.deleteAll();
        slotRepository.deleteAll();
        eventTypeRepository.deleteAll();
        EventTypeEntity eventType = eventTypeRepository.save(new EventTypeEntity("Consultation", "A consultation", 30));
        eventTypeId = eventType.getId();
        OffsetDateTime start = OffsetDateTime.parse("2026-01-15T10:00:00Z");
        SlotEntity slot = slotRepository.save(new SlotEntity(eventTypeId, start, start.plusMinutes(30), SlotStatus.BOOKED));
        slotId = slot.getId();
        BookingEntity booking = new BookingEntity(slotId, eventTypeId, "John Doe", "john@example.com", null, null);
        bookingId = bookingRepository.save(booking).getId();
    }

    @Test
    void listBookings_returnsAllBookings() throws Exception {
        mockMvc.perform(get("/admin/bookings"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.items").isArray())
                .andExpect(jsonPath("$.items.length()").value(1));
    }

    @Test
    void listBookings_filtersByEventTypeId() throws Exception {
        mockMvc.perform(get("/admin/bookings").param("eventTypeId", eventTypeId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.items").isArray())
                .andExpect(jsonPath("$.items.length()").value(1));
    }

    @Test
    void listBookings_filtersByStatus() throws Exception {
        mockMvc.perform(get("/admin/bookings").param("status", "confirmed"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.items").isArray())
                .andExpect(jsonPath("$.items.length()").value(1));
    }

    @Test
    void cancelBooking_returnsCancelledBookingAndFreesSlot() throws Exception {
        Map<String, Object> request = Map.of("status", "cancelled");

        mockMvc.perform(patch("/admin/bookings/" + bookingId + "/cancel")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(bookingId))
                .andExpect(jsonPath("$.status").value("cancelled"));

        SlotEntity slot = slotRepository.findById(slotId).orElseThrow();
        assert slot.getStatus() == SlotStatus.AVAILABLE;
    }

    @Test
    void cancelBooking_returns400WhenAlreadyCancelled() throws Exception {
        Map<String, Object> request = Map.of("status", "cancelled");

        mockMvc.perform(patch("/admin/bookings/" + bookingId + "/cancel")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk());

        mockMvc.perform(patch("/admin/bookings/" + bookingId + "/cancel")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest());
    }

    @Test
    void cancelBooking_returns404WhenNotFound() throws Exception {
        Map<String, Object> request = Map.of("status", "cancelled");

        mockMvc.perform(patch("/admin/bookings/non-existent-id/cancel")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isNotFound());
    }
}
