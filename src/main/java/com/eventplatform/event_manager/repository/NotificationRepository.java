package com.eventplatform.event_manager.repository;

import com.eventplatform.event_manager.domain.Notification;
import com.eventplatform.event_manager.domain.enums.NotificationStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface NotificationRepository extends JpaRepository<Notification, Long> {

    List<Notification> findByUserIdOrderBySentAtDesc(Long userId);
    List<Notification> findByUserIdAndStatusOrderBySentAtDesc(Long userId, NotificationStatus status);
    List<Notification> findByUserIdAndStatus(Long userId, NotificationStatus status);
}