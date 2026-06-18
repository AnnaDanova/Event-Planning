package com.eventplatform.event_manager.dto;

import com.eventplatform.event_manager.domain.TicketCategory;
import com.eventplatform.event_manager.domain.enums.EventStatus;
import lombok.*;
import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class EventDetailsResponse {
    private Long id;
    private String title;
    private String description;
    private String venue;
    private LocalDateTime dateTime;
    private String category;
    private EventStatus status;
    private String organizerName;
    private String organizerEmail;
    private Integer capacity;
    private List<SessionResponse> sessions;
    private List<TicketCategoryResponse> ticketCategories;
}