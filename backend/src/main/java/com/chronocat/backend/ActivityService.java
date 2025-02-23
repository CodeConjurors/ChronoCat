package com.chronocat.backend;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class ActivityService {

    @Autowired
    private ActivityRepository activityRepository;

    public List<Activity> getAll() {
        return activityRepository.findAll(Sort.by(Sort.Direction.ASC, "index"));
    }

    public Activity create(Activity activity) {
        if (activity.getIndex() == null) {
            activity.setIndex(activityRepository.countByTabTitle(activity.getTabTitle()));
        } else {
            activityRepository.pushBackAllSubsequentIndices(activity.getTabTitle(), activity.getIndex());
        }
        return activityRepository.save(activity);
    }

    public void delete(Long id) {
        final Optional<Activity> activity = activityRepository.findById(id);
        if (activity.isPresent()) {
            activityRepository.pullForwardAllSubsequentIndices(activity.get().getTabTitle(), activity.get().getIndex());
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
            activityRepository.moveMultiple(origActivity.getTabTitle(), -1l, origActivity.getIndex() + 1, editedActivity.getIndex());
        } else if (editedActivity.getIndex() < origActivity.getIndex()) {
            activityRepository.moveMultiple(origActivity.getTabTitle(), 1l, editedActivity.getIndex(), origActivity.getIndex() - 1);
        }
        origActivity.setTime(editedActivity.getTime());
        origActivity.setName(editedActivity.getName());
        origActivity.setIndex(editedActivity.getIndex());
        return activityRepository.save(origActivity);
    }
}
