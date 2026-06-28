package com.eventplatform.event_manager.controller;

import com.eventplatform.event_manager.dto.TicketCategoryCreateRequest;
import com.eventplatform.event_manager.dto.TicketCategoryResponse;
import com.eventplatform.event_manager.service.TicketCategoryService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/events/{eventId}/ticket-categories")
@CrossOrigin(origins = "http://localhost:4200")
public class TicketCategoryController {

    private final TicketCategoryService ticketCategoryService;

    public TicketCategoryController(TicketCategoryService ticketCategoryService) {
        this.ticketCategoryService = ticketCategoryService;
    }

    @PostMapping
    public ResponseEntity<TicketCategoryResponse> createCategory(@PathVariable Long eventId, @Valid @RequestBody TicketCategoryCreateRequest req) {
        return ResponseEntity.status(HttpStatus.CREATED).body(ticketCategoryService.createCategory(eventId, req));
    }

    @GetMapping
    public ResponseEntity<List<TicketCategoryResponse>> getEventCategories(@PathVariable Long eventId) {
        return ResponseEntity.ok(ticketCategoryService.getCategoriesByEventId(eventId));
    }

    @PutMapping("/{categoryId}")
    public ResponseEntity<TicketCategoryResponse> updateCategory(@PathVariable Long categoryId, @Valid @RequestBody TicketCategoryCreateRequest req) {
        return ResponseEntity.ok(ticketCategoryService.updateCategory(categoryId, req));
    }

    @DeleteMapping("/{categoryId}")
    public ResponseEntity<Void> deleteCategory(@PathVariable Long categoryId) {
        ticketCategoryService.deleteCategory(categoryId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{categoryId}")
    public ResponseEntity<TicketCategoryResponse> getCategory(
            @PathVariable Long categoryId) {

        return ResponseEntity.ok(
                ticketCategoryService.getCategoryById(categoryId)
        );
    }
}