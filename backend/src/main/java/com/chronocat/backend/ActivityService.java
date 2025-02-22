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
            activity.setIndex(activityRepository.count());
        } else {
            activityRepository.pushBackAllSubsequentIndices(activity.getIndex());
        }
        return activityRepository.save(activity);
    }

    public void delete(Long id) {
        final Optional<Activity> activity = activityRepository.findById(id);
        if (activity.isPresent()) {
            activityRepository.pullForwardAllSubsequentIndices(activity.get().getIndex());
            activityRepository.deleteById(id);
        }
    }
}
