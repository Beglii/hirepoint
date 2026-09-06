package com.begli.hirepoint.controller;

import com.begli.hirepoint.model.JobApplication;
import com.begli.hirepoint.repository.JobApplicationRepository; //importing our model and repo

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

    public JobApplicationController(JobApplicationRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    public List<JobApplication> getAllApplications() {
        return repository.findAll(); //runs a SELECT * FROM job_applications from behind the scenes and returns every row as a List<JobApplication>
    }

    @PostMapping
    public JobApplication createApplication(@RequestBody JobApplication newApplication) {
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

        return repository.save(existing);
    }

    @DeleteMapping("/{id}") //this is the rest convention for removal
    public void deleteApplication(@PathVariable Long id) {
        repository.deleteById(id);
    }

}