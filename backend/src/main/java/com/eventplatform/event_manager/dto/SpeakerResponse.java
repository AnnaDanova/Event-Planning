package com.eventplatform.event_manager.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class SpeakerResponse {
    private final Long id;
    private final String fullName;
    private final String bio;
    private final String profilePhoto;
}
