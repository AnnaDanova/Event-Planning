package com.eventplatform.event_manager.dto; // По-добра подредба на пакетите

import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Setter
@Getter
@NoArgsConstructor
public class EventCreateRequest {
    @NotNull
    private Long organizerId;

    @NotBlank(message = "Заглавието е задължително!")
    @Size(min = 3, max = 100, message = "Заглавието трябва да е между 3 и 100 символа.")
    private String title;

    @NotBlank(message = "Описанието е задължително!")
    private String description;

    @NotBlank(message = "Мястото на провеждане (venue) е задължително!")
    private String venue;

    @NotBlank(message = "Категорията е задължителна!")
    private String category; // Напр. CONFERENCE, CONCERT, WORKSHOP

    @NotNull(message = "Датата и часът са задължителни!")
    @Future(message = "Събитието трябва да бъде в бъдещето!")
    private LocalDateTime dateTime;

    @NotNull(message = "Капацитетът е задължителен!")
    @Min(value = 1, message = "Капацитетът на събитието трябва да е поне 1 човек.")
    private Integer capacity;
}