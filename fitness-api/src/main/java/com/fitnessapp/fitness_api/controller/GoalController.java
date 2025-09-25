package com.fitnessapp.fitness_api.controller;

import com.fitnessapp.fitness_api.dto.GoalRequest;
import com.fitnessapp.fitness_api.entity.Goal;
import com.fitnessapp.fitness_api.entity.User;
import com.fitnessapp.fitness_api.repository.GoalRepository;
import com.fitnessapp.fitness_api.repository.UserRepository;
import com.fitnessapp.fitness_api.service.GoalService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;
@RestController
@RequestMapping("/api/goals")
@RequiredArgsConstructor
public class GoalController {

    private final GoalRepository goalRepository;
    private final UserRepository userRepository;

    @PostMapping("/add")
    public ResponseEntity<Goal> addGoal(@RequestBody GoalRequest request, Principal principal) {
        // get logged-in user
        User user = userRepository.findByEmail(principal.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Goal goal = Goal.builder()
                .description(request.getDescription())
                .targetWeight(request.getTargetWeight())
                .targetDate(request.getTargetDate())
                .type(request.getType())
                .user(user)
                .build();

        goalRepository.save(goal);
        return ResponseEntity.status(HttpStatus.CREATED).body(goal);
    }

    @GetMapping
    public ResponseEntity<List<Goal>> getMyGoals(Principal principal) {
        User user = userRepository.findByEmail(principal.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));
        List<Goal> goals = goalRepository.findByUser(user);
        return ResponseEntity.ok(goals);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMyGoal(@PathVariable Long id, Principal principal) {
        User user = userRepository.findByEmail(principal.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));
        Goal goal = goalRepository.findById(id).orElse(null);
        if (goal == null || goal.getUser() == null || !goal.getUser().getId().equals(user.getId())) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
        goalRepository.delete(goal);
        return ResponseEntity.noContent().build();
    }
}

