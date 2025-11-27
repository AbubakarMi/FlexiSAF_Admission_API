package com.flexisaf.admissions.controller;

import com.flexisaf.admissions.entity.User;
import com.flexisaf.admissions.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@Slf4j
public class AdminController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @PostMapping("/create-reviewer")
    public ResponseEntity<?> createReviewer(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        String password = request.get("password");

        log.info("Creating reviewer account: {}", email);

        // Delete existing reviewer if exists
        userRepository.findByEmail(email).ifPresent(user -> {
            log.info("Deleting existing user: {}", email);
            userRepository.delete(user);
        });

        // Create new reviewer user
        User reviewer = User.builder()
                .email(email)
                .password(passwordEncoder.encode(password))
                .firstName("Admin")
                .lastName("Reviewer")
                .role(User.UserRole.REVIEWER)
                .build();

        User savedReviewer = userRepository.save(reviewer);

        log.info("Reviewer created successfully: {}", email);

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Reviewer account created successfully");
        response.put("email", savedReviewer.getEmail());
        response.put("role", savedReviewer.getRole().name());

        return ResponseEntity.ok(response);
    }
}
