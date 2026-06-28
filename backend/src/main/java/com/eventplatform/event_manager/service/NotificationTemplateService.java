package com.eventplatform.event_manager.service;

import com.eventplatform.event_manager.domain.Event;
import com.eventplatform.event_manager.domain.NotificationTemplate;
import com.eventplatform.event_manager.domain.Session;
import com.eventplatform.event_manager.domain.enums.NotificationType;
import com.eventplatform.event_manager.dto.NotificationTemplateRequest;
import com.eventplatform.event_manager.dto.NotificationTemplateResponse;
import com.eventplatform.event_manager.mapper.NotificationTemplateMapper;
import com.eventplatform.event_manager.repository.EventRepository;
import com.eventplatform.event_manager.repository.NotificationTemplateRepository;
import com.eventplatform.event_manager.repository.SessionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.List;

@RequiredArgsConstructor
@Service
public class NotificationTemplateService {

    private final NotificationTemplateRepository templateRepository;
    private final EventRepository eventRepository;
    private final SessionRepository sessionRepository;
    private final NotificationTemplateMapper notificationTemplateMapper;

    public NotificationTemplate getTemplateEntityById(Long id) {
        return templateRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Шаблонът с id: " + id + " не е намерен"));
    }

    @Transactional(readOnly = true)
    public List<NotificationTemplateResponse> getTemplatesByEventId(Long eventId) {
        if (!eventRepository.existsById(eventId)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Събитието с ID " + eventId + " не съществува!");
        }
        return templateRepository.findByEventId(eventId)
                .stream()
                .map(notificationTemplateMapper::toResponse)
                .toList();
    }

    @Transactional
    public NotificationTemplateResponse createTemplate(NotificationTemplateRequest req) {
        Event event = eventRepository.findById(req.getEventId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Събитието с ID " + req.getEventId() + " не съществува!"));
        if (req.getMessage() == null || req.getMessage().trim().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Текстът на шаблона не може да бъде празен!");
        }
        if (req.getScheduledAt() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Трябва да посочите ден и час за изпращане!");
        }
        NotificationTemplate template = new NotificationTemplate();
        template.setEvent(event);
        template.setMessage(req.getMessage());
        template.setScheduledAt(req.getScheduledAt());
        if (req.getType() != null) {
            try {
                template.setType(NotificationType.valueOf(req.getType().toUpperCase()));
            } catch (IllegalArgumentException e) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Невалиден тип нотификация!");
            }
        }
        if (req.getSessionId() != null) {
            template.setSession(sessionRepository.findById(req.getSessionId())
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Сесията с ID " + req.getSessionId() + " не съществува!"))
            );
        }
        return notificationTemplateMapper.toResponse(templateRepository.save(template));
    }

    @Transactional(readOnly = true)
    public NotificationTemplate getTemplateById(Long id) {
        return templateRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Шаблонът за нотификация не е намерен!"));
    }

    @Transactional
    public NotificationTemplate createInstantTemplate(Long eventId, Long sessionId, String message, NotificationType type) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Събитието не беше намерено!"));
        Session session = null;
        if (sessionId != null) {
            session = sessionRepository.findById(sessionId)
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Сесията не беше намерена!"));
        }
        NotificationTemplate template = new NotificationTemplate();
        template.setEvent(event);
        template.setSession(session);
        template.setMessage(message);
        template.setScheduledAt(LocalDateTime.now());
        template.setType(type);
        template.setSent(true);
        return templateRepository.save(template);
    }

}