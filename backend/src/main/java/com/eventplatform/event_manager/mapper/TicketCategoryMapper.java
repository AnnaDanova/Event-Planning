package com.eventplatform.event_manager.mapper;

import com.eventplatform.event_manager.domain.TicketCategory;
import com.eventplatform.event_manager.dto.TicketCategoryResponse;
import org.springframework.stereotype.Component;

@Component
public class TicketCategoryMapper {
    public TicketCategoryResponse toResponse(TicketCategory category) {
        if (category == null) {
            return null;
        }
        return new TicketCategoryResponse(
                category.getId(),
                category.getName(),
                category.getQuantity(),
                category.getPrice());
    }
}