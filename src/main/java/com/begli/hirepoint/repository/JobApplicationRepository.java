package com.begli.hirepoint.repository;

import com.begli.hirepoint.model.User;
import com.begli.hirepoint.model.JobApplication; // import the jobApplication model
import org.springframework.data.jpa.repository.JpaRepository; //this import allows you to use JPA methods later on
import org.springframework.stereotype.Repository;
// ^ allows you to use the @Repository below

import java.util.List;

@Repository
public interface JobApplicationRepository extends JpaRepository<JobApplication, Long> {
    List<JobApplication> findByUser(User user); //spring generates a query: SELECT * FROM job_applications WHERE user_id = ?
}