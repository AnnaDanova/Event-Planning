package com.eventplatform.event_manager.service;

import com.eventplatform.event_manager.domain.Notification;
import com.eventplatform.event_manager.domain.NotificationTemplate;
import com.eventplatform.event_manager.domain.User;
import com.eventplatform.event_manager.domain.enums.NotificationStatus;
import com.eventplatform.event_manager.domain.enums.NotificationType;
import com.eventplatform.event_manager.dto.NotificationResponse;
import com.eventplatform.event_manager.mapper.NotificationMapper;
import com.eventplatform.event_manager.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@RequiredArgsConstructor
@Service
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final UserService userService;
    private final NotificationTemplateService templateService;
    private final NotificationMapper notificationMapper;

    public Notification getNotificationEntityById(Long notificationId) {
        return notificationRepository.findById(notificationId)
                .orElseThrow(() -> new RuntimeException("Известието с ID " + notificationId + " не беше намерено!"));
    }

    @Transactional(readOnly = true)
    public List<NotificationResponse> getNotificationsByUserId(Long userId) {
        userService.getUserEntityById(userId);
        return notificationRepository.findByUserIdOrderBySentAtDesc(userId)
                .stream()
                .map(notificationMapper::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<NotificationResponse> getUnreadNotificationsByUserId(Long userId) {
        userService.getUserEntityById(userId);
        return notificationRepository.findByUserIdAndStatusOrderBySentAtDesc(userId, NotificationStatus.SENT).stream()
                .map(notificationMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public void markNotificationAsRead(Long notificationId) {
        Notification notification = getNotificationEntityById(notificationId);
        notification.setStatus(NotificationStatus.READ);
        notificationRepository.save(notification);
    }

    @Transactional
    public void markAllNotificationsAsRead(Long userId) {
        userService.getUserById(userId);
        List<Notification> unreadNotifications = notificationRepository.findByUserIdAndStatus(userId, NotificationStatus.SENT);
        for (Notification notification : unreadNotifications) {
            notification.setStatus(NotificationStatus.READ);
        }
        notificationRepository.saveAll(unreadNotifications);
    }

    @Transactional
    public NotificationResponse sendNotification(Long userId, Long templateId) {
        User user = userService.getUserEntityById(userId);
        NotificationTemplate template = templateService.getTemplateEntityById(templateId);
        Notification notification = new Notification();
        notification.setUser(user);
        notification.setTemplate(template);
        notification.setSentAt(LocalDateTime.now());
        notification.setStatus(NotificationStatus.SENT);
        return notificationMapper.toResponse(notificationRepository.save(notification));
    }

    @Transactional
    public NotificationResponse sendTicketConfirmedNotification(Long userId, Long eventId) {
        User user = userService.getUserEntityById(userId);
        NotificationTemplate template = templateService.createInstantTemplate(eventId, null, "Успешно се записахте за събитието!", com.eventplatform.event_manager.domain.enums.NotificationType.TICKET_CONFIRMED);
        Notification notification = new Notification();
        notification.setUser(user);
        notification.setTemplate(template);
        notification.setSentAt(LocalDateTime.now());
        notification.setStatus(NotificationStatus.SENT);
        return notificationMapper.toResponse(notificationRepository.save(notification));
    }

    @Transactional
    public NotificationResponse sendSpeakerAssignedNotification(Long speakerId, Long eventId, Long sessionId) {
        User speaker = userService.getUserEntityById(speakerId);
        NotificationTemplate template = templateService.createInstantTemplate(eventId, sessionId, "Добавени сте към събитие.", com.eventplatform.event_manager.domain.enums.NotificationType.SPEAKER_BRIEFING);
        Notification notification = new Notification();
        notification.setUser(speaker);
        notification.setTemplate(template);
        notification.setSentAt(LocalDateTime.now());
        notification.setStatus(NotificationStatus.SENT);
        return notificationMapper.toResponse(notificationRepository.save(notification));
    }

    @Transactional
    public NotificationResponse sendSessionCancelledNotification(Long speakerId, Long eventId, Long sessionId) {
        User speaker = userService.getUserEntityById(speakerId);
        NotificationTemplate template = templateService.createInstantTemplate(eventId, sessionId, "Сесията, към която сте добавени като лектор, беше отменена от организатора.", NotificationType.SCHEDULE_CHANGED);
        Notification notification = new Notification();
        notification.setUser(speaker);
        notification.setTemplate(template);
        notification.setSentAt(LocalDateTime.now());
        notification.setStatus(NotificationStatus.SENT);
        return notificationMapper.toResponse(notificationRepository.save(notification));
    }

}