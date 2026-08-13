package com.bookingcalendar.backend.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@NoArgsConstructor
@ToString
@Entity
@Table(name = "event_types")
public class EventTypeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String description;

    @Column(name = "duration_minutes", nullable = false)
    private Integer durationMinutes;

    public EventTypeEntity(String name, String description, Integer durationMinutes) {
        this.name = name;
        this.description = description;
        this.durationMinutes = durationMinutes;
    }
}
