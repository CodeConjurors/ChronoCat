package com.chronocat.backend;

import org.springframework.data.jpa.repository.JpaRepository;

/** The Spring repository for Activity entities. */
public interface ActivityRepository extends JpaRepository<Activity, Long> {

}
