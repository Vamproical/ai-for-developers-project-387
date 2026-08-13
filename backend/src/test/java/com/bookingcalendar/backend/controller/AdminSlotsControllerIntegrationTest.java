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
class AdminSlotsControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private SlotRepository slotRepository;

    @Autowired
    private EventTypeRepository eventTypeRepository;

    @Autowired
    private ObjectMapper objectMapper;

    private String eventTypeId;

    @BeforeEach
    void setUp() {
        slotRepository.deleteAll();
        eventTypeRepository.deleteAll();
        EventTypeEntity eventType = eventTypeRepository.save(new EventTypeEntity("Consultation", "A consultation", 30));
        eventTypeId = eventType.getId();
    }

    @Test
    void createSlot_returns201WithStatusAvailable() throws Exception {
        OffsetDateTime start = OffsetDateTime.parse("2026-02-01T10:00:00Z");
        OffsetDateTime end = OffsetDateTime.parse("2026-02-01T10:30:00Z");

        Map<String, Object> request = Map.of(
                "eventTypeId", eventTypeId,
                "startDateTime", start.toString(),
                "endDateTime", end.toString()
        );

        mockMvc.perform(post("/admin/slots")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").isNotEmpty())
                .andExpect(jsonPath("$.eventTypeId").value(eventTypeId))
                .andExpect(jsonPath("$.status").value("available"));
    }

    @Test
    void createSlot_returns400WhenStartAfterEnd() throws Exception {
        OffsetDateTime start = OffsetDateTime.parse("2026-02-01T10:30:00Z");
        OffsetDateTime end = OffsetDateTime.parse("2026-02-01T10:00:00Z");

        Map<String, Object> request = Map.of(
                "eventTypeId", eventTypeId,
                "startDateTime", start.toString(),
                "endDateTime", end.toString()
        );

        mockMvc.perform(post("/admin/slots")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest());
    }

    @Test
    void createSlot_returns400WhenStartEqualsEnd() throws Exception {
        OffsetDateTime dateTime = OffsetDateTime.parse("2026-02-01T10:00:00Z");

        Map<String, Object> request = Map.of(
                "eventTypeId", eventTypeId,
                "startDateTime", dateTime.toString(),
                "endDateTime", dateTime.toString()
        );

        mockMvc.perform(post("/admin/slots")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest());
    }

    @Test
    void createSlot_returns400WhenEventTypeIdNotExists() throws Exception {
        OffsetDateTime start = OffsetDateTime.parse("2026-02-01T10:00:00Z");
        OffsetDateTime end = OffsetDateTime.parse("2026-02-01T10:30:00Z");

        Map<String, Object> request = Map.of(
                "eventTypeId", "non-existent-id",
                "startDateTime", start.toString(),
                "endDateTime", end.toString()
        );

        mockMvc.perform(post("/admin/slots")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest());
    }

    @Test
    void listSlots_returnsAllWithFilters() throws Exception {
        OffsetDateTime base = OffsetDateTime.parse("2026-01-15T10:00:00Z");
        slotRepository.save(new SlotEntity(eventTypeId, base, base.plusMinutes(30), SlotStatus.AVAILABLE));
        slotRepository.save(new SlotEntity(eventTypeId, base.plusDays(1), base.plusDays(1).plusMinutes(30), SlotStatus.AVAILABLE));

        mockMvc.perform(get("/admin/slots"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.items").isArray())
                .andExpect(jsonPath("$.items.length()").value(2));
    }

    @Test
    void listSlots_filtersByEventTypeId() throws Exception {
        OffsetDateTime base = OffsetDateTime.parse("2026-01-15T10:00:00Z");
        slotRepository.save(new SlotEntity(eventTypeId, base, base.plusMinutes(30), SlotStatus.AVAILABLE));

        mockMvc.perform(get("/admin/slots").param("eventTypeId", eventTypeId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.items").isArray())
                .andExpect(jsonPath("$.items.length()").value(1));
    }

    @Test
    void listSlots_filtersByDateRange() throws Exception {
        OffsetDateTime base = OffsetDateTime.parse("2026-01-15T10:00:00Z");
        slotRepository.save(new SlotEntity(eventTypeId, base, base.plusMinutes(30), SlotStatus.AVAILABLE));
        slotRepository.save(new SlotEntity(eventTypeId, base.plusDays(1), base.plusDays(1).plusMinutes(30), SlotStatus.AVAILABLE));

        OffsetDateTime from = base.minusHours(1);
        OffsetDateTime to = base.plusHours(2);

        mockMvc.perform(get("/admin/slots")
                        .param("from", from.toString())
                        .param("to", to.toString()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.items").isArray())
                .andExpect(jsonPath("$.items.length()").value(1));
    }
}
