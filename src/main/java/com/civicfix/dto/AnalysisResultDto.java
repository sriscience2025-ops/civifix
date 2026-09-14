package com.civicfix.dto;

import com.civicfix.entity.enums.Priority;
import java.util.List;

public class AnalysisResultDto {
    private String suggestedCategory;
    private Long suggestedCategoryId;
    private String suggestedDepartment;
    private Long suggestedDepartmentId;
    private Priority suggestedPriority;
    private List<String> matchedKeywords;
    private String justification;
    private double confidenceScore;

    public AnalysisResultDto() {}

    public String getSuggestedCategory() { return suggestedCategory; }
    public void setSuggestedCategory(String suggestedCategory) { this.suggestedCategory = suggestedCategory; }

    public Long getSuggestedCategoryId() { return suggestedCategoryId; }
    public void setSuggestedCategoryId(Long suggestedCategoryId) { this.suggestedCategoryId = suggestedCategoryId; }

    public String getSuggestedDepartment() { return suggestedDepartment; }
    public void setSuggestedDepartment(String suggestedDepartment) { this.suggestedDepartment = suggestedDepartment; }

    public Long getSuggestedDepartmentId() { return suggestedDepartmentId; }
    public void setSuggestedDepartmentId(Long suggestedDepartmentId) { this.suggestedDepartmentId = suggestedDepartmentId; }

    public Priority getSuggestedPriority() { return suggestedPriority; }
    public void setSuggestedPriority(Priority suggestedPriority) { this.suggestedPriority = suggestedPriority; }

    public List<String> getMatchedKeywords() { return matchedKeywords; }
    public void setMatchedKeywords(List<String> matchedKeywords) { this.matchedKeywords = matchedKeywords; }

    public String getJustification() { return justification; }
    public void setJustification(String justification) { this.justification = justification; }

    public double getConfidenceScore() { return confidenceScore; }
    public void setConfidenceScore(double confidenceScore) { this.confidenceScore = confidenceScore; }
}
