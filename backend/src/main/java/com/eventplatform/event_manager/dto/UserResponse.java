package com.eventplatform.event_manager.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class UserResponse {
    private final Long id;
    private final String username;
    private final String firstName;
    private final String lastName;
    private final String bio;
    private final String email;
    private final String address;
    private final String profilePhoto;

}