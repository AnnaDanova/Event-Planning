package com.eventplatform.event_manager.repository;

import com.eventplatform.event_manager.domain.Session;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SessionRepository extends JpaRepository<Session, Long> {

    List<Session> findByEventIdOrderByStartTimeAsc(Long eventId);
}