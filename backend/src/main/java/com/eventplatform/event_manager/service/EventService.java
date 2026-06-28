package com.eventplatform.event_manager.service;

import com.eventplatform.event_manager.domain.Event;
import com.eventplatform.event_manager.domain.User;
import com.eventplatform.event_manager.domain.enums.EventCategory;
import com.eventplatform.event_manager.domain.enums.EventStatus;
import com.eventplatform.event_manager.dto.*;
import com.eventplatform.event_manager.mapper.EventMapper;
import com.eventplatform.event_manager.repository.EventRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.List;
import static java.util.stream.Collectors.toList;

@Service
@RequiredArgsConstructor
public class EventService {

    private final EventRepository eventRepository;
    private final UserService userService;
    private final EventMapper eventMapper;

    public Event getEventEntityById(Long id) {
        return eventRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Събитието с ID " + id + " не беше намерено!"));
    }

    public EventDetailsResponse getEventById(Long id) {
        return eventMapper.toDetailsResponse(getEventEntityById(id));
    }

    public List<EventDetailsResponse> getEventByUserId(Long userId) {
        return eventRepository.findByOrganizerId(userId)
                .stream()
                .map(eventMapper::toDetailsResponse)
                .collect(toList());
    }

    public List<EventShortResponse> getAllEvents() {
        return eventRepository.findAll()
                .stream()
                .map(eventMapper::toShortResponse)
                .collect(toList());
    }

    @Transactional
    public EventDetailsResponse createEvent(EventCreateRequest req) {
        validateEventData(req.getTitle(), req.getCapacity(), req.getStartTime(), req.getEndTime());
        User organizer = userService.getUserEntityById(req.getOrganizerId());
        Event event = new Event();
        event.setTitle(req.getTitle());
        event.setDescription(req.getDescription());
        event.setVenue(req.getVenue());
        event.setCategory(req.getCategory());
        event.setStartTime(req.getStartTime());
        event.setEndTime(req.getEndTime());
        event.setCapacity(req.getCapacity());
        event.setStatus(EventStatus.CONFIRMED);
        event.setOrganizer(organizer);
        event.setCreatedAt(LocalDateTime.now());
        Event savedEvent = eventRepository.save(event);
        return eventMapper.toDetailsResponse(savedEvent);
    }

    @Transactional
    public EventDetailsResponse updateEvent(Long eventId, EventCreateRequest req) {
        Event event = getEventEntityById(eventId);
        validateEventData(req.getTitle(), req.getCapacity(), req.getStartTime(), req.getEndTime());
        if (req.getTitle() != null) {
            event.setTitle(req.getTitle());
        }
        if (req.getDescription() != null) {
            event.setDescription(req.getDescription());
        }
        if (req.getVenue() != null) {
            event.setVenue(req.getVenue());
        }
        if (req.getCategory() != null) {
            event.setCategory(req.getCategory());
        }
        event.setStartTime(req.getStartTime());
        event.setEndTime(req.getEndTime());
        if (req.getCapacity() != null) {
            event.setCapacity(req.getCapacity());
        }
        event.setUpdatedAt(LocalDateTime.now());
        Event updatedEvent = eventRepository.save(event);
        return eventMapper.toDetailsResponse(updatedEvent);
    }

    @Transactional
    public void deleteEvent(Long eventId) {
        Event toDelete = getEventEntityById(eventId);
        eventRepository.delete(toDelete);
    }

    private void validateEventData(String title, Integer capacity, LocalDateTime startTime, LocalDateTime endTime) {
        if (title == null || title.trim().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Заглавието на събитието не може да бъде празно!");
        }
        if (capacity == null || capacity <= 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Капацитетът на събитието трябва да бъде по-голям от 0!");
        }
        if (startTime == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Трябва да посочите дата и час на започване на събитието!");
        }
        if (endTime == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Трябва да посочите дата и час на приключване на събитието!");
        }
        if (startTime.isBefore(LocalDateTime.now())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Датата и часът на започване на събитието са невалидни!");
        }
        if (endTime.isBefore(LocalDateTime.now()) || endTime.isBefore(startTime)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Датата и часът на приключване на събитието са невалидни!");
        }
    }

    public List<EventShortResponse> searchEvents(EventCategory category, String location, String keyword) {
        String locationPattern = null;
        if (location != null && !location.isBlank()) {
            locationPattern = "%" + location.toLowerCase() + "%";
        }
        String keywordPattern = null;
        if (keyword != null && !keyword.isBlank()) {
            keywordPattern = "%" + keyword.toLowerCase() + "%";
        }
        return eventRepository.searchEvents(category, locationPattern, keywordPattern)
                .stream()
                .map(eventMapper::toShortResponse)
                .toList();
    }

    public List<EventShortResponse> getEventsByOrganizer(Long organizerId) {
        return eventRepository.findByOrganizerIdOrderByStartTimeAsc(organizerId)
                .stream()
                .map(eventMapper::toShortResponse)
                .toList();
    }
}
