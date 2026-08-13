package com.bookingcalendar.backend.entity;

import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@ToString
@Entity
@Table(name = "schedules")
public class ScheduleEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "schedule_days_of_week", joinColumns = @JoinColumn(name = "schedule_id"))
    @Column(name = "day_of_week")
    private List<Integer> daysOfWeek = new ArrayList<>();

    @Column(nullable = false)
    private String startTime;

    @Column(nullable = false)
    private String endTime;

    @Column(nullable = false)
    private OffsetDateTime startDate;

    @Column(nullable = false)
    private OffsetDateTime endDate;

    private Integer slotDurationMinutes;

    public ScheduleEntity(List<Integer> daysOfWeek, String startTime, String endTime,
                          OffsetDateTime startDate, OffsetDateTime endDate, Integer slotDurationMinutes) {
        this.daysOfWeek = daysOfWeek;
        this.startTime = startTime;
        this.endTime = endTime;
        this.startDate = startDate;
        this.endDate = endDate;
        this.slotDurationMinutes = slotDurationMinutes;
    }
}
