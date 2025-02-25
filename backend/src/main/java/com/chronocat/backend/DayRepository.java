package com.chronocat.backend;

import java.sql.Date;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

public interface DayRepository extends JpaRepository<Day, Long> {

    Optional<Day> findByDate(Date date);
}
