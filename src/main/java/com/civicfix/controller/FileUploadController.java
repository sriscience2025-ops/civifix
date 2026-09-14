package com.civicfix.controller;

import com.civicfix.dto.ApiResponse;
import com.civicfix.util.FileValidationUtil;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/upload")
public class FileUploadController {

    @Value("${civicfix.upload.dir:uploads/}")
    private String uploadDir;

    @PostMapping("/image")
    public ResponseEntity<ApiResponse<Map<String, String>>> uploadImage(@RequestParam("file") MultipartFile file) {
        FileValidationUtil.validateImageFile(file);

        try {
            Path directoryPath = Paths.get(uploadDir);
            if (!Files.exists(directoryPath)) {
                Files.createDirectories(directoryPath);
            }

            String filename = FileValidationUtil.generateSafeFilename(file);
            Path targetLocation = directoryPath.resolve(filename);
            Files.copy(file.getInputStream(), targetLocation);

            String fileUrl = "/uploads/" + filename;

            Map<String, String> data = new HashMap<>();
            data.put("url", fileUrl);
            data.put("fileUrl", fileUrl);
            data.put("filename", filename);

            return ResponseEntity.ok(ApiResponse.ok("Image uploaded successfully", data));
        } catch (IOException ex) {
            return ResponseEntity.internalServerError().body(ApiResponse.error("Failed to store image: " + ex.getMessage()));
        }
    }
}
