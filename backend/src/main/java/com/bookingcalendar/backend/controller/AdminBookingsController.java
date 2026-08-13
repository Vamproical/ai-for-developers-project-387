package com.bookingcalendar.backend.controller;

import com.bookingcalendar.backend.service.BookingService;
import com.bookingcalendar.controller.AdminBookingsApi;
import com.bookingcalendar.dto.Booking;
import com.bookingcalendar.dto.BookingList;
import com.bookingcalendar.dto.BookingStatus;
import com.bookingcalendar.dto.UpdateBookingStatusRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;

import java.time.OffsetDateTime;

@RestController
public class AdminBookingsController implements AdminBookingsApi {

    private final BookingService bookingService;

    public AdminBookingsController(BookingService bookingService) {
        this.bookingService = bookingService;
    }

    @Override
    public ResponseEntity<BookingList> adminBookingsList(String eventTypeId, BookingStatus status, OffsetDateTime from, OffsetDateTime to) {
        return ResponseEntity.ok(bookingService.list(eventTypeId, status, from, to));
    }

    @Override
    public ResponseEntity<Booking> adminBookingsCancel(String id, UpdateBookingStatusRequest updateBookingStatusRequest) {
        Booking cancelled = bookingService.cancel(id);
        return ResponseEntity.ok(cancelled);
    }
}
