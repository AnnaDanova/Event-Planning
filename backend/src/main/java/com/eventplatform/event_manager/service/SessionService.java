package com.eventplatform.event_manager.service;

import com.eventplatform.event_manager.domain.Event;
import com.eventplatform.event_manager.domain.Session;
import com.eventplatform.event_manager.domain.User;
import com.eventplatform.event_manager.domain.enums.SessionStatus;
import com.eventplatform.event_manager.dto.SessionCreateRequest;
import com.eventplatform.event_manager.dto.SessionResponse;
import com.eventplatform.event_manager.dto.UserResponse;
import com.eventplatform.event_manager.mapper.SessionMapper;
import com.eventplatform.event_manager.mapper.UserMapper;
import com.eventplatform.event_manager.repository.SessionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;

@RequiredArgsConstructor
@Service
public class SessionService {

    private final SessionRepository sessionRepository;
    private final EventService eventService;
    private final UserService userService;
    private final SessionMapper sessionMapper;
    private final UserMapper userMapper;

    public Session getSessionEntityById(Long id) {
        return sessionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Сесията с ID " + id + " не беше намерена!"));
    }

    public SessionResponse getSessionById(Long id) {
        return sessionMapper.toResponse(getSessionEntityById(id));
    }

    public SessionResponse createSession(Long eventId, SessionCreateRequest request) {
        Event event = eventService.getEventEntityById(eventId);
        validateTime(request.getStartTime(), request.getEndTime());
        Session session = new Session();
        session.setEvent(event);
        session.setTitle(request.getTitle());
        session.setDescription(request.getDescription());
        session.setStartTime(request.getStartTime());
        session.setEndTime(request.getEndTime());
        session.setStatus(SessionStatus.valueOf("CONFIRMED"));
        return sessionMapper.toResponse(sessionRepository.save(session));
    }

    public SessionResponse updateSession(Long id, SessionCreateRequest request) {
        Session session = getSessionEntityById(id);
        validateTime(request.getStartTime(), session.getStartTime());
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

    public void deleteSession(Long id) {
        sessionRepository.delete(getSessionEntityById(id));
    }

    public List<Session> getAllSessions() {
        return sessionRepository.findAll();
    }

    public List<SessionResponse> getSessionsByEventId(Long eventId) {
        eventService.getEventEntityById(eventId);
        return sessionRepository.findByEventIdOrderByStartTimeAsc(eventId)
                .stream()
                .map(sessionMapper::toResponse)
                .toList();
    }

    public void addSpeakerToSession(Long sessionId, Long speakerId) {
        Session session = getSessionEntityById(sessionId);
        User speaker = userService.getUserEntityById(speakerId);
        session.getSpeakers().add(speaker);
        sessionRepository.save(session);
    }

    public void removeSpeakerFromSession(Long sessionId, Long speakerId) {
        Session session = getSessionEntityById(sessionId);
        User speaker = userService.getUserEntityById(speakerId);
        session.getSpeakers().remove(speaker);
        sessionRepository.save(session);
    }

    public List<UserResponse> getSpeakersBySessionId(Long sessionId) {
        Session session = getSessionEntityById(sessionId);

        return session.getSpeakers()
                .stream()
                .map(userMapper::toResponse)
                .toList();
    }

    private void validateTime(LocalDateTime start, LocalDateTime end) {
        if (start == null || end == null) {
            throw new IllegalArgumentException("Началният и крайният час на сесията са задължителни!");
        }

        if (!end.isAfter(start)) {
            throw new IllegalArgumentException("Крайният час на сесията трябва да бъде след началния час!");
        }
    }
}