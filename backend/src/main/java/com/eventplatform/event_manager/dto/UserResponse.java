package com.eventplatform.event_manager.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class UserResponse {
    private final Long id;
    private final String username;
    private final String email;
    private final String address;
    private final String profilePhoto;

}