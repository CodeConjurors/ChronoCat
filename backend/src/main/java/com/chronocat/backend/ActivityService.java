package com.chronocat.backend;

import java.sql.Date;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class ActivityService {

    private static final Date DEFAULT_DATE = Date.valueOf("2000-01-01");

    @Autowired
    private ActivityRepository activityRepository;

    @Autowired
    private DayService dayService;

    public List<Activity> getAll() {
        return activityRepository.findAll(Sort.by(Sort.Direction.ASC, "index"));
    }

    public Activity create(Activity activity) {
        if (activity.getDay() == null) {
            Optional<Day> day = dayService.getByDate(DEFAULT_DATE);
            if (day.isPresent()) {
                activity.setDay(day.get());
            } else {
                activity.setDay(dayService.create(new Day(DEFAULT_DATE, List.<Activity>of())));
            }
        }

        if (activity.getIndex() == null) {
            activity.setIndex(activityRepository.countByDay(activity.getDay()));
        } else {
            activityRepository.pushBackAllSubsequentIndices(activity.getDay(), activity.getIndex());
        }

        return activityRepository.save(activity);
    }

    public void delete(Long id) {
        final Optional<Activity> activity = activityRepository.findById(id);
        if (activity.isPresent()) {
            activityRepository.pullForwardAllSubsequentIndices(activity.get().getDay(), activity.get().getIndex());
            activityRepository.deleteById(id);
        }
    }

    public Activity edit(Long id, Activity editedActivity) {
        Optional<Activity> origActivityOpt = activityRepository.findById(id);
        if (!origActivityOpt.isPresent()) {
            return null;
        }
        Activity origActivity = origActivityOpt.get();
        if (editedActivity.getIndex() > origActivity.getIndex()) {
            activityRepository.moveMultiple(origActivity.getDay(), -1l, origActivity.getIndex() + 1, editedActivity.getIndex());
        } else if (editedActivity.getIndex() < origActivity.getIndex()) {
            activityRepository.moveMultiple(origActivity.getDay(), 1l, editedActivity.getIndex(), origActivity.getIndex() - 1);
        }
        origActivity.setTime(editedActivity.getTime());
        origActivity.setName(editedActivity.getName());
        origActivity.setIndex(editedActivity.getIndex());
        return activityRepository.save(origActivity);
    }
}
