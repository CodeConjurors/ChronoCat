package com.chronocat.backend;

import java.sql.Date;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class DayService {

    @Autowired
    private DayRepository dayRepository;

    public List<Day> getAll() {
        return dayRepository.findAll();
    }

    public List<Activity> getActivitiesFor(Long id) {
        return dayRepository.findById(id)
            .orElseThrow(() -> new NotFoundException())
            .getActivities();
    }

    public Optional<Day> getByDate(Date date) {
        return dayRepository.findByDate(date);
    }

    public Day create(Day day) {
        return dayRepository.save(day);
    }

    public void delete(Long id) {
        dayRepository.deleteById(id);
    }
}
