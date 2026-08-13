package com.bookingcalendar.backend.controller;

import com.bookingcalendar.backend.entity.EventTypeEntity;
import com.bookingcalendar.backend.repository.EventTypeRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.ResultActions;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
class PublicEventTypesControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private EventTypeRepository eventTypeRepository;

    @BeforeEach
    void setUp() {
        eventTypeRepository.deleteAll();
    }

    @Test
    void listEventTypes_returnsHttp200AndCorrectJsonShape() throws Exception {
        eventTypeRepository.save(new EventTypeEntity("Consultation", "A consultation call", 30));
        eventTypeRepository.save(new EventTypeEntity("Workshop", "A workshop session", 60));

        mockMvc.perform(get("/event-types"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.items").isArray())
                .andExpect(jsonPath("$.items.length()").value(2))
                .andExpect(jsonPath("$.items[0].id").isNotEmpty())
                .andExpect(jsonPath("$.items[0].name").value("Consultation"))
                .andExpect(jsonPath("$.items[0].description").value("A consultation call"))
                .andExpect(jsonPath("$.items[0].durationMinutes").value(30));
    }

    @Test
    void listEventTypes_returnsEmptyListWhenNoEventTypes() throws Exception {
        ResultActions result = mockMvc.perform(get("/event-types"));

        result.andExpect(status().isOk())
                .andExpect(jsonPath("$.items").isArray())
                .andExpect(jsonPath("$.items").isEmpty());
    }
}
