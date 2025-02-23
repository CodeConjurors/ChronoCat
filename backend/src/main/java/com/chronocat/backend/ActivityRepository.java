package com.chronocat.backend;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

/** The Spring repository for Activity entities. */
public interface ActivityRepository extends JpaRepository<Activity, Long> {

    long countByTabTitle(String tabTitle);

    @Modifying
    @Query("UPDATE Activity SET index = index + 1 WHERE tabTitle = ?1 AND index >= ?2")
    public void pushBackAllSubsequentIndices(String tabTitle, Long index);

    @Modifying
    @Query("UPDATE Activity SET index = index - 1 WHERE tabTitle = ?1 AND index > ?2")
    public void pullForwardAllSubsequentIndices(String tabTitle, Long index);

    @Modifying
    @Query("UPDATE Activity SET index = index + ?2 WHERE tabTitle = ?1 AND index >= ?3 AND index <= ?4")
    public void moveMultiple(String tabTitle, Long movementAmount, Long startIndex, Long endIndex);
}
