package com.eventplatform.event_manager.service;


import com.eventplatform.event_manager.domain.Event;
import com.eventplatform.event_manager.domain.Ticket;
import com.eventplatform.event_manager.domain.TicketCategory;
import com.eventplatform.event_manager.domain.User;
import com.eventplatform.event_manager.domain.enums.EventStatus;
import com.eventplatform.event_manager.domain.enums.TicketStatus;
import com.eventplatform.event_manager.dto.TicketResponse;
import com.eventplatform.event_manager.dto.UserResponse;
import com.eventplatform.event_manager.mapper.TicketMapper;
import com.eventplatform.event_manager.mapper.UserMapper;
import com.eventplatform.event_manager.repository.TicketRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@RequiredArgsConstructor
@Service
public class TicketService {

    private final TicketRepository ticketRepository;

    private final UserService userService;
    private final EventService eventService;
    private final TicketCategoryService ticketCategoryService;
    private final TicketMapper ticketMapper;
    private final UserMapper userMapper;

    @Transactional
    public TicketResponse purchaseTicket(Long userId, Long eventId, Long categoryId) {
        User user = userService.getUserEntityById(userId);
        Event event = eventService.getEventEntityById(eventId);
        TicketCategory category = ticketCategoryService.getCategoryEntityById(categoryId);
        if (event.getStatus() == EventStatus.CANCELLED || event.getStatus() == EventStatus.ARCHIVED) {
            throw new IllegalStateException("Събитието не е активно!");
        }
        if (category.getQuantity() <= 0) {
            throw new IllegalStateException("Билетите са разпродадени!");
        }
        category.setQuantity(category.getQuantity() - 1);
        ticketCategoryService.save(category);
        Ticket ticket = new Ticket();
        ticket.setUser(user);
        ticket.setTicketCategory(category);
        ticket.setPurchaseDate(LocalDateTime.now());
        ticket.setStatus(TicketStatus.valueOf("CONFIRMED"));
        return ticketMapper.toResponse(ticketRepository.save(ticket));
    }

    public List<UserResponse> getAttendeesByEventId(Long eventId) {
        eventService.getEventEntityById(eventId);
        return ticketRepository.findByTicketCategoryEventId(eventId).stream()
                .map(Ticket::getUser)
                .distinct()
                .map(userMapper::toResponse)
                .toList();
    }

    public List<TicketResponse> getTicketsByUserId(Long userId) {
        userService.getUserEntityById(userId);
        return ticketRepository.findByUserId(userId).stream()
                .map(ticketMapper::toResponse)
                .toList();
    }
}
