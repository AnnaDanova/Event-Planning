package com.eventplatform.event_manager.mapper;
import com.eventplatform.event_manager.domain.Event;
import com.eventplatform.event_manager.domain.TicketCategory;
import com.eventplatform.event_manager.dto.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.List;

@Component
@RequiredArgsConstructor
public class EventMapper {

    private final SessionMapper sessionMapper;
    private final TicketCategoryMapper ticketCategoryMapper;

    public EventShortResponse toShortResponse(Event event) {
        if (event == null) {
            return null;
        }
        EventShortResponse response = new EventShortResponse();
        response.setId(event.getId());
        response.setTitle(event.getTitle());
        response.setDateTime(event.getDateTime());
        response.setVenue(event.getVenue());
        response.setCategory(event.getCategory());
        response.setStatus(event.getStatus().toString());
        if (event.getTicketCategories() != null) {
            BigDecimal lowestPrice = event.getTicketCategories().stream()
                    .map(TicketCategory::getPrice)
                    .min(BigDecimal::compareTo)
                    .orElse(null);
            response.setLowestPrice(lowestPrice);
        }
        return response;
    }

    public EventDetailsResponse toDetailsResponse(Event event) {
        if (event == null) {
            return null;
        }
        EventDetailsResponse response = new EventDetailsResponse();
        response.setId(event.getId());
        response.setTitle(event.getTitle());
        response.setDescription(event.getDescription());
        response.setVenue(event.getVenue());
        response.setCategory(event.getCategory());
        response.setDateTime(event.getDateTime());
        response.setCapacity(event.getCapacity());
        response.setStatus(event.getStatus());

        if (event.getOrganizer() != null) {
            response.setOrganizerName(event.getOrganizer().getUsername());
            response.setOrganizerEmail(event.getOrganizer().getEmail());
        }

        if (event.getSessions() != null){
            List<SessionResponse> sessions = event.getSessions().stream()
                    .map(sessionMapper::toResponse)
                    .toList();
            response.setSessions(sessions);
        }
        if (event.getTicketCategories() != null){
            List<TicketCategoryResponse> categories = event.getTicketCategories().stream()
                    .map(ticketCategoryMapper::toResponse)
                    .toList();
            response.setTicketCategories(categories);
        }
        return response;
    }
}