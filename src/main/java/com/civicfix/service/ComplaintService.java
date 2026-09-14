package com.civicfix.service;

import com.civicfix.dto.ComplaintRequest;
import com.civicfix.entity.Complaint;
import com.civicfix.entity.Issue;
import com.civicfix.entity.User;
import com.civicfix.entity.enums.ComplaintStatus;
import com.civicfix.exception.ResourceNotFoundException;
import com.civicfix.repository.ComplaintRepository;
import com.civicfix.repository.IssueRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ComplaintService {

    @Autowired
    private ComplaintRepository complaintRepository;

    @Autowired
    private IssueRepository issueRepository;

    @Autowired
    private NotificationService notificationService;

    @Autowired
    private AuditService auditService;

    @Transactional
    public Complaint fileComplaint(ComplaintRequest req, User citizen) {
        Issue issue = issueRepository.findById(req.getIssueId())
                .orElseThrow(() -> new ResourceNotFoundException("Issue not found"));

        Complaint complaint = new Complaint();
        complaint.setIssue(issue);
        complaint.setCitizen(citizen);
        complaint.setComplaintType(req.getComplaintType());
        complaint.setDescription(req.getDescription());
        complaint.setStatus(ComplaintStatus.OPEN);

        Complaint saved = complaintRepository.save(complaint);

        auditService.log(citizen.getId(), citizen.getEmail(), "COMPLAINT_FILED", "COMPLAINT", saved.getId().toString(),
                "Complaint filed against issue #" + issue.getTicketNumber(), null);

        notificationService.notifyUser(citizen, issue, "Grievance Complaint Filed",
                "Your escalation complaint regarding #" + issue.getTicketNumber() + " has been escalated to administration.",
                "COMPLAINT_FILED");

        return saved;
    }

    public List<Complaint> getCitizenComplaints(User citizen) {
        return complaintRepository.findByCitizenOrderByCreatedAtDesc(citizen);
    }

    public List<Complaint> getAllComplaints() {
        return complaintRepository.findAll();
    }

    @Transactional
    public Complaint resolveComplaint(Long complaintId, String adminResponse, User admin) {
        Complaint c = complaintRepository.findById(complaintId)
                .orElseThrow(() -> new ResourceNotFoundException("Complaint not found"));

        c.setAdminResponse(adminResponse);
        c.setStatus(ComplaintStatus.RESOLVED);
        c.setReviewedBy(admin);

        Complaint updated = complaintRepository.save(c);

        notificationService.notifyUser(c.getCitizen(), c.getIssue(), "Complaint Reviewed by Admin",
                "Admin response to your grievance: " + adminResponse, "COMPLAINT_RESOLVED");

        auditService.log(admin.getId(), admin.getEmail(), "COMPLAINT_RESOLVED", "COMPLAINT", complaintId.toString(),
                "Admin resolved grievance with response: " + adminResponse, null);

        return updated;
    }
}
