package com.eventplatform.event_manager.dto;

import com.eventplatform.event_manager.domain.enums.SessionStatus;
import lombok.*;
import java.time.LocalDateTime;
import java.util.List;
import com.eventplatform.event_manager.dto.UserResponse;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class SessionResponse {
    private Long id;
    private String title;
    private String description;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private SessionStatus status;
    private List<SessionMaterialResponse> materials;
    private List<UserResponse> speakers;
}