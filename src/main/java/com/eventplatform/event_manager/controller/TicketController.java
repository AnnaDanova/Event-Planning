package com.eventplatform.event_manager.controller;

import com.eventplatform.event_manager.dto.TicketPurchaseRequest;
import com.eventplatform.event_manager.dto.TicketResponse;
import com.eventplatform.event_manager.dto.UserResponse;
import com.eventplatform.event_manager.service.TicketService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/events/{eventId}")
@CrossOrigin(origins = "http://localhost:4200")
public class TicketController {

    private final TicketService ticketService;

    public TicketController(TicketService ticketService) {
        this.ticketService = ticketService;
    }

    @PostMapping("/tickets")
    public ResponseEntity<TicketResponse> buyTicket(@PathVariable Long eventId, @Valid @RequestBody TicketPurchaseRequest req) {
        TicketResponse response = ticketService.purchaseTicket(req.getUserId(), eventId, req.getTicketCategoryId());
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/attendees")
    public ResponseEntity<List<UserResponse>> getEventAttendees(@PathVariable Long eventId) {
        return ResponseEntity.ok(ticketService.getAttendeesByEventId(eventId));
    }
}