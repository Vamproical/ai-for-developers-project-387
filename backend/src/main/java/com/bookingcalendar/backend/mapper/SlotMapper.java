package com.bookingcalendar.backend.mapper;

import com.bookingcalendar.backend.entity.SlotEntity;
import com.bookingcalendar.dto.SlotStatus;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;

import java.util.List;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface SlotMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "status", ignore = true)
    SlotEntity toEntity(com.bookingcalendar.dto.CreateSlotRequest request);

    com.bookingcalendar.dto.Slot toDto(SlotEntity entity);

    List<com.bookingcalendar.dto.Slot> toDtoList(List<SlotEntity> entities);

    default com.bookingcalendar.dto.SlotList toSlotList(List<SlotEntity> entities) {
        com.bookingcalendar.dto.SlotList list = new com.bookingcalendar.dto.SlotList();
        list.setItems(toDtoList(entities));
        return list;
    }
}
