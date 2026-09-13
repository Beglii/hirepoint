package com.begli.hirepoint.config;

import com.begli.hirepoint.security.JwtAuthFilter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration //tells spring this class defines beans
public class SecurityConfig {

    private final JwtAuthFilter jwtAuthFilter;

    public SecurityConfig(JwtAuthFilter jwtAuthFilter) { //using constructor injection we allow security config to use JwtAuthFilter
        this.jwtAuthFilter = jwtAuthFilter;
    }

    @Bean //creating a password encoder bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder(); //one way password hashing method
    }

    @Bean //this controls what routes are permitted
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable()) //good to block CSRF due to hirepoint not being cookie based with JWT tokens
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/api/auth/**").permitAll()
                        .anyRequest().authenticated()
                )
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class); //this inserts the custom filter into Spring Security's filter chain
        return http.build();
    }
}