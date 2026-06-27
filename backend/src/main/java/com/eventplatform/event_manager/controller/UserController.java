package com.eventplatform.event_manager.controller;

import com.eventplatform.event_manager.dto.*;
import com.eventplatform.event_manager.service.SessionService;
import com.eventplatform.event_manager.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:4200")
public class UserController {

    private final UserService userService;
    private final SessionService sessionService;

    public UserController(UserService userService, SessionService sessionService) {
        this.userService = userService;
        this.sessionService = sessionService;
    }

    @PostMapping("/register")
    public ResponseEntity<UserResponse> registerUser(@RequestBody UserRegisterRequest registerRequest) {
        return ResponseEntity.status(HttpStatus.CREATED).body(userService.register(registerRequest));
    }

    @PostMapping("/login")
    public ResponseEntity<UserResponse> loginUser(@RequestBody UserLoginRequest loginRequest) {
        return ResponseEntity.ok(userService.login(loginRequest));
    }

    @GetMapping("/{userId}")
    public ResponseEntity<UserResponse> getUserById(@PathVariable Long userId) {
        return ResponseEntity.ok(userService.getUserById(userId));
    }

    @PutMapping("/{userId}")
    public ResponseEntity<UserResponse> updateUser(@PathVariable Long userId, @RequestBody UserUpdateRequest userRequest) {
        return ResponseEntity.ok(userService.updateUser(userId, userRequest));
    }

    @DeleteMapping("/{userId}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long userId) {
        userService.deleteUser(userId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/search")
    public ResponseEntity<List<UserResponse>> searchUsers(@RequestParam String query) {
        return ResponseEntity.ok(userService.searchUsers(query));
    }

    @PostMapping("/{userId}/profile-photo")
    public ResponseEntity<UserResponse> uploadProfilePhoto(
            @PathVariable Long userId,
            @RequestParam("file") MultipartFile file) {
        return ResponseEntity.ok(userService.uploadProfilePhoto(userId, file));
    }
    @GetMapping("/{userId}/speaker-sessions")
    public ResponseEntity<List<SessionResponse>> getSpeakerSessions(@PathVariable Long userId) {
        return ResponseEntity.ok(sessionService.getSessionsBySpeaker(userId));
    }
}