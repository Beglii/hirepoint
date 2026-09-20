package com.begli.hirepoint.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;

@Component //allows for jwt to be injectable anywhere via constructor
public class JwtUtil {

    private final SecretKey secretKey;
    private final long expirationMs = 1000 * 60 * 60; //token lasts for 1 hour

    public JwtUtil(@Value("${jwt.secret}") String secret) { //injects this value to the placeholder in application.properties
        this.secretKey = Keys.hmacShaKeyFor(secret.getBytes());
    }

    public String generateToken(String username) {
        return Jwts.builder()
                .subject(username)
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + expirationMs)) //when the token stops being valid
                .signWith(secretKey)
                .compact(); //outputs the final string with the header.payload.signature
    }

    public String extractUsername(String token) { //finding out who the request was from
        return parseClaims(token).getSubject();
    }

    public boolean isTokenValid(String token) { //2 checks we do
        try {
            Claims claims = parseClaims(token); //the parse claims method below, checking if the token is valid
            return claims.getExpiration().after(new Date());//check to see if the token is expired
        } catch (Exception e) {
            return false;
        }
    }

    private Claims parseClaims(String token) {
        return Jwts.parser()
                .verifyWith(secretKey) //checks the token's signature
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }
}