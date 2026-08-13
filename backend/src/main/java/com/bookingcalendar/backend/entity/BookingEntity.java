package com.bookingcalendar.backend.entity;

import com.bookingcalendar.dto.BookingStatus;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import java.time.OffsetDateTime;

@Getter
@Setter
@NoArgsConstructor
@ToString
@Entity
@Table(name = "bookings")
public class BookingEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(name = "slot_id", nullable = false)
    private String slotId;

    @Column(name = "event_type_id", nullable = false)
    private String eventTypeId;

    @Column(name = "guest_name", nullable = false)
    private String guestName;

    @Column(name = "guest_email", nullable = false)
    private String guestEmail;

    @Column(name = "guest_phone")
    private String guestPhone;

    private String comment;

    @Column(nullable = false)
    private OffsetDateTime createdAt;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private BookingStatus status;

    public BookingEntity(String slotId, String eventTypeId, String guestName, String guestEmail,
                         String guestPhone, String comment) {
        this.slotId = slotId;
        this.eventTypeId = eventTypeId;
        this.guestName = guestName;
        this.guestEmail = guestEmail;
        this.guestPhone = guestPhone;
        this.comment = comment;
        this.createdAt = OffsetDateTime.now();
        this.status = BookingStatus.CONFIRMED;
    }
}
