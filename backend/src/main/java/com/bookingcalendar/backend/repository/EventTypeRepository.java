package com.bookingcalendar.backend.repository;

import com.bookingcalendar.backend.entity.EventTypeEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.querydsl.QuerydslPredicateExecutor;
import org.springframework.stereotype.Repository;

@Repository
public interface EventTypeRepository extends JpaRepository<EventTypeEntity, String>, QuerydslPredicateExecutor<EventTypeEntity> {
}
