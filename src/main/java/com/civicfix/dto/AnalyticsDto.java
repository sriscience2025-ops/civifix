package com.civicfix.dto;

import java.util.Map;

public class AnalyticsDto {
    private long totalIssues;
    private long pendingCount;
    private long underReviewCount;
    private long inProgressCount;
    private long resolvedCount;
    private long closedCount;
    private long reopenedCount;
    private long overdueCount;
    private long criticalCount;
    private double averageResolutionDays;

    private Map<String, Long> issuesByCategory;
    private Map<String, Long> issuesByDepartment;
    private Map<String, Long> issuesByArea;
    private Map<String, Long> priorityDistribution;
    private Map<String, Long> issuesByMonth;

    public AnalyticsDto() {}

    public long getTotalIssues() { return totalIssues; }
    public void setTotalIssues(long totalIssues) { this.totalIssues = totalIssues; }

    public long getPendingCount() { return pendingCount; }
    public void setPendingCount(long pendingCount) { this.pendingCount = pendingCount; }

    public long getUnderReviewCount() { return underReviewCount; }
    public void setUnderReviewCount(long underReviewCount) { this.underReviewCount = underReviewCount; }

    public long getInProgressCount() { return inProgressCount; }
    public void setInProgressCount(long inProgressCount) { this.inProgressCount = inProgressCount; }

    public long getResolvedCount() { return resolvedCount; }
    public void setResolvedCount(long resolvedCount) { this.resolvedCount = resolvedCount; }

    public long getClosedCount() { return closedCount; }
    public void setClosedCount(long closedCount) { this.closedCount = closedCount; }

    public long getReopenedCount() { return reopenedCount; }
    public void setReopenedCount(long reopenedCount) { this.reopenedCount = reopenedCount; }

    public long getOverdueCount() { return overdueCount; }
    public void setOverdueCount(long overdueCount) { this.overdueCount = overdueCount; }

    public long getCriticalCount() { return criticalCount; }
    public void setCriticalCount(long criticalCount) { this.criticalCount = criticalCount; }

    public double getAverageResolutionDays() { return averageResolutionDays; }
    public void setAverageResolutionDays(double averageResolutionDays) { this.averageResolutionDays = averageResolutionDays; }

    public Map<String, Long> getIssuesByCategory() { return issuesByCategory; }
    public void setIssuesByCategory(Map<String, Long> issuesByCategory) { this.issuesByCategory = issuesByCategory; }

    public Map<String, Long> getIssuesByDepartment() { return issuesByDepartment; }
    public void setIssuesByDepartment(Map<String, Long> issuesByDepartment) { this.issuesByDepartment = issuesByDepartment; }

    public Map<String, Long> getIssuesByArea() { return issuesByArea; }
    public void setIssuesByArea(Map<String, Long> issuesByArea) { this.issuesByArea = issuesByArea; }

    public Map<String, Long> getPriorityDistribution() { return priorityDistribution; }
    public void setPriorityDistribution(Map<String, Long> priorityDistribution) { this.priorityDistribution = priorityDistribution; }

    public Map<String, Long> getIssuesByMonth() { return issuesByMonth; }
    public void setIssuesByMonth(Map<String, Long> issuesByMonth) { this.issuesByMonth = issuesByMonth; }
}
