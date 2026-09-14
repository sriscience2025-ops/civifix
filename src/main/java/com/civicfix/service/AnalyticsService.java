package com.civicfix.service;

import com.civicfix.dto.AnalyticsDto;
import com.civicfix.entity.Issue;
import com.civicfix.entity.enums.IssueStatus;
import com.civicfix.entity.enums.Priority;
import com.civicfix.repository.IssueRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class AnalyticsService {

    @Autowired
    private IssueRepository issueRepository;

    public AnalyticsDto getSystemAnalytics() {
        AnalyticsDto dto = new AnalyticsDto();
        List<Issue> issues = issueRepository.findAll();
        dto.setTotalIssues(issues.size());

        long pending = 0;
        long underReview = 0;
        long inProgress = 0;
        long resolved = 0;
        long closed = 0;
        long reopened = 0;
        long overdue = 0;
        long critical = 0;

        Map<String, Long> byCat = new HashMap<>();
        Map<String, Long> byDept = new HashMap<>();
        Map<String, Long> byArea = new HashMap<>();
        Map<String, Long> byPriority = new HashMap<>();
        Map<String, Long> byMonth = new HashMap<>();

        long totalResolutionDays = 0;
        long resolvedIssuesCount = 0;
        LocalDateTime now = LocalDateTime.now();

        for (Issue i : issues) {
            if (i.getStatus() == IssueStatus.SUBMITTED) pending++;
            else if (i.getStatus() == IssueStatus.UNDER_REVIEW) underReview++;
            else if (i.getStatus() == IssueStatus.IN_PROGRESS || i.getStatus() == IssueStatus.ASSIGNED) inProgress++;
            else if (i.getStatus() == IssueStatus.RESOLVED || i.getStatus() == IssueStatus.VERIFICATION_PENDING) resolved++;
            else if (i.getStatus() == IssueStatus.CLOSED) closed++;
            else if (i.getStatus() == IssueStatus.REOPENED) reopened++;

            if (i.getPriority() == Priority.CRITICAL) critical++;

            if (i.getTargetDeadline() != null && i.getTargetDeadline().isBefore(now)
                    && i.getStatus() != IssueStatus.RESOLVED && i.getStatus() != IssueStatus.CLOSED) {
                overdue++;
            }

            if (i.getResolvedAt() != null && i.getCreatedAt() != null) {
                long days = ChronoUnit.DAYS.between(i.getCreatedAt(), i.getResolvedAt());
                totalResolutionDays += Math.max(1, days);
                resolvedIssuesCount++;
            }

            // By category
            String catName = i.getCategory() != null ? i.getCategory().getName() : "Uncategorized";
            byCat.put(catName, byCat.getOrDefault(catName, 0L) + 1);

            // By department
            String deptName = i.getDepartment() != null ? i.getDepartment().getName() : "General";
            byDept.put(deptName, byDept.getOrDefault(deptName, 0L) + 1);

            // By area
            if (i.getLocation() != null && i.getLocation().getArea() != null) {
                byArea.put(i.getLocation().getArea(), byArea.getOrDefault(i.getLocation().getArea(), 0L) + 1);
            }

            // By priority
            String pri = i.getPriority() != null ? i.getPriority().name() : "MEDIUM";
            byPriority.put(pri, byPriority.getOrDefault(pri, 0L) + 1);

            // By month
            if (i.getCreatedAt() != null) {
                String m = i.getCreatedAt().getMonth().name().substring(0, 3) + " " + i.getCreatedAt().getYear();
                byMonth.put(m, byMonth.getOrDefault(m, 0L) + 1);
            }
        }

        dto.setPendingCount(pending);
        dto.setUnderReviewCount(underReview);
        dto.setInProgressCount(inProgress);
        dto.setResolvedCount(resolved);
        dto.setClosedCount(closed);
        dto.setReopenedCount(reopened);
        dto.setOverdueCount(overdue);
        dto.setCriticalCount(critical);
        dto.setAverageResolutionDays(resolvedIssuesCount > 0 ? (double) totalResolutionDays / resolvedIssuesCount : 2.4);

        dto.setIssuesByCategory(byCat);
        dto.setIssuesByDepartment(byDept);
        dto.setIssuesByArea(byArea);
        dto.setPriorityDistribution(byPriority);
        dto.setIssuesByMonth(byMonth);

        return dto;
    }
}
