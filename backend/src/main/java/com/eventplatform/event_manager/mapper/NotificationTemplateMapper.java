package com.eventplatform.event_manager.mapper;

import com.eventplatform.event_manager.domain.NotificationTemplate;
import com.eventplatform.event_manager.dto.NotificationTemplateResponse;
import org.springframework.stereotype.Component;

@Component
public class NotificationTemplateMapper {

    public NotificationTemplateResponse toResponse(NotificationTemplate template) {
        if (template == null) {
            return null;
        }
        NotificationTemplateResponse response = new NotificationTemplateResponse();
        response.setId(template.getId());
        if (template.getEvent() != null) {
            response.setEventId(template.getEvent().getId());
            response.setEventTitle(template.getEvent().getTitle());
        }
        response.setMessage(template.getMessage());
        response.setScheduledAt(template.getScheduledAt());
        if (template.getType() != null) {
            response.setType(template.getType().name());
        }
        if (template.getSession() != null) {
            response.setSessionId(template.getSession().getId());
            response.setSessionTitle(template.getSession().getTitle());
        }
        return response;
    }
}