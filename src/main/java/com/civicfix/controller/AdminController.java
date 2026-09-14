package com.civicfix.controller;

import com.civicfix.dto.AnalyticsDto;
import com.civicfix.dto.ApiResponse;
import com.civicfix.entity.AuditLog;
import com.civicfix.entity.Complaint;
import com.civicfix.entity.Department;
import com.civicfix.entity.Role;
import com.civicfix.entity.User;
import com.civicfix.entity.enums.RoleType;
import com.civicfix.exception.BadRequestException;
import com.civicfix.repository.AuditLogRepository;
import com.civicfix.repository.DepartmentRepository;
import com.civicfix.repository.RoleRepository;
import com.civicfix.repository.UserRepository;
import com.civicfix.security.UserPrincipal;
import com.civicfix.service.AnalyticsService;
import com.civicfix.service.AuditService;
import com.civicfix.service.ComplaintService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    @Autowired
    private AnalyticsService analyticsService;

    @Autowired
    private ComplaintService complaintService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private DepartmentRepository departmentRepository;

    @Autowired
    private AuditLogRepository auditLogRepository;

    @Autowired
    private AuditService auditService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @GetMapping("/analytics")
    public ResponseEntity<ApiResponse<AnalyticsDto>> getAnalytics() {
        AnalyticsDto data = analyticsService.getSystemAnalytics();
        return ResponseEntity.ok(ApiResponse.ok("System analytics loaded", data));
    }

    @GetMapping("/users")
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> getAllUsers() {
        List<User> users = userRepository.findAll();
        List<Map<String, Object>> result = users.stream().map(u -> {
            Map<String, Object> m = new HashMap<>();
            m.put("id", u.getId());
            m.put("fullName", u.getFullName());
            m.put("email", u.getEmail());
            m.put("phone", u.getPhone());
            m.put("role", u.getRole().getName().name());
            m.put("department", u.getDepartment() != null ? u.getDepartment().getName() : "N/A");
            m.put("isActive", u.getIsActive());
            m.put("isSuspended", u.getIsSuspended());
            m.put("city", u.getCity());
            m.put("area", u.getArea());
            return m;
        }).collect(Collectors.toList());

        return ResponseEntity.ok(ApiResponse.ok("Users retrieved", result));
    }

    @PostMapping("/users")
    public ResponseEntity<ApiResponse<Map<String, Object>>> createUser(
            @RequestBody Map<String, Object> req,
            @AuthenticationPrincipal UserPrincipal adminPrincipal) {
        String email = (String) req.get("email");
        if (userRepository.existsByEmail(email)) {
            throw new BadRequestException("User email already in use");
        }

        User user = new User();
        user.setFullName((String) req.get("fullName"));
        user.setEmail(email);
        user.setPhone((String) req.get("phone"));
        user.setPasswordHash(passwordEncoder.encode((String) req.get("password")));
        user.setCity((String) req.getOrDefault("city", "Metro City"));
        user.setArea((String) req.getOrDefault("area", "Central"));

        String roleStr = (String) req.get("role");
        Role role = roleRepository.findByName(RoleType.valueOf(roleStr))
                .orElseThrow(() -> new BadRequestException("Invalid role"));
        user.setRole(role);

        if (req.get("departmentId") != null) {
            Long deptId = Long.parseLong(req.get("departmentId").toString());
            Department dept = departmentRepository.findById(deptId).orElse(null);
            user.setDepartment(dept);
        }

        User saved = userRepository.save(user);

        auditService.log(adminPrincipal.getId(), adminPrincipal.getUsername(), "ADMIN_USER_CREATED", "USER",
                saved.getId().toString(), "Created user " + saved.getEmail() + " with role " + role.getName(), null);

        Map<String, Object> res = new HashMap<>();
        res.put("id", saved.getId());
        res.put("email", saved.getEmail());
        res.put("role", saved.getRole().getName().name());

        return ResponseEntity.ok(ApiResponse.ok("User created successfully", res));
    }

    @PutMapping("/users/{id}/toggle-status")
    public ResponseEntity<ApiResponse<String>> toggleUserStatus(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal adminPrincipal) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new BadRequestException("User not found"));

        user.setIsSuspended(!user.getIsSuspended());
        userRepository.save(user);

        String state = user.getIsSuspended() ? "suspended" : "activated";
        auditService.log(adminPrincipal.getId(), adminPrincipal.getUsername(), "USER_STATUS_TOGGLED", "USER",
                id.toString(), "User was " + state, null);

        return ResponseEntity.ok(ApiResponse.ok("User account has been " + state));
    }

    @GetMapping("/audit-logs")
    public ResponseEntity<ApiResponse<List<AuditLog>>> getAuditLogs() {
        List<AuditLog> logs = auditLogRepository.findTop50ByOrderByCreatedAtDesc();
        return ResponseEntity.ok(ApiResponse.ok("Audit logs loaded", logs));
    }

    @GetMapping("/complaints")
    public ResponseEntity<ApiResponse<List<Complaint>>> getAllComplaints() {
        List<Complaint> complaints = complaintService.getAllComplaints();
        return ResponseEntity.ok(ApiResponse.ok("All grievance complaints loaded", complaints));
    }

    @PostMapping("/complaints/{id}/resolve")
    public ResponseEntity<ApiResponse<Complaint>> resolveComplaint(
            @PathVariable Long id,
            @RequestBody Map<String, String> body,
            @AuthenticationPrincipal UserPrincipal adminPrincipal) {
        User admin = userRepository.findById(adminPrincipal.getId()).orElseThrow();
        String response = body.getOrDefault("adminResponse", "Issue reviewed and action taken by department head.");
        Complaint c = complaintService.resolveComplaint(id, response, admin);
        return ResponseEntity.ok(ApiResponse.ok("Complaint marked resolved", c));
    }
}
