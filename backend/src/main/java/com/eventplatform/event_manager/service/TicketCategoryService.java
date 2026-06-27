package com.eventplatform.event_manager.service;

import com.eventplatform.event_manager.domain.Event;
import com.eventplatform.event_manager.domain.TicketCategory;
import com.eventplatform.event_manager.dto.TicketCategoryCreateRequest;
import com.eventplatform.event_manager.dto.TicketCategoryResponse;
import com.eventplatform.event_manager.mapper.TicketCategoryMapper;
import com.eventplatform.event_manager.repository.TicketCategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;
import jakarta.transaction.Transactional;

@Service
@RequiredArgsConstructor
public class TicketCategoryService {

    private final TicketCategoryRepository ticketCategoryRepository;
    private final EventService eventService;
    private final TicketCategoryMapper ticketCategoryMapper;

    public TicketCategory getCategoryEntityById(Long id) {
        return ticketCategoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Категорията билети с ID " + id + " не беше намерена!"));
    }

    @Transactional
    public TicketCategoryResponse createCategory(Long eventId, TicketCategoryCreateRequest request) {
        Event event = eventService.getEventEntityById(eventId); // Проверка през сървиса
        TicketCategory category = new TicketCategory();
        category.setEvent(event);
        category.setQuantity(request.getQuantity());
        category.setPrice(request.getPrice());
        category.setName(request.getName());
        return ticketCategoryMapper.toResponse(ticketCategoryRepository.save(category));
    }

    public TicketCategoryResponse updateCategory(Long id, TicketCategoryCreateRequest request) {
        TicketCategory category = getCategoryEntityById(id);
        if (request.getName() != null) {
            category.setName(request.getName());
        }
        if (request.getQuantity() != null) {
            category.setQuantity(request.getQuantity());
        }
        if (request.getPrice() != null) {
            category.setPrice(request.getPrice());
        }
        return ticketCategoryMapper.toResponse(ticketCategoryRepository.save(category));
}

    public void deleteCategory(Long id){
        ticketCategoryRepository.delete(getCategoryEntityById(id));
    }

    public TicketCategory save(TicketCategory ticketCategory) {
        return ticketCategoryRepository.save(ticketCategory);
    }

    public List<TicketCategoryResponse> getCategoriesByEventId(Long eventId) {
        eventService.getEventEntityById(eventId);
        return ticketCategoryRepository.findByEventId(eventId).stream()
                .map(ticketCategoryMapper::toResponse)
                .toList();
    }

    public TicketCategoryResponse getCategoryById(Long categoryId) {
        TicketCategory category = ticketCategoryRepository.findById(categoryId)
                .orElseThrow(() -> new IllegalArgumentException("Категорията не е намерена!"));

        return ticketCategoryMapper.toResponse(category);
    }
}