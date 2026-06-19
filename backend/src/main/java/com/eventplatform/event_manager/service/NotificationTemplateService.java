package com.eventplatform.event_manager.service;

import com.eventplatform.event_manager.domain.Event;
import com.eventplatform.event_manager.domain.NotificationTemplate;
import com.eventplatform.event_manager.domain.enums.NotificationType;
import com.eventplatform.event_manager.dto.NotificationTemplateRequest; // Твоят Request клас
import com.eventplatform.event_manager.dto.NotificationTemplateResponse;
import com.eventplatform.event_manager.mapper.NotificationTemplateMapper;
import com.eventplatform.event_manager.repository.EventRepository;
import com.eventplatform.event_manager.repository.NotificationTemplateRepository;
import com.eventplatform.event_manager.repository.SessionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@RequiredArgsConstructor
@Service
public class NotificationTemplateService {

    private final NotificationTemplateRepository templateRepository;
    private final EventRepository eventRepository;
    private final SessionRepository sessionRepository;
    private final NotificationTemplateMapper notificationTemplateMapper;

    public NotificationTemplate getTemplateEntityById(Long id) {
        return templateRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Шаблонът с id:"  + id + "не е намерен"));
    }

    @Transactional(readOnly = true)
    public List<NotificationTemplateResponse> getTemplatesByEventId(Long eventId) {
        if (!eventRepository.existsById(eventId)) {
            throw new RuntimeException("Събитието с ID " + eventId + " не съществува!");
        }
        return templateRepository.findByEventId(eventId)
                .stream()
                .map(notificationTemplateMapper::toResponse)
                .toList();
    }

    @Transactional
    public NotificationTemplateResponse createTemplate(NotificationTemplateRequest req) {
        Event event = eventRepository.findById(req.getEventId())
                .orElseThrow(()-> new RuntimeException("Събитието с ID" + req.getEventId() + " не съществува!"));
        if (req.getMessage() == null || req.getMessage().trim().isEmpty()) {
            throw new IllegalArgumentException("Текстът на шаблона не може да бъде празен!");
        }
        if (req.getScheduledAt() == null) {
            throw new IllegalArgumentException("Трябва да посочите време за изпълнение (scheduledAt)!");
        }
        NotificationTemplate template = new NotificationTemplate();
        template.setEvent(event);
        template.setMessage(req.getMessage());
        template.setScheduledAt(req.getScheduledAt());
        if (req.getType() != null) {
            template.setType(NotificationType.valueOf(req.getType().toUpperCase()));
        }
        if (req.getSessionId() != null) {
            template.setSession(sessionRepository.findById(req.getSessionId())
                    .orElseThrow(() -> new RuntimeException("Сесията с ID " + req.getSessionId() + " не съществува!")));
        }
        return notificationTemplateMapper.toResponse(templateRepository.save(template));
    }

    @Transactional(readOnly = true)
    public NotificationTemplate getTemplateById(Long id) {
        return templateRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Шаблонът за нотификация не е намерен!"));
    }
}