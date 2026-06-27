package com.eventplatform.event_manager.repository;

import com.eventplatform.event_manager.domain.Event;
import com.eventplatform.event_manager.domain.enums.EventCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
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

    List<Event> findByOrganizerIdOrderByStartTimeAsc(Long organizerId);

    @Query("""
    SELECT e FROM Event e
    WHERE (:category IS NULL OR e.category = :category)
      AND (:location IS NULL OR LOWER(e.venue) LIKE :location)
      AND (:keyword IS NULL OR LOWER(e.title) LIKE :keyword OR LOWER(e.description) LIKE :keyword)
    """)
    List<Event> searchEvents(@Param("category") EventCategory category, @Param("location") String location, @Param("keyword") String keyword);
}