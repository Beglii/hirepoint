package com.begli.hirepoint.controller;

import com.begli.hirepoint.model.User;
import com.begli.hirepoint.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthController(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @PostMapping("/register")
    public User register(@RequestBody User newUser) {
        if (userRepository.findByUsername(newUser.getUsername()).isPresent()) { //uses the method written earlier in userRepository
            throw new RuntimeException("Username already taken"); //if username is already taken -> throw runtime
        }

        newUser.setPassword(passwordEncoder.encode(newUser.getPassword())); //this is where we use our password encoder and overwrite the password with a hashed version
        return userRepository.save(newUser);
    }
}