package com.eventplatform.event_manager.controller;
import com.eventplatform.event_manager.dto.SessionCreateRequest;
import com.eventplatform.event_manager.dto.SessionResponse;
import com.eventplatform.event_manager.dto.UserResponse;
import com.eventplatform.event_manager.service.SessionService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/events/{eventId}/sessions")
@CrossOrigin(origins = "http://localhost:4200")
public class SessionController {

    private final SessionService sessionService;

    public SessionController(SessionService sessionService) {
        this.sessionService = sessionService;
    }

    @PostMapping
    public ResponseEntity<SessionResponse> createSession(@PathVariable Long eventId, @Valid @RequestBody SessionCreateRequest req) {
        return ResponseEntity.status(HttpStatus.CREATED).body(sessionService.createSession(eventId, req));
    }

    @GetMapping
    public ResponseEntity<List<SessionResponse>> getEventSessions(@PathVariable Long eventId) {
        return ResponseEntity.ok(sessionService.getSessionsByEventId(eventId));
    }

    @GetMapping("/{sessionId}")
    public ResponseEntity<SessionResponse> getSessionDetails(@PathVariable Long sessionId) {
        return ResponseEntity.ok(sessionService.getSessionById(sessionId));
    }

    @PutMapping("/{sessionId}")
    public ResponseEntity<SessionResponse> updateSession(@PathVariable Long sessionId, @Valid @RequestBody SessionCreateRequest req) {
        return ResponseEntity.ok(sessionService.updateSession(sessionId, req));
    }

    @DeleteMapping("/{sessionId}")
    public ResponseEntity<Void> deleteSession(@PathVariable Long sessionId) {
        sessionService.deleteSession(sessionId);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{sessionId}/speakers")
    public ResponseEntity<Void> addSpeakerToSession(@PathVariable Long sessionId, @RequestBody Long speakerId) {
        sessionService.addSpeakerToSession(sessionId, speakerId);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @GetMapping("/{sessionId}/speakers")
    public ResponseEntity<List<UserResponse>> getSessionSpeakers(@PathVariable Long sessionId) {
        return ResponseEntity.ok(sessionService.getSpeakersBySessionId(sessionId));
    }

    @DeleteMapping("/{sessionId}/speakers/{speakerId}")
    public ResponseEntity<Void> removeSpeakerFromSession(@PathVariable Long sessionId, @PathVariable Long speakerId) {
        sessionService.removeSpeakerFromSession(sessionId, speakerId);
        return ResponseEntity.noContent().build();
    }
}