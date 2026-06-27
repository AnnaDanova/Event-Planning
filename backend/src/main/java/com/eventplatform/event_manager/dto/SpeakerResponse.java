package com.eventplatform.event_manager.dto;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@RequiredArgsConstructor
public class SpeakerResponse {
    private final Long id;
    private final String fullName;
    private final String bio;
    private final String profilePhoto;
}
