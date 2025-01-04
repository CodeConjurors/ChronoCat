package com.chronocat.backend;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

/** The backend main application and its API routes. */
@SpringBootApplication
@RestController
public class BackendController {

    @Autowired
    private ActivityRepository activityRepository;

    @GetMapping("/api/activities")
    public List<Activity> list() {
        return activityRepository.findAll();
    }

    @PostMapping("/api/activities")
    public Activity create(@RequestBody Activity activity) {
        return activityRepository.save(activity);
    }

    public static void main(String[] args) {
        SpringApplication.run(BackendController.class, args);
    }

}
