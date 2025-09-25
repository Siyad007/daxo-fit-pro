package com.fitnessapp.fitness_api.service;

import com.fitnessapp.fitness_api.dto.LoginRequest;
import com.fitnessapp.fitness_api.dto.RegisterRequest;
import com.fitnessapp.fitness_api.entity.User;
import com.fitnessapp.fitness_api.repository.UserRepository;
import com.fitnessapp.fitness_api.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final UserService userService; // for daily calories

    // Register
    public User register(RegisterRequest req) {
        if (userRepository.findByEmail(req.getEmail()).isPresent()) {
            throw new RuntimeException("Email already registered");
        }

        User u = User.builder()
                .name(req.getName())
                .email(req.getEmail())
                .password(passwordEncoder.encode(req.getPassword()))
                .build();

        return userRepository.save(u);
    }

    // Login
    public String authenticate(LoginRequest req) {
        User u = userRepository.findByEmail(req.getEmail())
                .orElseThrow(() -> new RuntimeException("Invalid credentials"));

        if (!passwordEncoder.matches(req.getPassword(), u.getPassword())) {
            throw new RuntimeException("Invalid credentials");
        }

        return jwtService.generateToken(u);
    }
}
