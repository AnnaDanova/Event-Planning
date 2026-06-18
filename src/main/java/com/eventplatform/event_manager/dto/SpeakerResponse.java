package com.eventplatform.event_manager.dto;

public class SpeakerResponse {
    private final Long id;
    private final String fullName;
    private final String email;
    private final String profilePhoto;

    public SpeakerResponse(Long id, String fullName, String email, String profilePhoto) {
        this.id = id;
        this.fullName = fullName;
        this.email = email;
        this.profilePhoto = profilePhoto;
    }

    public Long getId() { return id; }
    public String getFullName() { return fullName; }
    public String getEmail() { return email; }
    public String getProfilePhoto() { return profilePhoto; }
}
