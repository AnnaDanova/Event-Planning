package com.eventplatform.event_manager.controller;

import com.eventplatform.event_manager.domain.enums.EventCategory;
import com.eventplatform.event_manager.dto.*;
import com.eventplatform.event_manager.service.EventService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/events")
@CrossOrigin(origins = "http://localhost:4200")
public class EventController {

        private final EventService eventService;

        public EventController(EventService eventService) {
            this.eventService = eventService;
        }

        @PostMapping
        public ResponseEntity<EventDetailsResponse> createEvent(@Valid @RequestBody EventCreateRequest req) {
            return ResponseEntity.status(HttpStatus.CREATED).body(eventService.createEvent(req));
        }

        @GetMapping
        public List<EventShortResponse> getEvents(@RequestParam(required = false) EventCategory category, @RequestParam(required = false) String location, @RequestParam(required = false) String keyword) {
            return eventService.searchEvents(category, location, keyword);
        }

        @GetMapping("/{eventId}")
        public ResponseEntity<EventDetailsResponse> getEventById(@PathVariable Long eventId) {
            return ResponseEntity.ok(eventService.getEventById(eventId));
        }

        @PutMapping("/{eventId}")
        public ResponseEntity<EventDetailsResponse> updateEvent(@PathVariable Long eventId, @Valid @RequestBody EventCreateRequest req) {
            return ResponseEntity.ok(eventService.updateEvent(eventId, req));
        }

        @DeleteMapping("/{eventId}")
        public ResponseEntity<Void> deleteEvent(@PathVariable Long eventId) {
            eventService.deleteEvent(eventId);
            return ResponseEntity.noContent().build();
        }

    @GetMapping("/organizer/{organizerId}")
    public ResponseEntity<List<EventShortResponse>> getEventsByOrganizer(
            @PathVariable Long organizerId) {

        return ResponseEntity.ok(
                eventService.getEventsByOrganizer(organizerId)
        );
    }
}