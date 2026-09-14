package com.civicfix.dto;

import com.civicfix.entity.enums.IssueStatus;
import com.civicfix.entity.enums.Priority;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;

public class StatusUpdateRequest {

    @NotNull(message = "Status is required")
    private IssueStatus status;

    private String reason;
    private Priority priority;
    private Long departmentId;
    private LocalDateTime deadline;
    private String internalNotes;

    public StatusUpdateRequest() {}

    public IssueStatus getStatus() { return status; }
    public void setStatus(IssueStatus status) { this.status = status; }

    public String getReason() { return reason; }
    public void setReason(String reason) { this.reason = reason; }

    public Priority getPriority() { return priority; }
    public void setPriority(Priority priority) { this.priority = priority; }

    public Long getDepartmentId() { return departmentId; }
    public void setDepartmentId(Long departmentId) { this.departmentId = departmentId; }

    public LocalDateTime getDeadline() { return deadline; }
    public void setDeadline(LocalDateTime deadline) { this.deadline = deadline; }

    public String getInternalNotes() { return internalNotes; }
    public void setInternalNotes(String internalNotes) { this.internalNotes = internalNotes; }
}
