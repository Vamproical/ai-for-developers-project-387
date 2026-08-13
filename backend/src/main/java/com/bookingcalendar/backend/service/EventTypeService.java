package com.bookingcalendar.backend.service;

import com.bookingcalendar.backend.entity.EventTypeEntity;
import com.bookingcalendar.backend.mapper.EventTypeMapper;
import com.bookingcalendar.backend.repository.EventTypeRepository;
import com.bookingcalendar.dto.CreateEventTypeRequest;
import com.bookingcalendar.dto.EventTypeList;
import com.bookingcalendar.dto.UpdateEventTypeRequest;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
@Transactional(readOnly = true)
public class EventTypeService {

    private final EventTypeRepository eventTypeRepository;
    private final EventTypeMapper eventTypeMapper;

    public EventTypeService(EventTypeRepository eventTypeRepository, EventTypeMapper eventTypeMapper) {
        this.eventTypeRepository = eventTypeRepository;
        this.eventTypeMapper = eventTypeMapper;
    }

    public EventTypeList listAll() {
        return eventTypeMapper.toEventTypeList(eventTypeRepository.findAll());
    }

    @Transactional
    public com.bookingcalendar.dto.EventType create(CreateEventTypeRequest request) {
        validateDuration(request.getDurationMinutes());
        EventTypeEntity entity = eventTypeMapper.toEntity(request);
        EventTypeEntity saved = eventTypeRepository.save(entity);
        return eventTypeMapper.toDto(saved);
    }

    @Transactional
    public com.bookingcalendar.dto.EventType update(String id, UpdateEventTypeRequest request) {
        EventTypeEntity entity = getByIdOrThrow(id);
        if (request.getDurationMinutes() != null) {
            validateDuration(request.getDurationMinutes());
        }
        eventTypeMapper.updateEntity(request, entity);
        EventTypeEntity updated = eventTypeRepository.save(entity);
        return eventTypeMapper.toDto(updated);
    }

    @Transactional
    public void delete(String id) {
        if (!eventTypeRepository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "EventType not found with id: " + id);
        }
        eventTypeRepository.deleteById(id);
    }

    private EventTypeEntity getByIdOrThrow(String id) {
        return eventTypeRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "EventType not found with id: " + id));
    }

    private void validateDuration(Integer durationMinutes) {
        if (durationMinutes != null && durationMinutes <= 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "durationMinutes must be greater than 0");
        }
    }
}
