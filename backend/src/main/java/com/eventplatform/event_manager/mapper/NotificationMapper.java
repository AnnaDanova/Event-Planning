package com.eventplatform.event_manager.mapper;

import com.eventplatform.event_manager.domain.Notification;
import com.eventplatform.event_manager.domain.NotificationTemplate;
import com.eventplatform.event_manager.dto.NotificationResponse;
import org.springframework.stereotype.Component;

@Component
public class NotificationMapper {

    public NotificationResponse toResponse(Notification notification) {
        if (notification == null) {
            return null;
        }
        NotificationResponse response = new NotificationResponse();
        response.setId(notification.getId());
        response.setSentAt(notification.getSentAt());
        if (notification.getStatus() != null) {
            response.setStatus(notification.getStatus().name());
        }
        NotificationTemplate template = notification.getTemplate();
        if (template != null) {
            response.setMessage(template.getMessage());
            if (template.getType() != null) {
                response.setType(template.getType().name());
            }
            if (template.getEvent() != null) {
                response.setEventId(template.getEvent().getId());
                response.setEventTitle(template.getEvent().getTitle());
            }
            if (template.getSession() != null) {
                response.setSessionId(template.getSession().getId());
                response.setSessionTitle(template.getSession().getTitle());
            }
        }
        return response;
    }
}
