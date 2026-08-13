package com.bookingcalendar.backend.service;

import com.bookingcalendar.backend.entity.QSlotEntity;
import com.bookingcalendar.backend.entity.SlotEntity;
import com.bookingcalendar.backend.mapper.SlotMapper;
import com.bookingcalendar.backend.repository.EventTypeRepository;
import com.bookingcalendar.backend.repository.SlotRepository;
import com.bookingcalendar.dto.CreateSlotRequest;
import com.bookingcalendar.dto.SlotList;
import com.bookingcalendar.dto.SlotStatus;
import com.querydsl.core.BooleanBuilder;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.stream.StreamSupport;

@Service
@Transactional(readOnly = true)
public class SlotService {

    private final SlotRepository slotRepository;
    private final EventTypeRepository eventTypeRepository;
    private final SlotMapper slotMapper;

    public SlotService(SlotRepository slotRepository, EventTypeRepository eventTypeRepository, SlotMapper slotMapper) {
        this.slotRepository = slotRepository;
        this.eventTypeRepository = eventTypeRepository;
        this.slotMapper = slotMapper;
    }

    public SlotList list(String eventTypeId, OffsetDateTime from, OffsetDateTime to) {
        QSlotEntity slot = QSlotEntity.slotEntity;
        BooleanBuilder predicate = new BooleanBuilder();

        if (eventTypeId != null) {
            predicate.and(slot.eventTypeId.eq(eventTypeId));
        }
        if (from != null && to != null) {
            predicate.and(slot.startDateTime.between(from, to));
        }

        List<SlotEntity> slots = StreamSupport.stream(slotRepository.findAll(predicate).spliterator(), false)
                .toList();
        return slotMapper.toSlotList(slots);
    }

    @Transactional
    public com.bookingcalendar.dto.Slot create(CreateSlotRequest request) {
        if (!request.getStartDateTime().isBefore(request.getEndDateTime())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "startDateTime must be before endDateTime");
        }
        if (!eventTypeRepository.existsById(request.getEventTypeId())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "eventTypeId does not exist: " + request.getEventTypeId());
        }

        SlotEntity entity = slotMapper.toEntity(request);
        entity.setStatus(SlotStatus.AVAILABLE);
        SlotEntity saved = slotRepository.save(entity);
        return slotMapper.toDto(saved);
    }
}
