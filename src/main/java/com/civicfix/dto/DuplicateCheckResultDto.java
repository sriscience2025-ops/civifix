package com.civicfix.dto;

import java.util.List;

public class DuplicateCheckResultDto {
    private boolean duplicateFound;
    private int potentialMatchesCount;
    private List<SimilarIssueDto> similarIssues;

    public static class SimilarIssueDto {
        private Long id;
        private String ticketNumber;
        private String title;
        private String category;
        private String status;
        private double distanceMeters;
        private String address;

        public SimilarIssueDto() {}
        public SimilarIssueDto(Long id, String ticketNumber, String title, String category, String status, double distanceMeters, String address) {
            this.id = id;
            this.ticketNumber = ticketNumber;
            this.title = title;
            this.category = category;
            this.status = status;
            this.distanceMeters = distanceMeters;
            this.address = address;
        }

        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }
        public String getTicketNumber() { return ticketNumber; }
        public void setTicketNumber(String ticketNumber) { this.ticketNumber = ticketNumber; }
        public String getTitle() { return title; }
        public void setTitle(String title) { this.title = title; }
        public String getCategory() { return category; }
        public void setCategory(String category) { this.category = category; }
        public String getStatus() { return status; }
        public void setStatus(String status) { this.status = status; }
        public double getDistanceMeters() { return distanceMeters; }
        public void setDistanceMeters(double distanceMeters) { this.distanceMeters = distanceMeters; }
        public String getAddress() { return address; }
        public void setAddress(String address) { this.address = address; }
    }

    public DuplicateCheckResultDto() {}

    public boolean isDuplicateFound() { return duplicateFound; }
    public void setDuplicateFound(boolean duplicateFound) { this.duplicateFound = duplicateFound; }

    public int getPotentialMatchesCount() { return potentialMatchesCount; }
    public void setPotentialMatchesCount(int potentialMatchesCount) { this.potentialMatchesCount = potentialMatchesCount; }

    public List<SimilarIssueDto> getSimilarIssues() { return similarIssues; }
    public void setSimilarIssues(List<SimilarIssueDto> similarIssues) { this.similarIssues = similarIssues; }
}
