package com.begli.hirepoint.controller;

import com.begli.hirepoint.model.User;
import com.begli.hirepoint.repository.UserRepository;
import com.begli.hirepoint.security.JwtUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private static final Logger logger = LoggerFactory.getLogger(AuthController.class); //declaring logger

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public AuthController(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtUtil jwtUtil) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }

    @PostMapping("/register")
    public User register(@RequestBody User newUser) {
        if (userRepository.findByUsername(newUser.getUsername()).isPresent()) {
            logger.warn("Registration failed, username already taken: {}", newUser.getUsername());
            throw new RuntimeException("Username already taken");
        }

        newUser.setPassword(passwordEncoder.encode(newUser.getPassword()));
        User saved = userRepository.save(newUser);
        logger.info("New user registered: {}", saved.getUsername());
        return saved;
    }

    @PostMapping("/login")
    public String login(@RequestBody User loginRequest) { //reusing the user class for the JSON format shape
        User user = userRepository.findByUsername(loginRequest.getUsername())
                .orElseThrow(() -> { //since we need to log before returning the exception we need a different lambda shape
                    logger.warn("Login failed, username not found: {}", loginRequest.getUsername());
                    return new RuntimeException("Invalid username or password"); //good security practice to keep the error vague
                });

        if (!passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())) { //takes the password someone typed in, hashes it and compares that hash internally
            logger.warn("Login failed, incorrect password for username: {}", loginRequest.getUsername());
            throw new RuntimeException("Invalid username or password");
        }

        logger.info("Successful login for username: {}", loginRequest.getUsername());
        return jwtUtil.generateToken(user.getUsername()); //if we get past both of the safety checks then we can generate a token
    }
}