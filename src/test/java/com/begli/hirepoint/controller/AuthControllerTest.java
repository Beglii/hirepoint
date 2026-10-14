package com.begli.hirepoint.controller;

import com.begli.hirepoint.config.SecurityConfig;
import com.begli.hirepoint.model.User;
import com.begli.hirepoint.repository.UserRepository;
import com.begli.hirepoint.security.JwtAuthFilter;
import com.begli.hirepoint.security.JwtUtil;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertNotEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

//starts only the web layer (these controllers plus the real security setup), the database is replaced by a mock
@WebMvcTest({AuthController.class, HealthController.class})
@Import({SecurityConfig.class, JwtUtil.class, JwtAuthFilter.class})
@TestPropertySource(properties = "jwt.secret=test-secret-key-that-is-long-enough-for-hs256-signing")
class AuthControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    @MockitoBean //a fake repository, each test decides what it returns
    private UserRepository userRepository;

    @Test
    void registerSavesTheUserWithAHashedPassword() throws Exception {
        when(userRepository.findByUsername("newuser")).thenReturn(Optional.empty());
        when(userRepository.save(any(User.class))).thenAnswer(call -> call.getArgument(0));

        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"username": "newuser", "password": "secret123"}
                                """))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.username").value("newuser"));

        //grab the user that was actually saved and check the password was hashed
        ArgumentCaptor<User> saved = ArgumentCaptor.forClass(User.class);
        verify(userRepository).save(saved.capture());
        assertNotEquals("secret123", saved.getValue().getPassword());
        assertTrue(passwordEncoder.matches("secret123", saved.getValue().getPassword()));
    }

    @Test
    void registerResponseDoesNotIncludeThePassword() throws Exception {
        when(userRepository.findByUsername("newuser")).thenReturn(Optional.empty());
        when(userRepository.save(any(User.class))).thenAnswer(call -> call.getArgument(0));

        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"username": "newuser", "password": "secret123"}
                                """))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.password").doesNotExist());
    }

    @Test
    void registerWithATakenUsernameReturnsConflictAndSavesNothing() throws Exception {
        User existing = new User("begli", passwordEncoder.encode("whatever"));
        when(userRepository.findByUsername("begli")).thenReturn(Optional.of(existing));

        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"username": "begli", "password": "secret123"}
                                """))
                .andExpect(status().isConflict());

        verify(userRepository, never()).save(any());
    }

    @Test
    void loginWithCorrectPasswordReturnsAValidToken() throws Exception {
        User existing = new User("begli", passwordEncoder.encode("correct-password"));
        when(userRepository.findByUsername("begli")).thenReturn(Optional.of(existing));

        String token = mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"username": "begli", "password": "correct-password"}
                                """))
                .andExpect(status().isOk())
                .andReturn().getResponse().getContentAsString();

        assertTrue(jwtUtil.isTokenValid(token));
    }

    @Test
    void loginWithWrongPasswordReturnsUnauthorized() throws Exception {
        User existing = new User("begli", passwordEncoder.encode("correct-password"));
        when(userRepository.findByUsername("begli")).thenReturn(Optional.of(existing));

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"username": "begli", "password": "wrong-password"}
                                """))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void loginWithUnknownUsernameReturnsUnauthorized() throws Exception {
        when(userRepository.findByUsername("nobody")).thenReturn(Optional.empty());

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"username": "nobody", "password": "anything"}
                                """))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void protectedEndpointWithoutATokenIsForbidden() throws Exception {
        mockMvc.perform(get("/api/applications"))
                .andExpect(status().isForbidden());
    }

    @Test
    void healthEndpointIsPublic() throws Exception {
        mockMvc.perform(get("/health"))
                .andExpect(status().isOk());
    }
}
