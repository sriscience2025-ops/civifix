package com.civicfix.controller;

import com.civicfix.dto.AnalysisResultDto;
import com.civicfix.dto.ApiResponse;
import com.civicfix.dto.DuplicateCheckResultDto;
import com.civicfix.service.DuplicateDetectionService;
import com.civicfix.service.SmartAnalysisService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.math.BigDecimal;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class SmartAnalysisController {

    @Autowired
    private SmartAnalysisService smartAnalysisService;

    @Autowired
    private DuplicateDetectionService duplicateDetectionService;

    @PostMapping("/smart-analysis")
    public ResponseEntity<ApiResponse<AnalysisResultDto>> analyzeIssue(@RequestBody Map<String, String> payload) {
        String title = payload.get("title");
        String description = payload.get("description");
        String userCategory = payload.get("userCategory");

        AnalysisResultDto result = smartAnalysisService.analyzeIssue(title, description, userCategory);
        return ResponseEntity.ok(ApiResponse.ok("Smart classification completed", result));
    }

    @PostMapping("/duplicate-check")
    public ResponseEntity<ApiResponse<DuplicateCheckResultDto>> checkDuplicates(@RequestBody Map<String, Object> payload) {
        BigDecimal lat = null;
        BigDecimal lon = null;
        Long categoryId = null;
        String title = (String) payload.get("title");

        try {
            if (payload.get("latitude") != null) {
                lat = new BigDecimal(payload.get("latitude").toString());
            }
            if (payload.get("longitude") != null) {
                lon = new BigDecimal(payload.get("longitude").toString());
            }
            if (payload.get("categoryId") != null) {
                categoryId = Long.parseLong(payload.get("categoryId").toString());
            }
        } catch (Exception ignored) {}

        DuplicateCheckResultDto result = duplicateDetectionService.checkForDuplicates(lat, lon, categoryId, title);
        return ResponseEntity.ok(ApiResponse.ok("Duplicate proximity scan completed", result));
    }
}
