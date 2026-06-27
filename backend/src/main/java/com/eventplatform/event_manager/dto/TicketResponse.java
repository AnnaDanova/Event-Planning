package com.eventplatform.event_manager.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class TicketResponse {
    private Long ticketId;
    private Long eventId;
    private String eventTitle;
    private String eventVenue;
    private LocalDateTime eventDateTime;
    private String ticketCategoryName;
    private BigDecimal pricePaid;
    private LocalDateTime purchaseDate;
    private String status;
}