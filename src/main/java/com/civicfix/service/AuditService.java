package com.civicfix.service;

import com.civicfix.entity.AuditLog;
import com.civicfix.repository.AuditLogRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class AuditService {

    @Autowired
    private AuditLogRepository auditLogRepository;

    public void log(Long userId, String userEmail, String action, String entityType, String entityId, String details, String ipAddress) {
        try {
            AuditLog log = new AuditLog(userId, userEmail, action, entityType, entityId, details, ipAddress != null ? ipAddress : "127.0.0.1");
            auditLogRepository.save(log);
        } catch (Exception e) {
            System.err.println("Failed to write audit log: " + e.getMessage());
        }
    }
}
