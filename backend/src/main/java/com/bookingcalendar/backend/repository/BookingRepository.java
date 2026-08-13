package com.bookingcalendar.backend.repository;

import com.bookingcalendar.backend.entity.BookingEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.querydsl.QuerydslPredicateExecutor;
import org.springframework.stereotype.Repository;

@Repository
public interface BookingRepository extends JpaRepository<BookingEntity, String>, QuerydslPredicateExecutor<BookingEntity> {
}
