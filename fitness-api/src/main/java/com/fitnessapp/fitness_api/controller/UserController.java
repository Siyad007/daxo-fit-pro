package com.fitnessapp.fitness_api.controller;

import com.fitnessapp.fitness_api.entity.User;
import com.fitnessapp.fitness_api.dto.UserDto;
import com.fitnessapp.fitness_api.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    // Get all users
    @GetMapping
    public ResponseEntity<List<User>> getAllUsers() {
        List<User> users = userService.getAllUsers();
        return ResponseEntity.ok(users);
    }

    // Get a user by ID
    @GetMapping("/{id}")
    public ResponseEntity<User> getUserById(@PathVariable Long id) {
        User user = userService.getUserById(id);
        if (user == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(user);
    }

    // Create a new user (optional, usually registration is via AuthController)
    @PostMapping
    public ResponseEntity<User> createUser(@RequestBody User user) {
        User createdUser = userService.createUser(user);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdUser);
    }

    // Update an existing user
    @PutMapping("/{id}")
    public ResponseEntity<User> updateUser(@PathVariable Long id, @RequestBody User updatedUser) {
        User user = userService.updateUser(id, updatedUser);
        if (user == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(user);
    }

    // Delete a user
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }

    // Optional: Get the logged-in user (requires JWT auth)
    @GetMapping("/me")
    public ResponseEntity<User> getLoggedInUser(Principal principal) {
        User user = userService.getUserByEmail(principal.getName());
        if (user == null) {
            return ResponseEntity.notFound().build();
        }
        // Ensure password is not exposed
        user.setPassword(null);
        return ResponseEntity.ok(user);
    }

    @PutMapping("/me/profile")
    public ResponseEntity<User> updateMyProfile(@RequestBody UserDto dto, Principal principal) {
        User user = userService.getUserByEmail(principal.getName());
        if (user == null) {
            return ResponseEntity.notFound().build();
        }
        user.setName(dto.getName());
        user.setAge(dto.getAge());
        user.setWeight(dto.getWeight());
        user.setHeight(dto.getHeight());
        user.setGender(dto.getGender());
        user.setActivityLevel(dto.getActivityLevel());
        user.setGoal(dto.getGoal());

        int dailyCalories = userService.calculateDailyCalories(user);
        user.setDailyCalorieTarget(dailyCalories);

        User saved = userService.createUser(user); // save
        saved.setPassword(null);
        return ResponseEntity.ok(saved);
    }
}
