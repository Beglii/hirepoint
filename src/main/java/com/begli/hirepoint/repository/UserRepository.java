package com.begli.hirepoint.repository;

import com.begli.hirepoint.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByUsername(String username); //different from job application repository since we can look up by the username and not by id
}