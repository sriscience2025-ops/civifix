package com.civicfix.controller;

import com.civicfix.dto.ApiResponse;
import com.civicfix.dto.AuthRequest;
import com.civicfix.dto.AuthResponse;
import com.civicfix.dto.RegisterRequest;
import com.civicfix.entity.User;
import com.civicfix.repository.UserRepository;
import com.civicfix.security.UserPrincipal;
import com.civicfix.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<AuthResponse>> register(@Valid @RequestBody RegisterRequest request) {
        AuthResponse response = authService.registerCitizen(request);
        return ResponseEntity.ok(ApiResponse.ok("Registration successful. Welcome to CivicFix!", response));
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthResponse>> login(@Valid @RequestBody AuthRequest request) {
        AuthResponse response = authService.login(request);
        return ResponseEntity.ok(ApiResponse.ok("Login successful", response));
    }

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getCurrentUser(@AuthenticationPrincipal UserPrincipal currentUser) {
        if (currentUser == null) {
            return ResponseEntity.status(401).body(ApiResponse.error("Not authenticated"));
        }
        User user = userRepository.findById(currentUser.getId()).orElse(null);
        if (user == null) {
            return ResponseEntity.status(404).body(ApiResponse.error("User not found"));
        }

        Map<String, Object> data = new HashMap<>();
        data.put("id", user.getId());
        data.put("email", user.getEmail());
        data.put("fullName", user.getFullName());
        data.put("phone", user.getPhone());
        data.put("role", user.getRole().getName().name());
        data.put("city", user.getCity());
        data.put("area", user.getArea());
        if (user.getDepartment() != null) {
            data.put("departmentId", user.getDepartment().getId());
            data.put("departmentName", user.getDepartment().getName());
        }

        return ResponseEntity.ok(ApiResponse.ok("User details retrieved", data));
    }
}
