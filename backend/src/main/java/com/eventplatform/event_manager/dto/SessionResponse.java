package com.eventplatform.event_manager.dto;

import com.eventplatform.event_manager.domain.enums.SessionStatus;
import lombok.*;
import java.time.LocalDateTime;
import java.util.List;

@Getter
@AllArgsConstructor
public class SessionResponse {
    private final Long id;
    private final String title;
    private final Long eventId;
    private final String eventTitle;
    private final Long organizerId;
    private final String description;
    private final LocalDateTime startTime;
    private final LocalDateTime endTime;
    private final SessionStatus status;
    private final List<SessionMaterialResponse> materials;
    private final List<UserResponse> speakers;
}