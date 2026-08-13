package com.bookingcalendar.backend.controller;

import com.bookingcalendar.backend.entity.EventTypeEntity;
import com.bookingcalendar.backend.repository.EventTypeRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Map;

import static org.hamcrest.Matchers.*;
import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
class AdminEventTypesControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private EventTypeRepository eventTypeRepository;

    @Autowired
    private ObjectMapper objectMapper;

    @BeforeEach
    void setUp() {
        eventTypeRepository.deleteAll();
    }

    @Test
    void listEventTypes_returnsHttp200AndAllEventTypes() throws Exception {
        eventTypeRepository.save(new EventTypeEntity("Consultation", "A consultation call", 30));
        eventTypeRepository.save(new EventTypeEntity("Workshop", "A workshop session", 60));

        mockMvc.perform(get("/admin/event-types"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.items").isArray())
                .andExpect(jsonPath("$.items.length()").value(2));
    }

    @Test
    void listEventTypes_returnsEmptyListWhenNoEventTypes() throws Exception {
        mockMvc.perform(get("/admin/event-types"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.items").isArray())
                .andExpect(jsonPath("$.items").isEmpty());
    }

    @Test
    void createEventType_returns201WithFullObject() throws Exception {
        Map<String, Object> request = Map.of(
                "name", "New Event Type",
                "description", "A new event type",
                "durationMinutes", 45
        );

        mockMvc.perform(post("/admin/event-types")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").isNotEmpty())
                .andExpect(jsonPath("$.name").value("New Event Type"))
                .andExpect(jsonPath("$.description").value("A new event type"))
                .andExpect(jsonPath("$.durationMinutes").value(45));
    }

    @Test
    void createEventType_returns400WhenDurationIsZeroOrNegative() throws Exception {
        Map<String, Object> request = Map.of(
                "name", "Bad Event",
                "description", "Invalid duration",
                "durationMinutes", 0
        );

        mockMvc.perform(post("/admin/event-types")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest());
    }

    @Test
    void updateEventType_returnsUpdatedObject() throws Exception {
        EventTypeEntity created = eventTypeRepository.save(new EventTypeEntity("Original", "Original desc", 30));

        Map<String, Object> request = Map.of(
                "name", "Updated Name",
                "description", "Updated desc",
                "durationMinutes", 60
        );

        mockMvc.perform(put("/admin/event-types/" + created.getId())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(created.getId()))
                .andExpect(jsonPath("$.name").value("Updated Name"))
                .andExpect(jsonPath("$.description").value("Updated desc"))
                .andExpect(jsonPath("$.durationMinutes").value(60));
    }

    @Test
    void updateEventType_partialUpdateKeepsUnchangedFields() throws Exception {
        EventTypeEntity created = eventTypeRepository.save(new EventTypeEntity("Original", "Original desc", 30));

        Map<String, Object> request = Map.of("name", "Only Name Changed");

        mockMvc.perform(put("/admin/event-types/" + created.getId())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(created.getId()))
                .andExpect(jsonPath("$.name").value("Only Name Changed"))
                .andExpect(jsonPath("$.description").value("Original desc"))
                .andExpect(jsonPath("$.durationMinutes").value(30));
    }

    @Test
    void updateEventType_returns404WhenNotFound() throws Exception {
        Map<String, Object> request = Map.of("name", "Updated");

        mockMvc.perform(put("/admin/event-types/non-existent-id")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isNotFound());
    }

    @Test
    void updateEventType_returns400WhenDurationIsNegative() throws Exception {
        EventTypeEntity created = eventTypeRepository.save(new EventTypeEntity("Original", "Original desc", 30));

        Map<String, Object> request = Map.of("durationMinutes", -5);

        mockMvc.perform(put("/admin/event-types/" + created.getId())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest());
    }

    @Test
    void deleteEventType_returns204AndEntityIsDeleted() throws Exception {
        EventTypeEntity created = eventTypeRepository.save(new EventTypeEntity("To Delete", "Will be deleted", 30));
        String id = created.getId();

        mockMvc.perform(delete("/admin/event-types/" + id))
                .andExpect(status().isNoContent());

        assertThat(eventTypeRepository.findById(id)).isEmpty();
    }

    @Test
    void deleteEventType_returns404WhenNotFound() throws Exception {
        mockMvc.perform(delete("/admin/event-types/non-existent-id"))
                .andExpect(status().isNotFound());
    }
}
