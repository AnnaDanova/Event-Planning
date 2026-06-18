package com.eventplatform.event_manager.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

// TODO: validation, ADD DATA
@Getter
@Setter
@NoArgsConstructor
public class TicketPurchaseRequest {

    @NotNull
    private Long userId;

    @NotNull(message = "Ticket category ID is required")
    private Long ticketCategoryId;
}