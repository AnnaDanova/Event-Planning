package com.eventplatform.event_manager.mapper;

import com.eventplatform.event_manager.domain.SessionMaterial;
import com.eventplatform.event_manager.dto.SessionMaterialResponse;
import org.springframework.stereotype.Component;

@Component
public class SessionMaterialMapper {

    public SessionMaterialResponse toResponse(SessionMaterial material) {
        if (material == null) {
            return null;
        }
        return new SessionMaterialResponse(
                material.getId(),
                material.getFileName(),
                material.getFileUrl(),
                material.getFileType()
        );
    }
}