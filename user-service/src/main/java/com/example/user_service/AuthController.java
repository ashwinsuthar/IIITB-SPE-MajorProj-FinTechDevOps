package com.example.user_service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody AppUser user) {
        String username = user.getUsername();
        String password = user.getPassword();

        // Unique username check
        if (userRepository.existsByUsername(username)) {
            return ResponseEntity.badRequest().body(Map.of("message", "Username already exists"));
        }

        // Constraints: Min 6 chars, alphanumeric, no special characters
        if (password == null || password.length() < 6) {
            return ResponseEntity.badRequest().body(Map.of("message", "Password must be at least 6 characters"));
        }
        if (!password.matches("^[a-zA-Z0-9]+$")) {
            return ResponseEntity.badRequest().body(Map.of("message", "Password must be alphanumeric only (no special characters)"));
        }
        if (username == null || username.length() < 3) {
             return ResponseEntity.badRequest().body(Map.of("message", "Username too short"));
        }

        userRepository.save(user);
        return ResponseEntity.ok(Map.of("message", "Registration successful", "username", username));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AppUser user) {
        Optional<AppUser> existingUser = userRepository.findByUsername(user.getUsername());
        if (existingUser.isPresent() && existingUser.get().getPassword().equals(user.getPassword())) {
            return ResponseEntity.ok(Map.of("message", "Login successful", "username", user.getUsername()));
        }
        return ResponseEntity.status(401).body(Map.of("message", "Invalid credentials"));
    }
}
