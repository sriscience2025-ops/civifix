package com.civicfix.service;

import com.civicfix.dto.DuplicateCheckResultDto;
import com.civicfix.entity.Issue;
import com.civicfix.entity.SystemSetting;
import com.civicfix.entity.enums.IssueStatus;
import com.civicfix.repository.IssueRepository;
import com.civicfix.repository.SystemSettingRepository;
import com.civicfix.util.HaversineUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Service
public class DuplicateDetectionService {

    @Autowired
    private IssueRepository issueRepository;

    @Autowired
    private SystemSettingRepository systemSettingRepository;

    public DuplicateCheckResultDto checkForDuplicates(BigDecimal lat, BigDecimal lon, Long categoryId, String title) {
        DuplicateCheckResultDto result = new DuplicateCheckResultDto();
        List<DuplicateCheckResultDto.SimilarIssueDto> matches = new ArrayList<>();

        if (lat == null || lon == null) {
            result.setDuplicateFound(false);
            result.setPotentialMatchesCount(0);
            result.setSimilarIssues(matches);
            return result;
        }

        double userLat = lat.doubleValue();
        double userLon = lon.doubleValue();

        // Default threshold 150 meters
        double thresholdMeters = 150.0;
        try {
            SystemSetting setting = systemSettingRepository.findBySettingKey("DUPLICATE_DISTANCE_THRESHOLD_METERS").orElse(null);
            if (setting != null) {
                thresholdMeters = Double.parseDouble(setting.getSettingValue());
            }
        } catch (Exception ignored) {}

        List<Issue> activeIssues = issueRepository.findAll();

        for (Issue issue : activeIssues) {
            // Only consider open/unclosed issues
            if (issue.getStatus() == IssueStatus.CLOSED || issue.getStatus() == IssueStatus.REJECTED || issue.getStatus() == IssueStatus.CANCELLED) {
                continue;
            }

            if (issue.getLocation() == null || issue.getLocation().getLatitude() == null) {
                continue;
            }

            double issueLat = issue.getLocation().getLatitude().doubleValue();
            double issueLon = issue.getLocation().getLongitude().doubleValue();

            double distance = HaversineUtil.calculateDistanceMeters(userLat, userLon, issueLat, issueLon);

            // If within proximity threshold and either same category or similar title
            boolean sameCategory = (categoryId != null && issue.getCategory() != null && issue.getCategory().getId().equals(categoryId));
            boolean keywordMatch = isKeywordMatch(title, issue.getTitle());

            if (distance <= thresholdMeters && (sameCategory || keywordMatch)) {
                matches.add(new DuplicateCheckResultDto.SimilarIssueDto(
                        issue.getId(),
                        issue.getTicketNumber(),
                        issue.getTitle(),
                        issue.getCategory() != null ? issue.getCategory().getName() : "General",
                        issue.getStatus().name(),
                        Math.round(distance),
                        issue.getLocation().getAddress()
                ));
            }
        }

        result.setDuplicateFound(!matches.isEmpty());
        result.setPotentialMatchesCount(matches.size());
        result.setSimilarIssues(matches);
        return result;
    }

    private boolean isKeywordMatch(String t1, String t2) {
        if (t1 == null || t2 == null) return false;
        String[] words1 = t1.toLowerCase().split("\\s+");
        String s2 = t2.toLowerCase();
        for (String w : words1) {
            if (w.length() > 3 && s2.contains(w)) {
                return true;
            }
        }
        return false;
    }
}
