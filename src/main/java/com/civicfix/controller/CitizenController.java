package com.civicfix.controller;

import com.civicfix.dto.ApiResponse;
import com.civicfix.dto.ComplaintRequest;
import com.civicfix.dto.IssueResponse;
import com.civicfix.entity.Complaint;
import com.civicfix.entity.User;
import com.civicfix.repository.UserRepository;
import com.civicfix.security.UserPrincipal;
import com.civicfix.service.ComplaintService;
import com.civicfix.service.IssueService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/citizen")
@PreAuthorize("hasAnyRole('CITIZEN', 'ADMIN')")
public class CitizenController {

    @Autowired
    private IssueService issueService;

    @Autowired
    private ComplaintService complaintService;

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/issues")
    public ResponseEntity<ApiResponse<List<IssueResponse>>> getCitizenIssues(@AuthenticationPrincipal UserPrincipal principal) {
        User citizen = userRepository.findById(principal.getId()).orElseThrow();
        List<IssueResponse> issues = issueService.getCitizenIssues(citizen);
        return ResponseEntity.ok(ApiResponse.ok("Citizen issues retrieved", issues));
    }

    @GetMapping("/complaints")
    public ResponseEntity<ApiResponse<List<Complaint>>> getCitizenComplaints(@AuthenticationPrincipal UserPrincipal principal) {
        User citizen = userRepository.findById(principal.getId()).orElseThrow();
        List<Complaint> complaints = complaintService.getCitizenComplaints(citizen);
        return ResponseEntity.ok(ApiResponse.ok("Citizen complaints retrieved", complaints));
    }

    @PostMapping("/complaints")
    public ResponseEntity<ApiResponse<Complaint>> fileComplaint(
            @Valid @RequestBody ComplaintRequest request,
            @AuthenticationPrincipal UserPrincipal principal) {
        User citizen = userRepository.findById(principal.getId()).orElseThrow();
        Complaint complaint = complaintService.fileComplaint(request, citizen);
        return ResponseEntity.ok(ApiResponse.ok("Grievance complaint filed successfully", complaint));
    }

    @PostMapping("/issues/{id}/follow")
    public ResponseEntity<ApiResponse<Void>> followIssue(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal principal) {
        User user = userRepository.findById(principal.getId()).orElseThrow();
        issueService.followIssue(id, user);
        return ResponseEntity.ok(ApiResponse.ok("You are now following this issue for status updates"));
    }

    @DeleteMapping("/issues/{id}/follow")
    public ResponseEntity<ApiResponse<Void>> unfollowIssue(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal principal) {
        User user = userRepository.findById(principal.getId()).orElseThrow();
        issueService.unfollowIssue(id, user);
        return ResponseEntity.ok(ApiResponse.ok("You unfollowed this issue"));
    }
}
