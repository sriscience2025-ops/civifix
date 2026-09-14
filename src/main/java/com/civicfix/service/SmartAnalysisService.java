package com.civicfix.service;

import com.civicfix.dto.AnalysisResultDto;
import com.civicfix.entity.Department;
import com.civicfix.entity.IssueCategory;
import com.civicfix.entity.enums.Priority;
import com.civicfix.repository.CategoryRepository;
import com.civicfix.repository.DepartmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class SmartAnalysisService {

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private DepartmentRepository departmentRepository;

    public AnalysisResultDto analyzeIssue(String title, String description, String userCategory) {
        String combinedText = ((title != null ? title : "") + " " + (description != null ? description : "")).toLowerCase();
        AnalysisResultDto result = new AnalysisResultDto();
        List<String> matchedKeywords = new ArrayList<>();

        // 1. Critical Hazard Keywords Check
        boolean isCriticalHazard = checkKeywords(combinedText, matchedKeywords,
                "exposed wire", "live wire", "hanging wire", "electric shock", "gas leak",
                "bridge collapse", "sinkhole", "road caved", "wall collapsed", "major flood",
                "sparking transformer", "fire hazard", "danger to life");

        // 2. High Urgency Keywords Check
        boolean isHighUrgency = checkKeywords(combinedText, matchedKeywords,
                "burst", "flooding", "large pothole", "deep pothole", "sewer overflow",
                "traffic light broken", "signal failure", "major accident", "water main",
                "contamination", "choked drain", "blackout", "tree fell", "fallen tree on road");

        // 3. Category & Department Routing Rules
        String categoryName = "Other";
        String departmentCode = "PWD_ROADS";

        if (containsAny(combinedText, matchedKeywords, "pothole", "asphalt", "cracked road", "manhole", "footpath", "sidewalk", "divider", "speed breaker")) {
            categoryName = "Road & Transport";
            departmentCode = "PWD_ROADS";
        } else if (containsAny(combinedText, matchedKeywords, "light", "lamp", "street light", "dark", "flicker", "wire", "transformer", "pole", "blackout")) {
            categoryName = "Street Lighting";
            departmentCode = "ELEC_LIGHT";
        } else if (containsAny(combinedText, matchedKeywords, "pipe", "water supply", "leakage", "drinking water", "low pressure", "burst pipe", "tanker")) {
            categoryName = "Water Supply";
            departmentCode = "WATER_BOARD";
        } else if (containsAny(combinedText, matchedKeywords, "garbage", "trash", "waste", "bin", "dump", "smell", "rotting", "debris", "sanitation")) {
            categoryName = "Garbage & Sanitation";
            departmentCode = "SANITATION";
        } else if (containsAny(combinedText, matchedKeywords, "drain", "gutter", "drainage", "sewage", "sewer", "stormwater", "clogged drain")) {
            categoryName = "Drainage";
            departmentCode = "DRAINAGE";
        } else if (containsAny(combinedText, matchedKeywords, "tree", "branch", "fallen tree", "park", "garden", "overgrown", "foliage")) {
            categoryName = "Trees & Environment";
            departmentCode = "PARKS_ENV";
        } else if (containsAny(combinedText, matchedKeywords, "traffic light", "signal", "zebra crossing", "stop sign", "traffic signal")) {
            categoryName = "Traffic Signals";
            departmentCode = "TRAFFIC_DIV";
        } else if (containsAny(combinedText, matchedKeywords, "bench", "bus stop", "shelter", "railing", "public toilet", "park bench")) {
            categoryName = "Public Infrastructure";
            departmentCode = "PWD_ROADS";
        }

        // Determine Priority based on rules
        Priority priority;
        String justification;
        if (isCriticalHazard) {
            priority = Priority.CRITICAL;
            justification = "Immediate public safety threat detected from high-risk hazard keywords.";
        } else if (isHighUrgency) {
            priority = Priority.HIGH;
            justification = "Significant disruption or potential hazard requiring rapid intervention.";
        } else if (categoryName.equals("Street Lighting") || categoryName.equals("Garbage & Sanitation")) {
            priority = Priority.MEDIUM;
            justification = "Standard municipal service request with routine neighborhood impact.";
        } else {
            priority = Priority.LOW;
            justification = "Non-urgent infrastructure maintenance item.";
        }

        result.setSuggestedCategory(categoryName);
        result.setSuggestedPriority(priority);
        result.setMatchedKeywords(matchedKeywords);
        result.setJustification(justification);
        result.setConfidenceScore(matchedKeywords.isEmpty() ? 0.65 : Math.min(0.98, 0.70 + (matchedKeywords.size() * 0.08)));

        // Resolve Entities from DB
        Optional<IssueCategory> catOpt = categoryRepository.findByName(categoryName);
        if (catOpt.isPresent()) {
            result.setSuggestedCategoryId(catOpt.get().getId());
            result.setSuggestedDepartment(catOpt.get().getDepartment().getName());
            result.setSuggestedDepartmentId(catOpt.get().getDepartment().getId());
        } else {
            Optional<Department> deptOpt = departmentRepository.findByCode(departmentCode);
            if (deptOpt.isPresent()) {
                result.setSuggestedDepartment(deptOpt.get().getName());
                result.setSuggestedDepartmentId(deptOpt.get().getId());
            }
        }

        return result;
    }

    private boolean checkKeywords(String text, List<String> matched, String... keywords) {
        boolean hit = false;
        for (String kw : keywords) {
            if (text.contains(kw)) {
                if (!matched.contains(kw)) {
                    matched.add(kw);
                }
                hit = true;
            }
        }
        return hit;
    }

    private boolean containsAny(String text, List<String> matched, String... keywords) {
        boolean found = false;
        for (String kw : keywords) {
            if (text.contains(kw)) {
                if (!matched.contains(kw)) {
                    matched.add(kw);
                }
                found = true;
            }
        }
        return found;
    }
}
