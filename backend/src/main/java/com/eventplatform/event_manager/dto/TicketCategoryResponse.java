package com.eventplatform.event_manager.dto;
import java.math.BigDecimal;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class TicketCategoryResponse {
    private Long id;
    private String name;
    private Integer quantity;
    private BigDecimal price;
}