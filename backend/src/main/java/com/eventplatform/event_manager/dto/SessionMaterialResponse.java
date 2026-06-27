package com.eventplatform.event_manager.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@AllArgsConstructor
public class SessionMaterialResponse {
    private final Long id;
    private final String fileName;
    private final String fileUrl;
    private final String fileType;
}