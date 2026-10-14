package com.begli.hirepoint.security;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.junit.jupiter.api.Test;

import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.util.Date;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

class JwtUtilTest {

    //a made up secret just for these tests, the real one lives in the server's .env
    private static final String SECRET = "test-secret-key-that-is-long-enough-for-hs256-signing";

    private final JwtUtil jwtUtil = new JwtUtil(SECRET);

    @Test
    void generatedTokenContainsTheUsername() {
        String token = jwtUtil.generateToken("begli");

        String username = jwtUtil.extractUsername(token);

        assertEquals("begli", username);
    }

    @Test
    void freshTokenIsValid() {
        String token = jwtUtil.generateToken("begli");

        assertTrue(jwtUtil.isTokenValid(token));
    }

    @Test
    void tamperedTokenIsRejected() {
        String token = jwtUtil.generateToken("begli");

        //a token is header.payload.signature, so swap the username inside the payload
        //to pretend to be someone else while keeping the original signature
        String[] parts = token.split("\\.");
        String payload = new String(Base64.getUrlDecoder().decode(parts[1]), StandardCharsets.UTF_8);
        String forgedPayload = payload.replace("\"begli\"", "\"someone-else\"");
        String encodedForgedPayload = Base64.getUrlEncoder().withoutPadding()
                .encodeToString(forgedPayload.getBytes(StandardCharsets.UTF_8));
        String tampered = parts[0] + "." + encodedForgedPayload + "." + parts[2];

        assertFalse(jwtUtil.isTokenValid(tampered));
    }

    @Test
    void tokenSignedWithADifferentSecretIsRejected() {
        JwtUtil otherServer = new JwtUtil("a-completely-different-secret-that-is-also-long-enough");
        String tokenFromOtherServer = otherServer.generateToken("begli");

        assertFalse(jwtUtil.isTokenValid(tokenFromOtherServer));
    }

    @Test
    void expiredTokenIsRejected() {
        //build a token with the same secret but an expiry time that has already passed
        String expiredToken = Jwts.builder()
                .subject("begli")
                .issuedAt(new Date(System.currentTimeMillis() - 2 * 60 * 60 * 1000))
                .expiration(new Date(System.currentTimeMillis() - 60 * 60 * 1000))
                .signWith(Keys.hmacShaKeyFor(SECRET.getBytes()))
                .compact();

        assertFalse(jwtUtil.isTokenValid(expiredToken));
    }

    @Test
    void garbageStringIsRejected() {
        assertFalse(jwtUtil.isTokenValid("not-a-real-token"));
    }
}
