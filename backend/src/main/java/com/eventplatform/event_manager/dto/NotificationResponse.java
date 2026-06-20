package com.eventplatform.event_manager.dto;

import lombok.*;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class NotificationResponse {
    private Long id;
    private String message;
    private String status;
    private LocalDateTime sentAt;
    private String type;
    private Long eventId;
    private String eventTitle;
    private Long sessionId;
    private String sessionTitle;
}