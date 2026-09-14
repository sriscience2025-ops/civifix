package com.civicfix.controller;

import com.civicfix.dto.ApiResponse;
import com.civicfix.dto.IssueResponse;
import com.civicfix.dto.StatusUpdateRequest;
import com.civicfix.entity.User;
import com.civicfix.entity.enums.IssueStatus;
import com.civicfix.repository.UserRepository;
import com.civicfix.security.UserPrincipal;
import com.civicfix.service.IssueService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/worker")
@PreAuthorize("hasAnyRole('FIELD_WORKER', 'ADMIN')")
public class WorkerController {

    @Autowired
    private IssueService issueService;

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/tasks")
    public ResponseEntity<ApiResponse<List<IssueResponse>>> getMyTasks(@AuthenticationPrincipal UserPrincipal principal) {
        User worker = userRepository.findById(principal.getId()).orElseThrow();
        List<IssueResponse> tasks = issueService.getWorkerIssues(worker);
        return ResponseEntity.ok(ApiResponse.ok("Worker assigned tasks loaded", tasks));
    }

    @PutMapping("/tasks/{id}/start")
    public ResponseEntity<ApiResponse<IssueResponse>> startTask(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal principal) {
        User worker = userRepository.findById(principal.getId()).orElseThrow();
        StatusUpdateRequest req = new StatusUpdateRequest();
        req.setStatus(IssueStatus.IN_PROGRESS);
        req.setReason("Worker " + worker.getFullName() + " started on-site inspection and repair work");

        IssueResponse res = issueService.updateIssueStatus(id, req, worker);
        return ResponseEntity.ok(ApiResponse.ok("Task marked in progress", res));
    }
}
