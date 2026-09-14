package com.civicfix.dto;

import com.civicfix.entity.enums.DeadlineStatus;
import com.civicfix.entity.enums.IssueStatus;
import com.civicfix.entity.enums.Priority;
import com.civicfix.entity.enums.Severity;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public class IssueResponse {
    private Long id;
    private String ticketNumber;
    private String title;
    private String description;
    private String subcategory;
    private IssueStatus status;
    private Priority priority;
    private Severity severity;
    private Long citizenId;
    private String citizenName;
    private Long departmentId;
    private String departmentName;
    private Long categoryId;
    private String categoryName;
    private BigDecimal latitude;
    private BigDecimal longitude;
    private String address;
    private String area;
    private String city;
    private String landmark;
    private Long assignedOfficerId;
    private String assignedOfficerName;
    private Long assignedWorkerId;
    private String assignedWorkerName;
    private LocalDateTime targetDeadline;
    private DeadlineStatus deadlineStatus;
    private String internalNotes;
    private Integer reopenCount;
    private String reopenReason;
    private String citizenPhoto;
    private String beforePhoto;
    private String afterPhoto;
    private List<StatusHistoryDto> history;
    private LocalDateTime createdAt;
    private LocalDateTime resolvedAt;
    private LocalDateTime closedAt;

    public IssueResponse() {}

    public static class StatusHistoryDto {
        private String previousStatus;
        private String newStatus;
        private String changedByName;
        private String changeReason;
        private LocalDateTime timestamp;

        public StatusHistoryDto() {}
        public StatusHistoryDto(String prev, String next, String name, String reason, LocalDateTime time) {
            this.previousStatus = prev;
            this.newStatus = next;
            this.changedByName = name;
            this.changeReason = reason;
            this.timestamp = time;
        }

        public String getPreviousStatus() { return previousStatus; }
        public void setPreviousStatus(String previousStatus) { this.previousStatus = previousStatus; }
        public String getNewStatus() { return newStatus; }
        public void setNewStatus(String newStatus) { this.newStatus = newStatus; }
        public String getChangedByName() { return changedByName; }
        public void setChangedByName(String changedByName) { this.changedByName = changedByName; }
        public String getChangeReason() { return changeReason; }
        public void setChangeReason(String changeReason) { this.changeReason = changeReason; }
        public LocalDateTime getTimestamp() { return timestamp; }
        public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getTicketNumber() { return ticketNumber; }
    public void setTicketNumber(String ticketNumber) { this.ticketNumber = ticketNumber; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getSubcategory() { return subcategory; }
    public void setSubcategory(String subcategory) { this.subcategory = subcategory; }
    public IssueStatus getStatus() { return status; }
    public void setStatus(IssueStatus status) { this.status = status; }
    public Priority getPriority() { return priority; }
    public void setPriority(Priority priority) { this.priority = priority; }
    public Severity getSeverity() { return severity; }
    public void setSeverity(Severity severity) { this.severity = severity; }
    public Long getCitizenId() { return citizenId; }
    public void setCitizenId(Long citizenId) { this.citizenId = citizenId; }
    public String getCitizenName() { return citizenName; }
    public void setCitizenName(String citizenName) { this.citizenName = citizenName; }
    public Long getDepartmentId() { return departmentId; }
    public void setDepartmentId(Long departmentId) { this.departmentId = departmentId; }
    public String getDepartmentName() { return departmentName; }
    public void setDepartmentName(String departmentName) { this.departmentName = departmentName; }
    public Long getCategoryId() { return categoryId; }
    public void setCategoryId(Long categoryId) { this.categoryId = categoryId; }
    public String getCategoryName() { return categoryName; }
    public void setCategoryName(String categoryName) { this.categoryName = categoryName; }
    public BigDecimal getLatitude() { return latitude; }
    public void setLatitude(BigDecimal latitude) { this.latitude = latitude; }
    public BigDecimal getLongitude() { return longitude; }
    public void setLongitude(BigDecimal longitude) { this.longitude = longitude; }
    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }
    public String getArea() { return area; }
    public void setArea(String area) { this.area = area; }
    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }
    public String getLandmark() { return landmark; }
    public void setLandmark(String landmark) { this.landmark = landmark; }
    public Long getAssignedOfficerId() { return assignedOfficerId; }
    public void setAssignedOfficerId(Long assignedOfficerId) { this.assignedOfficerId = assignedOfficerId; }
    public String getAssignedOfficerName() { return assignedOfficerName; }
    public void setAssignedOfficerName(String assignedOfficerName) { this.assignedOfficerName = assignedOfficerName; }
    public Long getAssignedWorkerId() { return assignedWorkerId; }
    public void setAssignedWorkerId(Long assignedWorkerId) { this.assignedWorkerId = assignedWorkerId; }
    public String getAssignedWorkerName() { return assignedWorkerName; }
    public void setAssignedWorkerName(String assignedWorkerName) { this.assignedWorkerName = assignedWorkerName; }
    public LocalDateTime getTargetDeadline() { return targetDeadline; }
    public void setTargetDeadline(LocalDateTime targetDeadline) { this.targetDeadline = targetDeadline; }
    public DeadlineStatus getDeadlineStatus() { return deadlineStatus; }
    public void setDeadlineStatus(DeadlineStatus deadlineStatus) { this.deadlineStatus = deadlineStatus; }
    public String getInternalNotes() { return internalNotes; }
    public void setInternalNotes(String internalNotes) { this.internalNotes = internalNotes; }
    public Integer getReopenCount() { return reopenCount; }
    public void setReopenCount(Integer reopenCount) { this.reopenCount = reopenCount; }
    public String getReopenReason() { return reopenReason; }
    public void setReopenReason(String reopenReason) { this.reopenReason = reopenReason; }
    public String getCitizenPhoto() { return citizenPhoto; }
    public void setCitizenPhoto(String citizenPhoto) { this.citizenPhoto = citizenPhoto; }
    public String getBeforePhoto() { return beforePhoto; }
    public void setBeforePhoto(String beforePhoto) { this.beforePhoto = beforePhoto; }
    public String getAfterPhoto() { return afterPhoto; }
    public void setAfterPhoto(String afterPhoto) { this.afterPhoto = afterPhoto; }
    public List<StatusHistoryDto> getHistory() { return history; }
    public void setHistory(List<StatusHistoryDto> history) { this.history = history; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public LocalDateTime getResolvedAt() { return resolvedAt; }
    public void setResolvedAt(LocalDateTime resolvedAt) { this.resolvedAt = resolvedAt; }
    public LocalDateTime getClosedAt() { return closedAt; }
    public void setClosedAt(LocalDateTime closedAt) { this.closedAt = closedAt; }
}
