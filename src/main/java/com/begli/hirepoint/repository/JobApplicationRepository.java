package com.begli.hirepoint.repository;

import com.begli.hirepoint.model.JobApplication; // import the jobApplication model
import org.springframework.data.jpa.repository.JpaRepository; //this import allows you to use JPA methods later on
import org.springframework.stereotype.Repository;
// ^ allows you to use the @Repository below
@Repository
public interface JobApplicationRepository extends JpaRepository<JobApplication, Long> {
}