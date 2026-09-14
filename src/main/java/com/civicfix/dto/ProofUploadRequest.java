package com.civicfix.dto;

import jakarta.validation.constraints.NotBlank;

public class ProofUploadRequest {

    @NotBlank(message = "Before photo is required")
    private String beforePhotoUrl;

    @NotBlank(message = "After photo is required")
    private String afterPhotoUrl;

    @NotBlank(message = "Resolution description is required")
    private String resolutionDescription;

    private String optionalNotes;

    public ProofUploadRequest() {}

    public String getBeforePhotoUrl() { return beforePhotoUrl; }
    public void setBeforePhotoUrl(String beforePhotoUrl) { this.beforePhotoUrl = beforePhotoUrl; }

    public String getAfterPhotoUrl() { return afterPhotoUrl; }
    public void setAfterPhotoUrl(String afterPhotoUrl) { this.afterPhotoUrl = afterPhotoUrl; }

    public String getResolutionDescription() { return resolutionDescription; }
    public void setResolutionDescription(String resolutionDescription) { this.resolutionDescription = resolutionDescription; }

    public String getOptionalNotes() { return optionalNotes; }
    public void setOptionalNotes(String optionalNotes) { this.optionalNotes = optionalNotes; }
}
