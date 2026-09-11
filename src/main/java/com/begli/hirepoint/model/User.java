package com.begli.hirepoint.model;

import jakarta.persistence.*;

@Entity
@Table(name = "users") //using users instead because user is a reserved keyword in postgres
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) //same idea with id generation as with our job applications
    private Long id;

    @Column(unique = true, nullable = false) //safety checks, has to be unique username and cant be empty
    private String username;

    @Column(nullable = false) //same safety checks, but password uniqueness is unnecessary
    private String password;

    public User() {
    }

    public User(String username, String password) {
        this.username = username;
        this.password = password;
    }

    public Long getId() {
        return id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}