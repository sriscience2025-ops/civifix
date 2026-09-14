package com.civicfix.controller;

import com.civicfix.dto.ApiResponse;
import com.civicfix.dto.IssueResponse;
import com.civicfix.entity.Department;
import com.civicfix.entity.User;
import com.civicfix.repository.DepartmentRepository;
import com.civicfix.repository.UserRepository;
import com.civicfix.security.UserPrincipal;
import com.civicfix.service.IssueService;
import com.civicfix.service.WorkerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/officer")
@PreAuthorize("hasAnyRole('DEPARTMENT_OFFICER', 'ADMIN')")
public class OfficerController {

    @Autowired
    private IssueService issueService;

    @Autowired
    private WorkerService workerService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private DepartmentRepository departmentRepository;

    @GetMapping("/issues")
    public ResponseEntity<ApiResponse<List<IssueResponse>>> getDepartmentIssues(@AuthenticationPrincipal UserPrincipal principal) {
        User user = userRepository.findById(principal.getId()).orElseThrow();
        List<IssueResponse> issues;
        if (user.getDepartment() != null) {
            issues = issueService.getDepartmentIssues(user.getDepartment());
        } else {
            issues = issueService.getAllIssues();
        }
        return ResponseEntity.ok(ApiResponse.ok("Department issues loaded", issues));
    }

    @GetMapping("/workers")
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> getDepartmentWorkers(@AuthenticationPrincipal UserPrincipal principal) {
        User user = userRepository.findById(principal.getId()).orElseThrow();
        List<User> workers;
        if (user.getDepartment() != null) {
            workers = workerService.getWorkersByDepartment(user.getDepartment().getId());
        } else {
            workers = workerService.getAllWorkers();
        }

        List<Map<String, Object>> result = workers.stream().map(w -> {
            Map<String, Object> m = new HashMap<>();
            m.put("id", w.getId());
            m.put("fullName", w.getFullName());
            m.put("email", w.getEmail());
            m.put("phone", w.getPhone());
            m.put("department", w.getDepartment() != null ? w.getDepartment().getName() : "");
            return m;
        }).collect(Collectors.toList());

        return ResponseEntity.ok(ApiResponse.ok("Department workers loaded", result));
    }
}
