package com.civicfix.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class ComplaintRequest {

    @NotNull(message = "Issue ID is required")
    private Long issueId;

    @NotBlank(message = "Complaint type is required")
    private String complaintType;

    @NotBlank(message = "Complaint description is required")
    private String description;

    public ComplaintRequest() {}

    public Long getIssueId() { return issueId; }
    public void setIssueId(Long issueId) { this.issueId = issueId; }

    public String getComplaintType() { return complaintType; }
    public void setComplaintType(String complaintType) { this.complaintType = complaintType; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
}
