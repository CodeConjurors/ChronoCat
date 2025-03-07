package com.chronocat.backend;

import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

import org.springframework.data.jpa.domain.AbstractPersistable;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

/** An activity that the user is planning on doing at a certain time. */
@Entity
@NoArgsConstructor
@AllArgsConstructor
@Data
@EqualsAndHashCode(callSuper = true)
public class Activity extends AbstractPersistable<Long> {

    private String time;

    private String name;

    private Long index;

    @ManyToOne
    @JoinColumn(name = "dayId", nullable = false)
    private Day day;
}
