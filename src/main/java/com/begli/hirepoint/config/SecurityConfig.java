package com.begli.hirepoint.config;

import com.begli.hirepoint.security.JwtAuthFilter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

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

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(List.of("http://localhost:5173",
                                                "https://hirepoint.dev")); //only requests from the vite dev server will be allowed
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE")); //allowed methods
        configuration.setAllowedHeaders(List.of("*")); //allowed any headers

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration); //enabling the whole API
        return source;
    }

    @Bean //this controls what routes are permitted
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable()) //good to block CSRF due to hirepoint not being cookie based with JWT tokens
                .cors(cors -> cors.configurationSource(corsConfigurationSource())) //wires the cors bean into the spring security filter
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/api/auth/**" , "/health").permitAll()
                        .anyRequest().authenticated()
                )
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class); //this inserts the custom filter into Spring Security's filter chain
        return http.build();
    }
}