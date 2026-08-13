package com.bookingcalendar.backend.repository;

import com.bookingcalendar.backend.entity.SlotEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.querydsl.QuerydslPredicateExecutor;
import org.springframework.stereotype.Repository;

import java.time.OffsetDateTime;

@Repository
public interface SlotRepository extends JpaRepository<SlotEntity, String>, QuerydslPredicateExecutor<SlotEntity> {
    boolean existsByEventTypeIdAndStartDateTimeAndEndDateTime(
            String eventTypeId,
            OffsetDateTime startDateTime,
            OffsetDateTime endDateTime);
}
