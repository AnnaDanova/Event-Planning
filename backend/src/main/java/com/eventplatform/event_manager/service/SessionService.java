package com.eventplatform.event_manager.service;

import com.eventplatform.event_manager.domain.Event;
import com.eventplatform.event_manager.domain.Session;
import com.eventplatform.event_manager.domain.SessionMaterial;
import com.eventplatform.event_manager.domain.User;
import com.eventplatform.event_manager.domain.enums.SessionStatus;
import com.eventplatform.event_manager.dto.*;
import com.eventplatform.event_manager.mapper.SessionMapper;
import com.eventplatform.event_manager.mapper.SessionMaterialMapper;
import com.eventplatform.event_manager.mapper.UserMapper;
import com.eventplatform.event_manager.repository.SessionMaterialRepository;
import com.eventplatform.event_manager.repository.SessionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;

@RequiredArgsConstructor
@Service
public class SessionService {

    private final SessionRepository sessionRepository;
    private final SessionMapper sessionMapper;

    private final EventService eventService;

    private final UserService userService;
    private final UserMapper userMapper;

    private final SessionMaterialRepository sessionMaterialRepository;
    private final SessionMaterialMapper sessionMaterialMapper;

    private final NotificationService notificationService;


    public Session getSessionEntityById(Long id) {
        Session session = sessionRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Сесията с ID " + id + " не беше намерена!"));
        if (session.getStatus() == SessionStatus.ARCHIVED) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Сесията е архивирана!");
        }
        return session;
    }

    public SessionResponse getSessionById(Long id) {
        return sessionMapper.toResponse(getSessionEntityById(id));
    }

    public SessionResponse createSession(Long eventId, Long userId, SessionCreateRequest request) {
        Event event = eventService.getEventEntityById(eventId);
        if (!isOrganizer(event, userId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Само организаторът може да създава сесии.");
        }
        validateTime(request.getStartTime(), request.getEndTime());
        Session session = new Session();
        session.setEvent(event);
        session.setTitle(request.getTitle());
        session.setDescription(request.getDescription());
        session.setStartTime(request.getStartTime());
        session.setEndTime(request.getEndTime());
        session.setStatus(SessionStatus.CONFIRMED);
        return sessionMapper.toResponse(sessionRepository.save(session));
    }

    public SessionResponse updateSession(Long id, Long userId, SessionCreateRequest request) {
        Session session = getSessionEntityById(id);
        boolean allowed = isOrganizer(session.getEvent(), userId) || isSpeaker(session, userId);
        if (!allowed) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Нямате право да редактирате тази сесия.");
        }
        validateTime(request.getStartTime(), request.getEndTime());
        if (request.getTitle() != null) {
            session.setTitle(request.getTitle());
        }
        if (request.getDescription() != null) {
            session.setDescription(request.getDescription());
        }
        session.setStartTime(request.getStartTime());
        session.setEndTime(request.getEndTime());
        return sessionMapper.toResponse(sessionRepository.save(session));
    }

    @Transactional
    public void deleteSession(Long id, Long userId) {
        Session session = getSessionEntityById(id);
        if (!isOrganizer(session.getEvent(), userId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Само организаторът може да изтрива сесии.");
        }
        session.setStatus(SessionStatus.ARCHIVED);
        sessionRepository.save(session);
        for (User speaker : session.getSpeakers()) {
            notificationService.sendSessionCancelledNotification(speaker.getId(), session.getEvent().getId(), session.getId());
        }
        sessionRepository.save(session);
    }

    public List<SessionResponse> getSessionsByEventId(Long eventId) {
        eventService.getEventEntityById(eventId);
        return sessionRepository.findByEventIdOrderByStartTimeAsc(eventId)
                .stream()
                .filter(session -> session.getStatus() != SessionStatus.ARCHIVED)
                .map(sessionMapper::toResponse)
                .toList();
    }

    @Transactional
    public void addSpeakerToSession(Long sessionId, Long speakerId, Long userId) {
        Session session = getSessionEntityById(sessionId);
        if (!isOrganizer(session.getEvent(), userId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Само организаторът може да добавя лектори.");
        }
        User speaker = userService.getUserEntityById(speakerId);
        session.getSpeakers().add(speaker);
        Session savedSession = sessionRepository.save(session);
        notificationService.sendSpeakerAssignedNotification(speaker.getId(), savedSession.getEvent().getId(), savedSession.getId());
    }

    public void removeSpeakerFromSession(Long sessionId, Long speakerId, Long userId) {
        Session session = getSessionEntityById(sessionId);
        if (!isOrganizer(session.getEvent(), userId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Само организаторът може да премахва лектори.");
        }
        User speaker = userService.getUserEntityById(speakerId);
        session.getSpeakers().remove(speaker);
        sessionRepository.save(session);
    }

    public List<SpeakerResponse> getSpeakersBySessionId(Long sessionId) {
        Session session = getSessionEntityById(sessionId);

        return session.getSpeakers()
                .stream()
                .map(userMapper::toSpeakerResponse)
                .toList();
    }

    public List<SessionResponse> getSessionsBySpeaker(Long speakerId) {
        userService.getUserEntityById(speakerId);
        return sessionRepository.findBySpeakersId(speakerId)
                .stream()
                .filter(session -> session.getStatus() != SessionStatus.ARCHIVED)
                .map(sessionMapper::toResponse)
                .toList();
    }

    private void validateTime(LocalDateTime start, LocalDateTime end) {
        if (start == null || end == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Началният и крайният час на сесията са задължителни!");
        }
        if (!end.isAfter(start)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Крайният час на сесията трябва да бъде след началния час!");
        }
    }

    @Transactional
    public SessionMaterialResponse uploadSessionMaterial(Long sessionId, MultipartFile file) {
        Session session = getSessionEntityById(sessionId);
        String originalFileName = file.getOriginalFilename();
        if (originalFileName == null || originalFileName.isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Невалидно име на файл.");
        }
        String lowerFileName = originalFileName.toLowerCase();
        if (!(lowerFileName.endsWith(".pdf") || lowerFileName.endsWith(".ppt") || lowerFileName.endsWith(".pptx") || lowerFileName.endsWith(".docx"))) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Позволени са само PDF, PPT, PPTX и DOCX файлове.");
        }
        try {
            String storedFileName = UUID.randomUUID() + "_" + originalFileName;
            Path uploadPath = Paths.get("uploads/session-materials").toAbsolutePath();
            Files.createDirectories(uploadPath);
            Path filePath = uploadPath.resolve(storedFileName);
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
            SessionMaterial material = new SessionMaterial();
            material.setFileName(originalFileName);
            material.setFileUrl("/uploads/session-materials/" + storedFileName);
            material.setFileType(lowerFileName.substring(lowerFileName.lastIndexOf(".") + 1));
            material.setSession(session);
            SessionMaterial savedMaterial = sessionMaterialRepository.save(material);
            return sessionMaterialMapper.toResponse(savedMaterial);
        } catch (IOException e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Файлът не можа да бъде качен.", e);
        }
    }

    public List<SessionMaterialResponse> getSessionMaterials(Long sessionId) {
        Session session = getSessionEntityById(sessionId);
        return session.getMaterials()
                .stream()
                .map(sessionMaterialMapper::toResponse)
                .toList();
    }

    @Transactional
    public void deleteMaterial(Long sessionId, Long materialId) {
        SessionMaterial material = sessionMaterialRepository.findByIdAndSessionId(materialId, sessionId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Материалът не е намерен."));
        try {
            String relativePath = material.getFileUrl();
            Path filePath = Paths.get(relativePath.replaceFirst("/", ""));
            Files.deleteIfExists(filePath);
        } catch (IOException e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Файлът не можа да бъде изтрит.", e);
        }
        sessionMaterialRepository.delete(material);
    }

    private boolean isOrganizer(Event event, Long userId) {
        return event.getOrganizer() != null
                && event.getOrganizer().getId().equals(userId);
    }

    private boolean isSpeaker(Session session, Long userId) {
        return session.getSpeakers()
                .stream()
                .anyMatch(speaker -> speaker.getId().equals(userId));
    }
}