package com.chronocat.backend;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

/** The backend's API routes. */
@RestController
@RequestMapping("/api/activities")
public class BackendController {

    @Autowired
    private ActivityRepository activityRepository;

    @GetMapping
    public List<Activity> list() {
        return activityRepository.findAll(Sort.by(Sort.Direction.ASC, "index"));
    }

    @PostMapping
    public Activity create(@RequestBody Activity activity) {
        return activityRepository.save(activity);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        activityRepository.deleteById(id);
    }

}
