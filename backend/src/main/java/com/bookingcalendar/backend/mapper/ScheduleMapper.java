package com.bookingcalendar.backend.mapper;

import com.bookingcalendar.backend.entity.ScheduleEntity;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;

import java.util.List;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface ScheduleMapper {

    @Mapping(target = "id", ignore = true)
    ScheduleEntity toEntity(com.bookingcalendar.dto.CreateScheduleRequest request);

    com.bookingcalendar.dto.Schedule toDto(ScheduleEntity entity);

    List<com.bookingcalendar.dto.Schedule> toDtoList(List<ScheduleEntity> entities);

    default com.bookingcalendar.dto.ScheduleList toScheduleList(List<ScheduleEntity> entities) {
        com.bookingcalendar.dto.ScheduleList list = new com.bookingcalendar.dto.ScheduleList();
        list.setItems(toDtoList(entities));
        return list;
    }
}
