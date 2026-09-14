package com.civicfix.controller;

import com.civicfix.dto.*;
import com.civicfix.entity.User;
import com.civicfix.repository.UserRepository;
import com.civicfix.security.UserPrincipal;
import com.civicfix.service.IssueService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/issues")
public class IssueController {

    @Autowired
    private IssueService issueService;

    @Autowired
    private UserRepository userRepository;

    @PostMapping
    @PreAuthorize("hasAnyRole('CITIZEN', 'ADMIN')")
    public ResponseEntity<ApiResponse<IssueResponse>> reportIssue(
            @Valid @RequestBody IssueRequest request,
            @AuthenticationPrincipal UserPrincipal principal) {
        User user = userRepository.findById(principal.getId()).orElseThrow();
        IssueResponse response = issueService.createIssue(request, user);
        return ResponseEntity.ok(ApiResponse.ok("Issue submitted successfully with ticket #" + response.getTicketNumber(), response));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<IssueResponse>> getIssueById(@PathVariable Long id) {
        IssueResponse response = issueService.getIssueResponseById(id);
        return ResponseEntity.ok(ApiResponse.ok("Issue details loaded", response));
    }

    @GetMapping("/track/{ticketNumber}")
    public ResponseEntity<ApiResponse<IssueResponse>> trackIssue(@PathVariable String ticketNumber) {
        IssueResponse response = issueService.getIssueByTicketNumber(ticketNumber);
        return ResponseEntity.ok(ApiResponse.ok("Issue found", response));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<IssueResponse>>> getAllIssues() {
        List<IssueResponse> issues = issueService.getAllIssues();
        return ResponseEntity.ok(ApiResponse.ok("Issues retrieved", issues));
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasAnyRole('DEPARTMENT_OFFICER', 'ADMIN')")
    public ResponseEntity<ApiResponse<IssueResponse>> updateStatus(
            @PathVariable Long id,
            @Valid @RequestBody StatusUpdateRequest request,
            @AuthenticationPrincipal UserPrincipal principal) {
        User user = userRepository.findById(principal.getId()).orElseThrow();
        IssueResponse response = issueService.updateIssueStatus(id, request, user);
        return ResponseEntity.ok(ApiResponse.ok("Issue status updated successfully", response));
    }

    @PostMapping("/{id}/assign")
    @PreAuthorize("hasAnyRole('DEPARTMENT_OFFICER', 'ADMIN')")
    public ResponseEntity<ApiResponse<IssueResponse>> assignWorker(
            @PathVariable Long id,
            @Valid @RequestBody WorkerAssignmentRequest request,
            @AuthenticationPrincipal UserPrincipal principal) {
        User officer = userRepository.findById(principal.getId()).orElseThrow();
        IssueResponse response = issueService.assignWorker(id, request, officer);
        return ResponseEntity.ok(ApiResponse.ok("Worker assigned successfully", response));
    }

    @PostMapping("/{id}/proof")
    @PreAuthorize("hasAnyRole('FIELD_WORKER', 'ADMIN')")
    public ResponseEntity<ApiResponse<IssueResponse>> uploadProof(
            @PathVariable Long id,
            @Valid @RequestBody ProofUploadRequest request,
            @AuthenticationPrincipal UserPrincipal principal) {
        User worker = userRepository.findById(principal.getId()).orElseThrow();
        IssueResponse response = issueService.uploadResolutionProof(id, request, worker);
        return ResponseEntity.ok(ApiResponse.ok("Resolution proofs submitted. Verification requested from citizen.", response));
    }

    @PostMapping("/{id}/verify")
    @PreAuthorize("hasAnyRole('CITIZEN', 'ADMIN')")
    public ResponseEntity<ApiResponse<IssueResponse>> verifyResolution(
            @PathVariable Long id,
            @RequestBody VerificationRequest request,
            @AuthenticationPrincipal UserPrincipal principal) {
        User citizen = userRepository.findById(principal.getId()).orElseThrow();
        IssueResponse response = issueService.verifyIssue(id, request, citizen);
        String msg = request.isResolved() ? "Issue verified and closed. Thank you!" : "Issue reopened for officer review.";
        return ResponseEntity.ok(ApiResponse.ok(msg, response));
    }

    @PostMapping("/{id}/follow")
    public ResponseEntity<ApiResponse<Void>> followIssue(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal principal) {
        User user = userRepository.findById(principal.getId()).orElseThrow();
        issueService.followIssue(id, user);
        return ResponseEntity.ok(ApiResponse.ok("You are now following this issue for status updates"));
    }

    @DeleteMapping("/{id}/follow")
    public ResponseEntity<ApiResponse<Void>> unfollowIssue(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal principal) {
        User user = userRepository.findById(principal.getId()).orElseThrow();
        issueService.unfollowIssue(id, user);
        return ResponseEntity.ok(ApiResponse.ok("You unfollowed this issue"));
    }

    @GetMapping("/{id}/follow-status")
    public ResponseEntity<ApiResponse<Map<String, Boolean>>> getFollowStatus(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal principal) {
        boolean following = false;
        if (principal != null) {
            User user = userRepository.findById(principal.getId()).orElse(null);
            if (user != null) {
                following = issueService.isFollowing(id, user);
            }
        }
        Map<String, Boolean> map = new HashMap<>();
        map.put("isFollowing", following);
        return ResponseEntity.ok(ApiResponse.ok("Follow status", map));
    }
}
