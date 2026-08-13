package com.bookingcalendar.backend.repository;

import com.bookingcalendar.backend.entity.ScheduleEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.querydsl.QuerydslPredicateExecutor;
import org.springframework.stereotype.Repository;

@Repository
public interface ScheduleRepository extends JpaRepository<ScheduleEntity, String>, QuerydslPredicateExecutor<ScheduleEntity> {
}
