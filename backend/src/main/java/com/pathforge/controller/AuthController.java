package com.pathforge.controller;

import com.pathforge.dto.AuthRequest;
import com.pathforge.entity.User;
import com.pathforge.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import jakarta.servlet.http.HttpSession;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired private UserRepository userRepository;
    @Autowired private PasswordEncoder passwordEncoder;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody AuthRequest request, HttpSession session) {
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Email already exists"));
        }
        User user = new User();
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        userRepository.save(user);
        
        session.setAttribute("USER_ID", user.getId());
        return ResponseEntity.ok(Map.of("message", "Registered successfully", "userId", user.getId()));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AuthRequest request, HttpSession session) {
        Optional<User> userOpt = userRepository.findByEmail(request.getEmail());
        if (userOpt.isPresent() && passwordEncoder.matches(request.getPassword(), userOpt.get().getPassword())) {
            session.setAttribute("USER_ID", userOpt.get().getId());
            return ResponseEntity.ok(Map.of("message", "Logged in successfully", "userId", userOpt.get().getId()));
        }
        return ResponseEntity.status(401).body(Map.of("error", "Invalid credentials"));
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpSession session) {
        session.invalidate();
        return ResponseEntity.ok(Map.of("message", "Logged out"));
    }

    @GetMapping("/me")
    public ResponseEntity<?> me(HttpSession session) {
        String userId = (String) session.getAttribute("USER_ID");
        if (userId != null) {
            Optional<User> userOpt = userRepository.findById(userId);
            if(userOpt.isPresent()) {
                return ResponseEntity.ok(Map.of("userId", userId, "email", userOpt.get().getEmail()));
            }
        }
        return ResponseEntity.status(401).body(Map.of("error", "Not authenticated"));
    }
}
