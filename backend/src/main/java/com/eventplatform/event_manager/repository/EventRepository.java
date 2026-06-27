package com.eventplatform.event_manager.repository;

import com.eventplatform.event_manager.domain.Event;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface EventRepository extends JpaRepository<Event, Long> {

    List<Event> findByOrganizerId(Long organizerId);

    List<Event> findByVenue(String venue);

    List<Event> findByCategory(String category);

    List<Event> findByTitleContainingIgnoreCase(String title);

    List<Event> findByStartTimeBetween(LocalDateTime from, LocalDateTime to);
}