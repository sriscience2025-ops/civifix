package com.civicfix.service;

import com.civicfix.entity.Issue;
import com.civicfix.entity.Notification;
import com.civicfix.entity.User;
import com.civicfix.repository.NotificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class NotificationService {

    @Autowired
    private NotificationRepository notificationRepository;

    @Transactional
    public void notifyUser(User user, Issue issue, String title, String message, String type) {
        if (user == null) return;
        Notification notif = new Notification(user, issue, title, message, type);
        notificationRepository.save(notif);
    }

    public List<Notification> getUserNotifications(User user) {
        return notificationRepository.findByUserOrderByCreatedAtDesc(user);
    }

    public Long getUnreadCount(User user) {
        return notificationRepository.countByUserAndIsReadFalse(user);
    }

    @Transactional
    public void markAsRead(Long notificationId, User user) {
        Notification n = notificationRepository.findById(notificationId).orElse(null);
        if (n != null && n.getUser().getId().equals(user.getId())) {
            n.setIsRead(true);
            notificationRepository.save(n);
        }
    }

    @Transactional
    public void markAllAsRead(User user) {
        List<Notification> unread = notificationRepository.findByUserAndIsReadFalseOrderByCreatedAtDesc(user);
        for (Notification n : unread) {
            n.setIsRead(true);
        }
        notificationRepository.saveAll(unread);
    }
}
