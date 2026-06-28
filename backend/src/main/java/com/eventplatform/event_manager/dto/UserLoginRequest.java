package com.eventplatform.event_manager.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class UserLoginRequest {
    @NotBlank(message = "Имейлът е задължителен!")
    @Email(message = "Имейлът трябжа да е валиден имейл адрес!")
    private String email;

    @NotBlank(message = "Паролата е задължителна!")
    private String password;
}