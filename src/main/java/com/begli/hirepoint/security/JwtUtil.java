package com.begli.hirepoint.security;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;

@Component //allows for jwt to be injectable anywhere via constructor
public class JwtUtil {

    private final SecretKey secretKey = Keys.hmacShaKeyFor( //wrap the secret key to bytes using the HMAC SHA
            "this-is-a-placeholder-secret-key-change-this-later-12345".getBytes()
    );

    private final long expirationMs = 1000 * 60 * 60; //token lasts for 1 hour

    public String generateToken(String username) {
        return Jwts.builder()
                .subject(username)
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + expirationMs)) //when the token stops being valid
                .signWith(secretKey)
                .compact(); //outputs the final string with the header.payload.signature
    }
}