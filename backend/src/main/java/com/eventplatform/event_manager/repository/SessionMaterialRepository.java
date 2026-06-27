package com.eventplatform.event_manager.repository;
import com.eventplatform.event_manager.domain.SessionMaterial;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SessionMaterialRepository extends JpaRepository<SessionMaterial, Long> {
    List<SessionMaterial> findBySessionId(Long sessionId);
    Optional<SessionMaterial> findByIdAndSessionId(Long materialId, Long sessionId);
}