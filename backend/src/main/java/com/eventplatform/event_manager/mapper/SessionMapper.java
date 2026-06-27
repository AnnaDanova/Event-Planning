package com.eventplatform.event_manager.mapper;

import com.eventplatform.event_manager.domain.Session;
import com.eventplatform.event_manager.dto.SessionMaterialResponse;
import com.eventplatform.event_manager.dto.SessionResponse;
import com.eventplatform.event_manager.dto.UserResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
public class SessionMapper {

    private final UserMapper userMapper;
    private final SessionMaterialMapper sessionMaterialMapper;

    public SessionResponse toResponse(Session session) {
        if (session == null) {
            return null;
        }
        List<UserResponse> speakers = List.of();
        if (session.getSpeakers() != null) {
            speakers = session.getSpeakers().stream()
                    .map(userMapper::toResponse)
                    .toList();
        }
        List<SessionMaterialResponse> materials = List.of();

        if (session.getMaterials() != null) {
            materials = session.getMaterials()
                    .stream()
                    .map(sessionMaterialMapper::toResponse)
                    .toList();
        }

        return new SessionResponse(session.getId(),
                session.getTitle(),
                session.getEvent().getId(),
                session.getEvent().getTitle(),
                session.getEvent().getOrganizer().getId(),
                session.getDescription(),
                session.getStartTime(),
                session.getEndTime(),
                session.getStatus(),
                materials,
                speakers);
    }
}