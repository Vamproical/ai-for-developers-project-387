package com.bookingcalendar.backend.mapper;

import com.bookingcalendar.backend.entity.BookingEntity;
import org.mapstruct.Mapper;
import org.mapstruct.ReportingPolicy;

import java.util.List;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface BookingMapper {

    com.bookingcalendar.dto.Booking toDto(BookingEntity entity);

    List<com.bookingcalendar.dto.Booking> toDtoList(List<BookingEntity> entities);
}
