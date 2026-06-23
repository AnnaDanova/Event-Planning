package com.eventplatform.event_manager.repository;

import com.eventplatform.event_manager.domain.NotificationTemplate;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface NotificationTemplateRepository extends JpaRepository<NotificationTemplate, Long> {
    List<NotificationTemplate> findByEventId(Long eventId);
    List<NotificationTemplate> findByScheduledAtBeforeAndSentFalse(LocalDateTime now);
}
