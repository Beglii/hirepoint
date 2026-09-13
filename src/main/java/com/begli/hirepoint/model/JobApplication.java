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

    @ManyToOne //bean stating many job application entities could be in 1 user
    @JoinColumn(name = "user_id")
    private User user;

    private String jobTitle;

    @Enumerated(EnumType.STRING)
    private ApplicationStatus status; //application status is automatically enumerated as a string

    private LocalDate dateApplied;

    private String jobPostingUrl;

    public JobApplication() {
    }

    @Column(columnDefinition = "TEXT") //important we use this for notes so we can go past the 255-character limit
    private String notes;

    public JobApplication(String companyName, String jobTitle, ApplicationStatus status, LocalDate dateApplied, String jobPostingUrl) {
        this.companyName = companyName;
        this.jobTitle = jobTitle;
        this.status = status;
        this.dateApplied = dateApplied;
        this.jobPostingUrl = jobPostingUrl;
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

    public String getJobPostingUrl() {
        return jobPostingUrl;
    }

    public void setJobPostingUrl(String jobPostingUrl) {
        this.jobPostingUrl = jobPostingUrl;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }
}