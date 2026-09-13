package com.begli.hirepoint.controller;

import com.begli.hirepoint.model.JobApplication;
import com.begli.hirepoint.model.User;
import com.begli.hirepoint.repository.JobApplicationRepository; //importing our model and repo
import com.begli.hirepoint.repository.UserRepository;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*; //allows to use the @GetMapping
                                                                    //@RequestMapping()
                                                                    //@RestController
                                                                    //@PostMapping
                                                                    //@RequestBody

import java.util.List;

@RestController//this tells Spring that this class handles all HTTP requests and that all HTTP responses should be in JSON form
@RequestMapping("/api/applications") //routes the URL path for every method
public class JobApplicationController {

    private final JobApplicationRepository repository;
    private final UserRepository userRepository; //controller needs to look up both user and job application records

    public JobApplicationController(JobApplicationRepository repository, UserRepository userRepository) {
        this.repository = repository;
        this.userRepository = userRepository;
    }

    private User getCurrentUser() { //after checking the validity of the JWT token, we extract the full user entity
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    @GetMapping
    public List<JobApplication> getAllApplications() {
        User currentUser = getCurrentUser();
        return repository.findByUser(currentUser); //runs a SELECT * FROM job_applications that are within the user, from behind the scenes and returns every row as a List<JobApplication>
    }

    @PostMapping
    public JobApplication createApplication(@RequestBody JobApplication newApplication) {
        User currentUser = getCurrentUser();
        newApplication.setUser(currentUser); //safety check, if someone tries to change the user when creating a job application, this sets it to the user that is logged in automatically
        return repository.save(newApplication);
    } //opposite to the @getMapping this method converts the raw JSON from the incoming request
    // and spring boot auto converts it into a Job application object

    @PutMapping("/{id}") //this updates the application
    public JobApplication updateApplication(@PathVariable Long id, @RequestBody JobApplication updatedApplication) {
        JobApplication existing = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Application not found with id " + id));

        existing.setCompanyName(updatedApplication.getCompanyName());
        existing.setJobTitle(updatedApplication.getJobTitle());
        existing.setStatus(updatedApplication.getStatus());
        existing.setDateApplied(updatedApplication.getDateApplied());
        existing.setJobPostingUrl(updatedApplication.getJobPostingUrl());
        existing.setNotes(updatedApplication.getNotes());

        return repository.save(existing);
    }

    @DeleteMapping("/{id}") //this is the rest convention for removal
    public void deleteApplication(@PathVariable Long id) {
        repository.deleteById(id);
    }

}