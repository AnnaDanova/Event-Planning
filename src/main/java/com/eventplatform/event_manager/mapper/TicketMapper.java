package com.eventplatform.event_manager.mapper;

import com.eventplatform.event_manager.domain.Event;
import com.eventplatform.event_manager.domain.Ticket;
import com.eventplatform.event_manager.domain.TicketCategory;
import com.eventplatform.event_manager.dto.TicketResponse;
import org.springframework.stereotype.Component;

@Component
public class TicketMapper {

    public TicketResponse toResponse(Ticket ticket) {
        if (ticket == null) {
            return null;
        }
        TicketCategory category = ticket.getTicketCategory();
        Event event = category.getEvent();
        return new TicketResponse(
                ticket.getId(),
                event.getId(),
                event.getTitle(),
                event.getVenue(),
                event.getDateTime(),
                category.getName(),
                category.getPrice(),
                ticket.getPurchaseDate(),
                ticket.getStatus().name()
        );
    }
}