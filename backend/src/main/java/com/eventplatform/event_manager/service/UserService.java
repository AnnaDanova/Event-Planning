package com.eventplatform.event_manager.service;

import com.eventplatform.event_manager.domain.User;
import com.eventplatform.event_manager.mapper.UserMapper;
import com.eventplatform.event_manager.dto.UserLoginRequest;
import com.eventplatform.event_manager.dto.UserRegisterRequest;
import com.eventplatform.event_manager.dto.UserResponse;
import com.eventplatform.event_manager.dto.UserUpdateRequest;
import com.eventplatform.event_manager.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.jspecify.annotations.Nullable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.UUID;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;

    public User getUserEntityById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Потребителят не е намерен!"));
        if (!user.getActive()) {
            throw new RuntimeException("Потребителят е деактивиран!");
        }
        return user;
    }

    public UserResponse getUserById(Long id) {
        User user = getUserEntityById(id);
        return userMapper.toResponse(user);
    }

    public UserResponse register(UserRegisterRequest registerRequest) {
        if (userRepository.findByEmail(registerRequest.getEmail()).isPresent()) {
            throw new IllegalArgumentException("Потребител с този имейл вече съществува!");
        }
        if (registerRequest.getUsername() == null || registerRequest.getUsername().trim().isEmpty()) {
            throw new IllegalArgumentException("Потребителското име не може да бъде празно!");
        }
        if (registerRequest.getPassword() == null || registerRequest.getPassword().length() < 6) {
            throw new IllegalArgumentException("Паролата трябва да бъде поне 6 символа дълга!");
        }
        User user = new User();
        user.setUsername(registerRequest.getUsername());
        user.setFirstName(registerRequest.getFirstName());
        user.setLastName(registerRequest.getLastName());
        user.setBio(registerRequest.getBio());
        user.setEmail(registerRequest.getEmail());
        user.setPasswordHash(passwordEncoder.encode(registerRequest.getPassword()));
        user.setAddress(registerRequest.getAddress());
        user.setActive(true);
        User savedUser = userRepository.save(user);
        return userMapper.toResponse(savedUser);
    }

    public UserResponse login(UserLoginRequest loginRequest) {
        User user = userRepository.findByEmail(loginRequest.getEmail())
                .orElseThrow(() -> new RuntimeException("Грешен имейл!"));
        if (!user.getActive()) {
            throw new RuntimeException("Профилът е деактивиран!");
        }
        if (!passwordEncoder.matches(loginRequest.getPassword(), user.getPasswordHash())) {
            throw new IllegalArgumentException("Грешна парола!");
        }
        return userMapper.toResponse(user);
    }

    public UserResponse updateUser(Long id, UserUpdateRequest userRequest) {
        User user = getUserEntityById(id);
        if (userRequest.getEmail() != null) {
            user.setEmail(userRequest.getEmail());
        }
        if (userRequest.getLastName() != null) {
            user.setLastName(userRequest.getLastName());
        }
        if (userRequest.getBio() != null) {
            user.setBio(userRequest.getBio());
        }
        if (userRequest.getAddress() != null) {
            user.setAddress(userRequest.getAddress());
        }
        if (userRequest.getProfilePhoto() != null) {
            user.setProfilePhoto(userRequest.getProfilePhoto());
        }
        User updated = userRepository.save(user);
        return userMapper.toResponse(updated);
    }

    public void deleteUser(Long id) {
        User user = getUserEntityById(id);
        user.setActive(false);
        userRepository.save(user);
    }

    public List<UserResponse> searchUsers(String query) {
        if (query == null || query.trim().length() < 2) {
            return List.of();
        }
        String trimmedQuery = query.trim();
        return userRepository.searchUsers(trimmedQuery)
                .stream()
                .map(userMapper::toResponse)
                .toList();
    }

    public UserResponse uploadProfilePhoto(Long userId, MultipartFile file) {
        User user = getUserEntityById(userId);
        try {
            String fileName = UUID.randomUUID() + "_" + file.getOriginalFilename();
            Path uploadPath = Paths.get("uploads/profile-photos");
            Files.createDirectories(uploadPath);
            Path filePath = uploadPath.resolve(fileName);
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
            user.setProfilePhoto("/uploads/profile-photos/" + fileName);
            userRepository.save(user);
            return userMapper.toResponse(user);
        } catch (IOException e) {
            throw new RuntimeException("Could not upload profile photo.", e);
        }
    }
}