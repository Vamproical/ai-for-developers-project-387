package com.bookingcalendar.backend.controller;

import com.bookingcalendar.backend.entity.SlotEntity;
import com.bookingcalendar.backend.repository.SlotRepository;
import com.bookingcalendar.dto.SlotStatus;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.web.servlet.MockMvc;

import java.time.OffsetDateTime;

import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
class PublicSlotsControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private SlotRepository slotRepository;

    private final OffsetDateTime baseDate = OffsetDateTime.parse("2026-01-15T10:00:00Z");

    @BeforeEach
    void setUp() {
        slotRepository.deleteAll();
    }

    @Test
    void listSlots_returnsAllSlotsWhenNoFilters() throws Exception {
        slotRepository.save(new SlotEntity("type-1", baseDate, baseDate.plusMinutes(30), SlotStatus.AVAILABLE));
        slotRepository.save(new SlotEntity("type-2", baseDate.plusHours(1), baseDate.plusHours(1).plusMinutes(30), SlotStatus.AVAILABLE));

        mockMvc.perform(get("/slots"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.items").isArray())
                .andExpect(jsonPath("$.items.length()").value(2));
    }

    @Test
    void listSlots_filtersByEventTypeId() throws Exception {
        slotRepository.save(new SlotEntity("type-1", baseDate, baseDate.plusMinutes(30), SlotStatus.AVAILABLE));
        slotRepository.save(new SlotEntity("type-2", baseDate.plusHours(1), baseDate.plusHours(1).plusMinutes(30), SlotStatus.AVAILABLE));

        mockMvc.perform(get("/slots").param("eventTypeId", "type-1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.items").isArray())
                .andExpect(jsonPath("$.items.length()").value(1))
                .andExpect(jsonPath("$.items[0].eventTypeId").value("type-1"));
    }

    @Test
    void listSlots_filtersByDateRange() throws Exception {
        OffsetDateTime from = baseDate.minusHours(1);
        OffsetDateTime to = baseDate.plusHours(2);

        slotRepository.save(new SlotEntity("type-1", baseDate, baseDate.plusMinutes(30), SlotStatus.AVAILABLE));
        slotRepository.save(new SlotEntity("type-1", baseDate.plusDays(1), baseDate.plusDays(1).plusMinutes(30), SlotStatus.AVAILABLE));

        mockMvc.perform(get("/slots")
                        .param("from", from.toString())
                        .param("to", to.toString()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.items").isArray())
                .andExpect(jsonPath("$.items.length()").value(1));
    }

    @Test
    void listSlots_combinedFiltersWorkTogether() throws Exception {
        OffsetDateTime from = baseDate.minusHours(1);
        OffsetDateTime to = baseDate.plusHours(2);

        slotRepository.save(new SlotEntity("type-1", baseDate, baseDate.plusMinutes(30), SlotStatus.AVAILABLE));
        slotRepository.save(new SlotEntity("type-1", baseDate.plusHours(1), baseDate.plusHours(1).plusMinutes(30), SlotStatus.AVAILABLE));
        slotRepository.save(new SlotEntity("type-2", baseDate, baseDate.plusMinutes(30), SlotStatus.AVAILABLE));

        mockMvc.perform(get("/slots")
                        .param("eventTypeId", "type-1")
                        .param("from", from.toString())
                        .param("to", to.toString()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.items").isArray())
                .andExpect(jsonPath("$.items.length()").value(2));
    }

    @Test
    void listSlots_returnsEmptyListWhenNoResults() throws Exception {
        mockMvc.perform(get("/slots").param("eventTypeId", "non-existent"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.items").isArray())
                .andExpect(jsonPath("$.items").isEmpty());
    }

    @Test
    void listSlots_returnsEmptyListWhenNoSlotsExist() throws Exception {
        mockMvc.perform(get("/slots"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.items").isArray())
                .andExpect(jsonPath("$.items").isEmpty());
    }
}
