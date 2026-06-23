package com.eventplatform.event_manager.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class SessionMaterialResponse {
    private Long id;
    private String fileName;
    private String fileUrl;
    private String fileType;
}