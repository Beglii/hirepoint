package com.begli.hirepoint.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration //tells spring this class defines beans
public class SecurityConfig {

    @Bean //creating a password encoder bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder(); //one way password hashing method
    }

    @Bean //this controls what routes are permitted
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable()) //good to block CSRF due to hirepoint not being cookie based with JWT tokens
                .authorizeHttpRequests(auth -> auth
                        .anyRequest().permitAll() //temporary while building, will change later.
                );
        return http.build();
    }
}