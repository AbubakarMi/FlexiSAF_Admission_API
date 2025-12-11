package com.flexisaf.admissions.service;

import com.flexisaf.admissions.dto.LoginRequest;
import com.flexisaf.admissions.dto.LoginResponse;
import com.flexisaf.admissions.dto.RegisterRequest;
import com.flexisaf.admissions.dto.RegisterResponse;
import com.flexisaf.admissions.entity.Applicant;
import com.flexisaf.admissions.entity.User;
import com.flexisaf.admissions.exception.ResourceNotFoundException;
import com.flexisaf.admissions.repository.ApplicantRepository;
import com.flexisaf.admissions.repository.UserRepository;
import com.flexisaf.admissions.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider tokenProvider;
    private final UserRepository userRepository;
    private final ApplicantRepository applicantRepository;
    private final PasswordEncoder passwordEncoder;

    @Transactional(readOnly = true)
    public LoginResponse login(LoginRequest loginRequest) {
        log.info("Attempting login for user: {}", loginRequest.getEmail());

        // Authenticate user
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginRequest.getEmail(),
                        loginRequest.getPassword()
                )
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);

        // Generate JWT token
        String token = tokenProvider.generateToken(authentication);

        // Fetch user details
        User user = userRepository.findByEmail(loginRequest.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        log.info("User {} logged in successfully", loginRequest.getEmail());

        return LoginResponse.builder()
                .token(token)
                .type("Bearer")
                .email(user.getEmail())
                .role(user.getRole().name())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .build();
    }

    @Transactional
    public RegisterResponse register(RegisterRequest registerRequest) {
        log.info("Attempting to register new student: {}", registerRequest.getEmail());

        // Check if email already exists
        if (userRepository.findByEmail(registerRequest.getEmail()).isPresent()) {
            throw new IllegalArgumentException("Email already registered");
        }

        // Create new student user
        User user = User.builder()
                .email(registerRequest.getEmail())
                .password(passwordEncoder.encode(registerRequest.getPassword()))
                .firstName(registerRequest.getFirstName())
                .lastName(registerRequest.getLastName())
                .role(User.UserRole.STUDENT)
                .build();

        User savedUser = userRepository.save(user);

        // Don't create Applicant record here - it should be created when they submit their application

        log.info("Student registered successfully: {} with name: {} {}",
                savedUser.getEmail(),
                registerRequest.getFirstName(), registerRequest.getLastName());

        return RegisterResponse.builder()
                .id(savedUser.getId())
                .email(savedUser.getEmail())
                .role(savedUser.getRole().name())
                .message("Registration successful! You can now log in.")
                .build();
    }
}
