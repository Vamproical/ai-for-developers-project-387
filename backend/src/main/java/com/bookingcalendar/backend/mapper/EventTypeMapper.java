package com.bookingcalendar.backend.mapper;

import com.bookingcalendar.backend.entity.EventTypeEntity;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.NullValuePropertyMappingStrategy;
import org.mapstruct.ReportingPolicy;

import java.util.List;

@Mapper(componentModel = "spring",
        unmappedTargetPolicy = ReportingPolicy.IGNORE,
        nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface EventTypeMapper {

    @Mapping(target = "id", ignore = true)
    EventTypeEntity toEntity(com.bookingcalendar.dto.CreateEventTypeRequest request);

    void updateEntity(com.bookingcalendar.dto.UpdateEventTypeRequest request,
                      @org.mapstruct.MappingTarget EventTypeEntity entity);

    com.bookingcalendar.dto.EventType toDto(EventTypeEntity entity);

    List<com.bookingcalendar.dto.EventType> toDtoList(List<EventTypeEntity> entities);

    default com.bookingcalendar.dto.EventTypeList toEventTypeList(List<EventTypeEntity> entities) {
        com.bookingcalendar.dto.EventTypeList list = new com.bookingcalendar.dto.EventTypeList();
        list.setItems(toDtoList(entities));
        return list;
    }
}
