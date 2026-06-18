package com.eventplatform.event_manager.dto;


import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.time.LocalDateTime;


@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class NotificationTemplateResponse {
    private Long id;
    private Long sessionId;
    private Long eventId;
    private String message;
    private LocalDateTime scheduledAt;
    private String type;
}
