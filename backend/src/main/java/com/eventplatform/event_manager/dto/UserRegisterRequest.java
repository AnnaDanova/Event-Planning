package com.eventplatform.event_manager.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;

@Getter
@Setter
@NoArgsConstructor
public class UserRegisterRequest {
    @NotBlank(message = "Потребителското име е задължително!")
    @Size(min = 3, max = 50, message = "Потребителското име трябва да е с дължина от 3 до 50 символа!")
    private String username;

    @NotBlank(message = "Името е задължително!")
    private String firstName;

    @NotBlank(message = "Фамилията е задължителна!")
    private String lastName;

    private String bio;

    @NotBlank(message = "Имейлът е задължителен!")
    @Email(message = "Имейлът трябжа да е валиден имейл адрес!")
    private String email;

    @NotBlank(message = "Паролата е задължителна!")
    @Size(min = 6, message = "Паролата трябва да е с дължина от поне 6 символа!")
    private String password;

    private String address;

}