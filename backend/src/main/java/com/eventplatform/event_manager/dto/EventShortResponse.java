package com.eventplatform.event_manager.dto;

import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class EventShortResponse {
    private Long id;
    private String title;
    private String venue;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private String category;
    private String status;
    private BigDecimal lowestPrice;
}