package com.eventplatform.event_manager.mapper;

import com.eventplatform.event_manager.domain.User;
import com.eventplatform.event_manager.dto.UserResponse;
import org.springframework.stereotype.Component;

@Component
public class UserMapper {
    public UserResponse toResponse(User user) {
        if (user == null) {
            return null;
        }
        return new UserResponse(user.getId(),
                user.getUsername(),
                user.getEmail(),
                user.getAddress(),
                user.getProfilePhoto()
        );
    }
}
