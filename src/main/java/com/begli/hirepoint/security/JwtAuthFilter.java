package com.begli.hirepoint.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Collections;

@Component
public class JwtAuthFilter extends OncePerRequestFilter { //this guarantees the logic runs exactly once per HTTP request

    private final JwtUtil jwtUtil;

    public JwtAuthFilter(JwtUtil jwtUtil) {
        this.jwtUtil = jwtUtil;
    }

    @Override
    protected void doFilterInternal(@NonNull HttpServletRequest request,
                                    @NonNull HttpServletResponse response,
                                    @NonNull FilterChain filterChain) throws ServletException, IOException {

        String authHeader = request.getHeader("Authorization"); //standard header for an HTTP header

        if (authHeader != null && authHeader.startsWith("Bearer ")) { //if the header exists
            String token = authHeader.substring(7); //strip off the Bearer (7 characters including the space)

            if (jwtUtil.isTokenValid(token)) {
                String username = jwtUtil.extractUsername(token);//using our validation method, if it passes we pull the username

                UsernamePasswordAuthenticationToken authToken = //despite the name no password is passed through
                        new UsernamePasswordAuthenticationToken(username, null, Collections.emptyList()); //third argument irrelevant for now, have not implemented roles yet

                SecurityContextHolder.getContext().setAuthentication(authToken); //this method will allow controllers to ask who is making the request
            }
        }

        filterChain.doFilter(request, response); //this passes the control to the next filter in the chain. important for it to be outside the if statement
    }
}