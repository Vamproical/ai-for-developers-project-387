package com.bookingcalendar.backend.controller;

import com.bookingcalendar.backend.entity.EventTypeEntity;
import com.bookingcalendar.backend.repository.EventTypeRepository;
import com.bookingcalendar.backend.repository.ScheduleRepository;
import com.bookingcalendar.backend.repository.SlotRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.Map;

import static org.hamcrest.Matchers.*;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
class AdminSchedulesControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ScheduleRepository scheduleRepository;

    @Autowired
    private SlotRepository slotRepository;

    @Autowired
    private EventTypeRepository eventTypeRepository;

    @Autowired
    private ObjectMapper objectMapper;

    @BeforeEach
    void setUp() {
        slotRepository.deleteAll();
        scheduleRepository.deleteAll();
        eventTypeRepository.deleteAll();
        eventTypeRepository.save(new EventTypeEntity("Consultation", "A consultation", 30));
    }

    @Test
    void createSchedule_returns201WithCorrectFields() throws Exception {
        OffsetDateTime startDate = OffsetDateTime.parse("2026-01-01T00:00:00Z");
        OffsetDateTime endDate = OffsetDateTime.parse("2026-01-07T00:00:00Z");

        Map<String, Object> request = Map.of(
                "daysOfWeek", List.of(1, 3, 5),
                "startTime", "09:00",
                "endTime", "17:00",
                "startDate", startDate.toString(),
                "endDate", endDate.toString(),
                "slotDurationMinutes", 30
        );

        mockMvc.perform(post("/admin/schedules")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").isNotEmpty())
                .andExpect(jsonPath("$.daysOfWeek").isArray())
                .andExpect(jsonPath("$.daysOfWeek", containsInAnyOrder(1, 3, 5)))
                .andExpect(jsonPath("$.startTime").value("09:00"))
                .andExpect(jsonPath("$.endTime").value("17:00"))
                .andExpect(jsonPath("$.slotDurationMinutes").value(30));

        assertEquals(48, slotRepository.count());
    }

    @Test
    void createSchedule_returns201WithOptionalFieldOmitted() throws Exception {
        OffsetDateTime startDate = OffsetDateTime.parse("2026-01-01T00:00:00Z");
        OffsetDateTime endDate = OffsetDateTime.parse("2026-01-07T00:00:00Z");

        Map<String, Object> request = Map.of(
                "daysOfWeek", List.of(1),
                "startTime", "10:00",
                "endTime", "12:00",
                "startDate", startDate.toString(),
                "endDate", endDate.toString()
        );

        mockMvc.perform(post("/admin/schedules")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").isNotEmpty())
                .andExpect(jsonPath("$.slotDurationMinutes").doesNotExist());
    }

    @Test
    void createSchedule_returns400WhenDaysOfWeekInvalid() throws Exception {
        OffsetDateTime startDate = OffsetDateTime.parse("2026-01-01T00:00:00Z");
        OffsetDateTime endDate = OffsetDateTime.parse("2026-12-31T00:00:00Z");

        Map<String, Object> request = Map.of(
                "daysOfWeek", List.of(7),
                "startTime", "09:00",
                "endTime", "17:00",
                "startDate", startDate.toString(),
                "endDate", endDate.toString()
        );

        mockMvc.perform(post("/admin/schedules")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest());
    }

    @Test
    void createSchedule_returns400WhenStartAfterEnd() throws Exception {
        OffsetDateTime startDate = OffsetDateTime.parse("2026-12-31T00:00:00Z");
        OffsetDateTime endDate = OffsetDateTime.parse("2026-01-01T00:00:00Z");

        Map<String, Object> request = Map.of(
                "daysOfWeek", List.of(1),
                "startTime", "09:00",
                "endTime", "17:00",
                "startDate", startDate.toString(),
                "endDate", endDate.toString()
        );

        mockMvc.perform(post("/admin/schedules")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest());
    }

    @Test
    void listSchedules_returnsAllSchedules() throws Exception {
        mockMvc.perform(get("/admin/schedules"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.items").isArray())
                .andExpect(jsonPath("$.items").isEmpty());
    }
}
