package com.bookingcalendar.backend.service;

import com.bookingcalendar.backend.entity.BookingEntity;
import com.bookingcalendar.backend.entity.QBookingEntity;
import com.bookingcalendar.backend.entity.SlotEntity;
import com.bookingcalendar.backend.mapper.BookingMapper;
import com.bookingcalendar.backend.repository.BookingRepository;
import com.bookingcalendar.backend.repository.SlotRepository;
import com.bookingcalendar.dto.BookingList;
import com.bookingcalendar.dto.BookingStatus;
import com.bookingcalendar.dto.CreateBookingRequest;
import com.querydsl.core.BooleanBuilder;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.regex.Pattern;
import java.util.stream.StreamSupport;

@Service
@Transactional(readOnly = true)
public class BookingService {

    private static final Pattern EMAIL_PATTERN = Pattern.compile("^[\\w.-]+@[\\w.-]+\\.\\w+$");

    private final BookingRepository bookingRepository;
    private final SlotRepository slotRepository;
    private final BookingMapper bookingMapper;

    public BookingService(BookingRepository bookingRepository, SlotRepository slotRepository, BookingMapper bookingMapper) {
        this.bookingRepository = bookingRepository;
        this.slotRepository = slotRepository;
        this.bookingMapper = bookingMapper;
    }

    public BookingList list(String eventTypeId, BookingStatus status, OffsetDateTime from, OffsetDateTime to) {
        QBookingEntity booking = QBookingEntity.bookingEntity;
        BooleanBuilder predicate = new BooleanBuilder();

        if (eventTypeId != null) {
            predicate.and(booking.eventTypeId.eq(eventTypeId));
        }
        if (status != null) {
            predicate.and(booking.status.eq(status));
        }
        if (from != null && to != null) {
            predicate.and(booking.createdAt.between(from, to));
        }

        List<BookingEntity> bookings = StreamSupport.stream(bookingRepository.findAll(predicate).spliterator(), false)
                .toList();
        return new BookingList(bookingMapper.toDtoList(bookings));
    }

    @Transactional
    public com.bookingcalendar.dto.Booking create(CreateBookingRequest request) {
        validateEmail(request.getGuestEmail());

        SlotEntity slot = slotRepository.findById(request.getSlotId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Slot not found: " + request.getSlotId()));

        if (slot.getStatus() != com.bookingcalendar.dto.SlotStatus.AVAILABLE) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Slot is not available");
        }

        slot.setStatus(com.bookingcalendar.dto.SlotStatus.BOOKED);
        slotRepository.save(slot);

        BookingEntity booking = new BookingEntity(
                request.getSlotId(),
                request.getEventTypeId(),
                request.getGuestName(),
                request.getGuestEmail(),
                request.getGuestPhone(),
                request.getComment()
        );
        BookingEntity saved = bookingRepository.save(booking);
        return bookingMapper.toDto(saved);
    }

    @Transactional
    public com.bookingcalendar.dto.Booking cancel(String id) {
        BookingEntity booking = bookingRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Booking not found: " + id));

        if (booking.getStatus() == BookingStatus.CANCELLED) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Booking is already cancelled");
        }

        booking.setStatus(BookingStatus.CANCELLED);
        bookingRepository.save(booking);

        SlotEntity slot = slotRepository.findById(booking.getSlotId()).orElse(null);
        if (slot != null) {
            slot.setStatus(com.bookingcalendar.dto.SlotStatus.AVAILABLE);
            slotRepository.save(slot);
        }

        return bookingMapper.toDto(booking);
    }

    private void validateEmail(String email) {
        if (email == null || !EMAIL_PATTERN.matcher(email).matches()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid email format");
        }
    }
}
