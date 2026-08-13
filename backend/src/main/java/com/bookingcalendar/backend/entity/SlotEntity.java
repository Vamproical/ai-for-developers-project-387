package com.bookingcalendar.backend.entity;

import com.bookingcalendar.dto.SlotStatus;
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
@Table(name = "slots")
public class SlotEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(name = "event_type_id", nullable = false)
    private String eventTypeId;

    @Column(name = "start_date_time", nullable = false)
    private OffsetDateTime startDateTime;

    @Column(name = "end_date_time", nullable = false)
    private OffsetDateTime endDateTime;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private SlotStatus status;

    public SlotEntity(String eventTypeId, OffsetDateTime startDateTime, OffsetDateTime endDateTime, SlotStatus status) {
        this.eventTypeId = eventTypeId;
        this.startDateTime = startDateTime;
        this.endDateTime = endDateTime;
        this.status = status;
    }
}
