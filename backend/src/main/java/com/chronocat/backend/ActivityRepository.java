package com.chronocat.backend;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

/** The Spring repository for Activity entities. */
public interface ActivityRepository extends JpaRepository<Activity, Long> {

    @Modifying
    @Query("UPDATE Activity SET index = index + 1 WHERE index >= ?1")
    public void pushBackAllSubsequentIndices(Long index);

    @Modifying
    @Query("UPDATE Activity SET index = index - 1 WHERE index > ?1")
    public void pullForwardAllSubsequentIndices(Long index);

    @Modifying
    @Query("UPDATE Activity SET index = index + ?1 WHERE index >= ?2 AND index <= ?3")
    public void moveMultiple(Long movementAmount, Long startIndex, Long endIndex);
}
