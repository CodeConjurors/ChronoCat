package com.chronocat.backend;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

/** The Spring repository for Activity entities. */
public interface ActivityRepository extends JpaRepository<Activity, Long> {

    List<Activity> findByDayIdOrderByIndex(Long dayId);

    long countByDay(Day day);

    @Modifying
    @Query("UPDATE Activity SET index = index + 1 WHERE day = ?1 AND index >= ?2")
    public void pushBackAllSubsequentIndices(Day day, Long index);

    @Modifying
    @Query("UPDATE Activity SET index = index - 1 WHERE day = ?1 AND index > ?2")
    public void pullForwardAllSubsequentIndices(Day day, Long index);

    @Modifying
    @Query("UPDATE Activity SET index = index + ?2 WHERE day = ?1 AND index >= ?3 AND index <= ?4")
    public void moveMultiple(Day day, Long movementAmount, Long startIndex, Long endIndex);
}
