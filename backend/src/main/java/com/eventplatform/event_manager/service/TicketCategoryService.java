package com.eventplatform.event_manager.service;

import com.eventplatform.event_manager.domain.Event;
import com.eventplatform.event_manager.domain.TicketCategory;
import com.eventplatform.event_manager.dto.TicketCategoryCreateRequest;
import com.eventplatform.event_manager.dto.TicketCategoryResponse;
import com.eventplatform.event_manager.mapper.TicketCategoryMapper;
import com.eventplatform.event_manager.repository.TicketCategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import jakarta.transaction.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
@RequiredArgsConstructor
public class TicketCategoryService {

    private final TicketCategoryRepository ticketCategoryRepository;
    private final EventService eventService;
    private final TicketCategoryMapper ticketCategoryMapper;

    public TicketCategory getCategoryEntityById(Long id) {
        return ticketCategoryRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Категорията билети с ID " + id + " не беше намерена!"));
    }

    @Transactional
    public TicketCategoryResponse createCategory(Long eventId, TicketCategoryCreateRequest request) {
        Event event = eventService.getEventEntityById(eventId);
        TicketCategory category = new TicketCategory();
        category.setEvent(event);
        if (request.getQuantity() < 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Броят билети не може да бъде отрицателен!");
        }
        category.setQuantity(request.getQuantity());
        if (request.getPrice().compareTo(BigDecimal.ZERO) < 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Цената не може да бъде отрицателна!");
        }
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
            if (request.getQuantity() < 0) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Броят билети не може да бъде отрицателен!");
            }
            category.setQuantity(request.getQuantity());
        }
        if (request.getPrice() != null) {
            if (request.getPrice().compareTo(BigDecimal.ZERO) < 0) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Цената не може да бъде отрицателна!");
            }
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
        return ticketCategoryRepository.findByEventIdOrderByPriceAsc(eventId).stream()
                .map(ticketCategoryMapper::toResponse)
                .toList();
    }

    public TicketCategoryResponse getCategoryById(Long categoryId) {
        TicketCategory category = ticketCategoryRepository.findById(categoryId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Категорията не е намерена!"));
        return ticketCategoryMapper.toResponse(category);
    }
}