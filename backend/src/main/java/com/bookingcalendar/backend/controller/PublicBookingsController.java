package com.bookingcalendar.backend.controller;

import com.bookingcalendar.backend.service.BookingService;
import com.bookingcalendar.controller.PublicBookingsApi;
import com.bookingcalendar.dto.Booking;
import com.bookingcalendar.dto.CreateBookingRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class PublicBookingsController implements PublicBookingsApi {

    private final BookingService bookingService;

    public PublicBookingsController(BookingService bookingService) {
        this.bookingService = bookingService;
    }

    @Override
    public ResponseEntity<Booking> publicBookingsCreate(CreateBookingRequest createBookingRequest) {
        Booking created = bookingService.create(createBookingRequest);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }
}
