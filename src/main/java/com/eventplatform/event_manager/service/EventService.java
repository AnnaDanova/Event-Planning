package com.eventplatform.event_manager.service;

import com.eventplatform.event_manager.domain.Event;
import com.eventplatform.event_manager.domain.User;
import com.eventplatform.event_manager.domain.enums.EventStatus;
import com.eventplatform.event_manager.dto.*;
import com.eventplatform.event_manager.mapper.EventMapper;
import com.eventplatform.event_manager.repository.EventRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
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
                .orElseThrow(() -> new RuntimeException("Събитието с ID " + id + " не беше намерено!"));
    }

    public EventDetailsResponse getEventById(Long id) {
        return eventMapper.toDetailsResponse(getEventEntityById(id));
    }

    public List<EventShortResponse> getAllEvents() {
        return eventRepository.findAll()
                .stream()
                .map(eventMapper::toShortResponse)
                .collect(toList());
    }

    @Transactional
    public EventDetailsResponse createEvent(EventCreateRequest req) {
        validateEventData(req.getTitle(), req.getCapacity(), req.getDateTime());
        User organizer = userService.getUserEntityById(req.getOrganizerId());
        Event event = new Event();
        event.setTitle(req.getTitle());
        event.setDescription(req.getDescription());
        event.setVenue(req.getVenue());
        event.setCategory(req.getCategory());
        event.setDateTime(req.getDateTime());
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
        validateEventData(req.getTitle(), req.getCapacity(), req.getDateTime());
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
        event.setDateTime(req.getDateTime());
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

    private void validateEventData(String title, Integer capacity, LocalDateTime dateTime) {
        if (title == null || title.trim().isEmpty()) {
            throw new IllegalArgumentException("Заглавието на събитието не може да бъде празно!");
        }
        if (capacity == null || capacity <= 0) {
            throw new IllegalArgumentException("Капацитетът на събитието трябва да бъде по-голям от 0!");
        }
        if (dateTime == null) {
            throw new IllegalArgumentException("Трябва да посочите дата и час за събитието!");
        }
        if (dateTime.isBefore(LocalDateTime.now())) {
            throw new IllegalArgumentException("Датата на събитието не може да бъде в миналото!");
        }
    }
}