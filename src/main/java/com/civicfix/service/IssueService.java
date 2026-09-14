package com.civicfix.service;

import com.civicfix.dto.*;
import com.civicfix.entity.*;
import com.civicfix.entity.enums.*;
import com.civicfix.exception.BadRequestException;
import com.civicfix.exception.InvalidStatusTransitionException;
import com.civicfix.exception.ResourceNotFoundException;
import com.civicfix.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;
import java.util.stream.Collectors;

@Service
public class IssueService {

    @Autowired
    private IssueRepository issueRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private DepartmentRepository departmentRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private LocationRepository locationRepository;

    @Autowired
    private IssueImageRepository issueImageRepository;

    @Autowired
    private IssueStatusHistoryRepository statusHistoryRepository;

    @Autowired
    private IssueAssignmentRepository assignmentRepository;

    @Autowired
    private IssueFollowerRepository followerRepository;

    @Autowired
    private FeedbackRepository feedbackRepository;

    @Autowired
    private NotificationService notificationService;

    @Autowired
    private AuditService auditService;

    @Transactional
    public IssueResponse createIssue(IssueRequest req, User citizen) {
        if (req.getLatitude() == null || req.getLongitude() == null) {
            throw new BadRequestException("Valid geographic coordinates are required");
        }

        IssueCategory category = categoryRepository.findById(req.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Selected category not found"));

        Department department = category.getDepartment();

        // 1. Create Location
        Location location = new Location(
                req.getLatitude(),
                req.getLongitude(),
                req.getAddress(),
                req.getArea(),
                req.getCity(),
                req.getLandmark()
        );
        Location savedLocation = locationRepository.save(location);

        // 2. Generate unique Ticket Number
        String ticketNumber = "CF-" + LocalDateTime.now().getYear() + "-" + (1000 + new Random().nextInt(9000));

        // 3. Create Issue
        Issue issue = new Issue();
        issue.setTicketNumber(ticketNumber);
        issue.setCitizen(citizen);
        issue.setCategory(category);
        issue.setDepartment(department);
        issue.setLocation(savedLocation);
        issue.setTitle(req.getTitle().trim());
        issue.setDescription(req.getDescription().trim());
        issue.setSubcategory(req.getSubcategory());
        issue.setStatus(IssueStatus.SUBMITTED);
        issue.setPriority(req.getPriority() != null ? req.getPriority() : category.getDefaultPriority());
        issue.setSeverity(req.getSeverity() != null ? req.getSeverity() : Severity.MEDIUM);
        issue.setTargetDeadline(LocalDateTime.now().plusDays(category.getDefaultResolutionDays()));
        issue.setInternalNotes(req.getAdditionalNotes());

        Issue savedIssue = issueRepository.save(issue);

        // 4. Save Photo if provided
        if (req.getPhotoUrl() != null && !req.getPhotoUrl().isBlank()) {
            IssueImage image = new IssueImage();
            image.setIssue(savedIssue);
            image.setImageUrl(req.getPhotoUrl());
            image.setImageType(ImageType.CITIZEN_SUBMISSION);
            image.setUploadedBy(citizen);
            image.setCaption("Citizen Report Photo: " + savedIssue.getTitle());
            issueImageRepository.save(image);
        }

        // 5. Record Initial Status History
        IssueStatusHistory history = new IssueStatusHistory(savedIssue, null, "SUBMITTED", citizen, "Issue submitted by citizen");
        statusHistoryRepository.save(history);

        // 6. Notify Citizen
        notificationService.notifyUser(citizen, savedIssue, "Issue Submitted Successfully",
                "Your civic report #" + ticketNumber + " has been logged and routed to " + department.getName(),
                "ISSUE_SUBMITTED");

        // 7. Notify Department Officers
        List<User> officers = userRepository.findByDepartmentAndRole(department, null);
        for (User officer : officers) {
            notificationService.notifyUser(officer, savedIssue, "New Department Issue Reported",
                    "New issue #" + ticketNumber + " (" + savedIssue.getPriority() + ") requires review.",
                    "OFFICER_NEW_ISSUE");
        }

        // 8. Audit Log
        auditService.log(citizen.getId(), citizen.getEmail(), "ISSUE_CREATED", "ISSUE", savedIssue.getId().toString(),
                "Reported issue: " + savedIssue.getTitle(), null);

        return mapToResponse(savedIssue);
    }

    public IssueResponse getIssueResponseById(Long issueId) {
        Issue issue = issueRepository.findById(issueId)
                .orElseThrow(() -> new ResourceNotFoundException("Issue not found with id: " + issueId));
        return mapToResponse(issue);
    }

    public IssueResponse getIssueByTicketNumber(String ticketNumber) {
        Issue issue = issueRepository.findByTicketNumber(ticketNumber.trim().toUpperCase())
                .orElseThrow(() -> new ResourceNotFoundException("No civic issue found matching ticket #" + ticketNumber));
        return mapToResponse(issue);
    }

    public List<IssueResponse> getCitizenIssues(User citizen) {
        return issueRepository.findByCitizen(citizen).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<IssueResponse> getDepartmentIssues(Department department) {
        return issueRepository.findByDepartment(department).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<IssueResponse> getWorkerIssues(User worker) {
        return issueRepository.findByAssignedWorker(worker).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<IssueResponse> getAllIssues() {
        return issueRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public IssueResponse updateIssueStatus(Long issueId, StatusUpdateRequest req, User user) {
        Issue issue = issueRepository.findById(issueId)
                .orElseThrow(() -> new ResourceNotFoundException("Issue not found"));

        IssueStatus current = issue.getStatus();
        IssueStatus next = req.getStatus();

        if (current == next) {
            return mapToResponse(issue);
        }

        // Validate state transitions
        if (!current.isValidNextStatus(next)) {
            throw new InvalidStatusTransitionException("Cannot transition from " + current + " to " + next);
        }

        issue.setStatus(next);

        if (req.getPriority() != null) {
            issue.setPriority(req.getPriority());
        }

        if (req.getDepartmentId() != null) {
            Department newDept = departmentRepository.findById(req.getDepartmentId())
                    .orElseThrow(() -> new ResourceNotFoundException("Department not found"));
            issue.setDepartment(newDept);
        }

        if (req.getDeadline() != null) {
            issue.setTargetDeadline(req.getDeadline());
        }

        if (req.getInternalNotes() != null) {
            issue.setInternalNotes(req.getInternalNotes());
        }

        if (next == IssueStatus.RESOLVED) {
            issue.setResolvedAt(LocalDateTime.now());
        } else if (next == IssueStatus.CLOSED) {
            issue.setClosedAt(LocalDateTime.now());
        }

        Issue updatedIssue = issueRepository.save(issue);

        // Record history
        IssueStatusHistory history = new IssueStatusHistory(
                updatedIssue,
                current.name(),
                next.name(),
                user,
                req.getReason() != null ? req.getReason() : "Status changed by " + user.getFullName()
        );
        statusHistoryRepository.save(history);

        // Notify citizen
        notificationService.notifyUser(issue.getCitizen(), updatedIssue, "Issue Status Updated",
                "Your issue #" + issue.getTicketNumber() + " is now " + next.name().replace('_', ' '),
                "STATUS_UPDATE");

        // Notify followers
        List<IssueFollower> followers = followerRepository.findByIssue(updatedIssue);
        for (IssueFollower f : followers) {
            if (!f.getUser().getId().equals(issue.getCitizen().getId())) {
                notificationService.notifyUser(f.getUser(), updatedIssue, "Followed Issue Update",
                        "Issue #" + issue.getTicketNumber() + " status updated to " + next.name(),
                        "FOLLOWER_UPDATE");
            }
        }

        auditService.log(user.getId(), user.getEmail(), "STATUS_CHANGE", "ISSUE", issue.getId().toString(),
                "Transitioned status from " + current + " to " + next, null);

        return mapToResponse(updatedIssue);
    }

    @Transactional
    public IssueResponse assignWorker(Long issueId, WorkerAssignmentRequest req, User officer) {
        Issue issue = issueRepository.findById(issueId)
                .orElseThrow(() -> new ResourceNotFoundException("Issue not found"));

        User worker = userRepository.findById(req.getWorkerId())
                .orElseThrow(() -> new ResourceNotFoundException("Worker not found"));

        issue.setAssignedWorker(worker);
        issue.setAssignedOfficer(officer);
        issue.setStatus(IssueStatus.ASSIGNED);

        if (req.getDeadline() != null) {
            issue.setTargetDeadline(req.getDeadline());
        }

        Issue updated = issueRepository.save(issue);

        IssueAssignment assignment = new IssueAssignment();
        assignment.setIssue(updated);
        assignment.setAssignedBy(officer);
        assignment.setWorker(worker);
        assignment.setInstructions(req.getInstructions());
        assignment.setDeadline(req.getDeadline() != null ? req.getDeadline() : updated.getTargetDeadline());
        assignmentRepository.save(assignment);

        // History
        statusHistoryRepository.save(new IssueStatusHistory(updated, IssueStatus.UNDER_REVIEW.name(), IssueStatus.ASSIGNED.name(),
                officer, "Worker " + worker.getFullName() + " assigned to task"));

        // Notifications
        notificationService.notifyUser(worker, updated, "New Task Assignment",
                "You have been assigned to #" + updated.getTicketNumber() + ": " + updated.getTitle(),
                "WORKER_ASSIGNMENT");

        notificationService.notifyUser(updated.getCitizen(), updated, "Field Worker Dispatched",
                "Worker " + worker.getFullName() + " has been assigned to resolve your issue.",
                "CITIZEN_UPDATE");

        auditService.log(officer.getId(), officer.getEmail(), "WORKER_ASSIGNED", "ISSUE", issue.getId().toString(),
                "Assigned worker " + worker.getFullName() + " to issue #" + issue.getTicketNumber(), null);

        return mapToResponse(updated);
    }

    @Transactional
    public IssueResponse uploadResolutionProof(Long issueId, ProofUploadRequest req, User worker) {
        Issue issue = issueRepository.findById(issueId)
                .orElseThrow(() -> new ResourceNotFoundException("Issue not found"));

        // Save Before proof
        IssueImage beforeImg = new IssueImage();
        beforeImg.setIssue(issue);
        beforeImg.setImageUrl(req.getBeforePhotoUrl());
        beforeImg.setImageType(ImageType.BEFORE_PROOF);
        beforeImg.setUploadedBy(worker);
        beforeImg.setCaption("Before Work: " + req.getResolutionDescription());
        issueImageRepository.save(beforeImg);

        // Save After proof
        IssueImage afterImg = new IssueImage();
        afterImg.setIssue(issue);
        afterImg.setImageUrl(req.getAfterPhotoUrl());
        afterImg.setImageType(ImageType.AFTER_PROOF);
        afterImg.setUploadedBy(worker);
        afterImg.setCaption("After Work Proof: " + req.getResolutionDescription());
        issueImageRepository.save(afterImg);

        issue.setStatus(IssueStatus.VERIFICATION_PENDING);
        issue.setResolvedAt(LocalDateTime.now());
        Issue updated = issueRepository.save(issue);

        statusHistoryRepository.save(new IssueStatusHistory(updated, IssueStatus.IN_PROGRESS.name(),
                IssueStatus.VERIFICATION_PENDING.name(), worker, "Work finished. Proof uploaded: " + req.getResolutionDescription()));

        notificationService.notifyUser(issue.getCitizen(), updated, "Your Issue Has Been Marked Resolved",
                "Worker " + worker.getFullName() + " completed work. Please inspect and confirm resolution.",
                "VERIFICATION_PENDING");

        auditService.log(worker.getId(), worker.getEmail(), "PROOF_UPLOADED", "ISSUE", issue.getId().toString(),
                "Worker uploaded before/after proofs and marked verification pending", null);

        return mapToResponse(updated);
    }

    @Transactional
    public IssueResponse verifyIssue(Long issueId, VerificationRequest req, User citizen) {
        Issue issue = issueRepository.findById(issueId)
                .orElseThrow(() -> new ResourceNotFoundException("Issue not found"));

        if (!issue.getCitizen().getId().equals(citizen.getId())) {
            throw new BadRequestException("Only the citizen who reported this issue can verify resolution.");
        }

        if (issue.getStatus() != IssueStatus.VERIFICATION_PENDING && issue.getStatus() != IssueStatus.RESOLVED) {
            throw new BadRequestException("Issue is not currently pending verification.");
        }

        if (req.isResolved()) {
            issue.setStatus(IssueStatus.CLOSED);
            issue.setClosedAt(LocalDateTime.now());
            if (req.getRating() != null) {
                issue.setCitizenFeedbackRating(req.getRating());
                Feedback fb = new Feedback();
                fb.setIssue(issue);
                fb.setCitizen(citizen);
                fb.setRating(req.getRating());
                fb.setComments(req.getFeedbackComments());
                feedbackRepository.save(fb);
            }
            Issue updated = issueRepository.save(issue);

            statusHistoryRepository.save(new IssueStatusHistory(updated, IssueStatus.VERIFICATION_PENDING.name(),
                    IssueStatus.CLOSED.name(), citizen, "Citizen confirmed issue is resolved cleanly."));

            notificationService.notifyUser(citizen, updated, "Issue Closed",
                    "Thank you for confirming resolution of #" + updated.getTicketNumber(), "ISSUE_CLOSED");

            auditService.log(citizen.getId(), citizen.getEmail(), "ISSUE_VERIFIED_CLOSED", "ISSUE", issue.getId().toString(),
                    "Citizen verified and closed issue", null);

            return mapToResponse(updated);
        } else {
            // Reopen
            issue.setStatus(IssueStatus.REOPENED);
            issue.setReopenCount(issue.getReopenCount() + 1);
            issue.setReopenReason(req.getReopenReason());
            Issue updated = issueRepository.save(issue);

            statusHistoryRepository.save(new IssueStatusHistory(updated, IssueStatus.VERIFICATION_PENDING.name(),
                    IssueStatus.REOPENED.name(), citizen, "Citizen reopened issue: " + req.getReopenReason()));

            // Notify officer
            if (issue.getAssignedOfficer() != null) {
                notificationService.notifyUser(issue.getAssignedOfficer(), updated, "Issue Reopened by Citizen",
                        "Issue #" + updated.getTicketNumber() + " was reopened: " + req.getReopenReason(),
                        "ISSUE_REOPENED");
            }

            auditService.log(citizen.getId(), citizen.getEmail(), "ISSUE_REOPENED", "ISSUE", issue.getId().toString(),
                    "Citizen reopened issue with reason: " + req.getReopenReason(), null);

            return mapToResponse(updated);
        }
    }

    @Transactional
    public void followIssue(Long issueId, User user) {
        Issue issue = issueRepository.findById(issueId)
                .orElseThrow(() -> new ResourceNotFoundException("Issue not found"));

        if (!followerRepository.existsByIssueAndUser(issue, user)) {
            followerRepository.save(new IssueFollower(issue, user));
            auditService.log(user.getId(), user.getEmail(), "ISSUE_FOLLOWED", "ISSUE", issueId.toString(),
                    "User followed issue #" + issue.getTicketNumber(), null);
        }
    }

    @Transactional
    public void unfollowIssue(Long issueId, User user) {
        Issue issue = issueRepository.findById(issueId)
                .orElseThrow(() -> new ResourceNotFoundException("Issue not found"));
        followerRepository.deleteByIssueAndUser(issue, user);
    }

    public boolean isFollowing(Long issueId, User user) {
        Issue issue = issueRepository.findById(issueId).orElse(null);
        return issue != null && followerRepository.existsByIssueAndUser(issue, user);
    }

    private IssueResponse mapToResponse(Issue issue) {
        IssueResponse res = new IssueResponse();
        res.setId(issue.getId());
        res.setTicketNumber(issue.getTicketNumber());
        res.setTitle(issue.getTitle());
        res.setDescription(issue.getDescription());
        res.setSubcategory(issue.getSubcategory());
        res.setStatus(issue.getStatus());
        res.setPriority(issue.getPriority());
        res.setSeverity(issue.getSeverity());
        res.setCitizenId(issue.getCitizen().getId());
        res.setCitizenName(issue.getCitizen().getFullName());
        res.setDepartmentId(issue.getDepartment().getId());
        res.setDepartmentName(issue.getDepartment().getName());
        res.setCategoryId(issue.getCategory().getId());
        res.setCategoryName(issue.getCategory().getName());

        if (issue.getLocation() != null) {
            res.setLatitude(issue.getLocation().getLatitude());
            res.setLongitude(issue.getLocation().getLongitude());
            res.setAddress(issue.getLocation().getAddress());
            res.setArea(issue.getLocation().getArea());
            res.setCity(issue.getLocation().getCity());
            res.setLandmark(issue.getLocation().getLandmark());
        }

        if (issue.getAssignedOfficer() != null) {
            res.setAssignedOfficerId(issue.getAssignedOfficer().getId());
            res.setAssignedOfficerName(issue.getAssignedOfficer().getFullName());
        }

        if (issue.getAssignedWorker() != null) {
            res.setAssignedWorkerId(issue.getAssignedWorker().getId());
            res.setAssignedWorkerName(issue.getAssignedWorker().getFullName());
        }

        res.setTargetDeadline(issue.getTargetDeadline());
        res.setDeadlineStatus(issue.getDeadlineStatus());
        res.setInternalNotes(issue.getInternalNotes());
        res.setReopenCount(issue.getReopenCount());
        res.setReopenReason(issue.getReopenReason());
        res.setCreatedAt(issue.getCreatedAt());
        res.setResolvedAt(issue.getResolvedAt());
        res.setClosedAt(issue.getClosedAt());

        // Images
        List<IssueImage> images = issueImageRepository.findByIssue(issue);
        for (IssueImage img : images) {
            if (img.getImageType() == ImageType.CITIZEN_SUBMISSION && res.getCitizenPhoto() == null) {
                res.setCitizenPhoto(img.getImageUrl());
            } else if (img.getImageType() == ImageType.BEFORE_PROOF) {
                res.setBeforePhoto(img.getImageUrl());
            } else if (img.getImageType() == ImageType.AFTER_PROOF) {
                res.setAfterPhoto(img.getImageUrl());
            }
        }

        // Timeline History
        List<IssueStatusHistory> history = statusHistoryRepository.findByIssueOrderByCreatedAtAsc(issue);
        List<IssueResponse.StatusHistoryDto> historyDtos = new ArrayList<>();
        for (IssueStatusHistory h : history) {
            historyDtos.add(new IssueResponse.StatusHistoryDto(
                    h.getPreviousStatus(),
                    h.getNewStatus(),
                    h.getChangedBy() != null ? h.getChangedBy().getFullName() : "System",
                    h.getChangeReason(),
                    h.getCreatedAt()
            ));
        }
        res.setHistory(historyDtos);

        return res;
    }
}
