package com.begli.hirepoint.model;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "job_applications")
public class JobApplication {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id; //generating id automatically

    private String companyName;

    private String jobTitle;

    @Enumerated(EnumType.STRING)
    private ApplicationStatus status; //application status is automatically enumerated as a string

    private LocalDate dateApplied;

    public JobApplication() {
    }

    public JobApplication(String companyName, String jobTitle, ApplicationStatus status, LocalDate dateApplied) {
        this.companyName = companyName;
        this.jobTitle = jobTitle;
        this.status = status;
        this.dateApplied = dateApplied;
    }

    public Long getId() {
        return id;
    }

    public String getCompanyName() {
        return companyName;
    }

    public void setCompanyName(String companyName) {
        this.companyName = companyName;
    }

    public String getJobTitle() {
        return jobTitle;
    }

    public void setJobTitle(String jobTitle) {
        this.jobTitle = jobTitle;
    }

    public ApplicationStatus getStatus() {
        return status;
    }

    public void setStatus(ApplicationStatus status) {
        this.status = status;
    }

    public LocalDate getDateApplied() {
        return dateApplied;
    }

    public void setDateApplied(LocalDate dateApplied) {
        this.dateApplied = dateApplied;
    }
}