package com.eventplatform.event_manager.controller;

import com.eventplatform.event_manager.dto.NotificationTemplateRequest;
import com.eventplatform.event_manager.dto.NotificationTemplateResponse;
import com.eventplatform.event_manager.service.NotificationTemplateService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/events/{eventId}/notification-templates")
@CrossOrigin(origins = "http://localhost:4200")
public class NotificationTemplateController {

    private final NotificationTemplateService templateService;

    public NotificationTemplateController(NotificationTemplateService templateService) {
        this.templateService = templateService;
    }

    @PostMapping
    public ResponseEntity<NotificationTemplateResponse> createTemplateForEvent(@Valid @RequestBody NotificationTemplateRequest req) {
        return ResponseEntity.status(HttpStatus.CREATED).body(templateService.createTemplate(req));
    }

    @GetMapping
    public ResponseEntity<List<NotificationTemplateResponse>> getEventTemplates(@PathVariable Long eventId) {
        return ResponseEntity.ok(templateService.getTemplatesByEventId(eventId));
    }
}