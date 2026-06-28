package com.eventplatform.event_manager.dto;


import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

// TODO: validation
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class NotificationTemplateRequest {
    private Long sessionId;

    @NotNull
    private Long eventId;

    @NotBlank
    private String message;

    @NotNull
    private LocalDateTime scheduledAt;

    private String type;
}
