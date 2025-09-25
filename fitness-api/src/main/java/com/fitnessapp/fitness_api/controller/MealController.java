package com.fitnessapp.fitness_api.controller;

import com.fitnessapp.fitness_api.dto.MealRequest;
import com.fitnessapp.fitness_api.dto.MealDto;
import com.fitnessapp.fitness_api.dto.DailyNutritionDto;
import com.fitnessapp.fitness_api.entity.User;
import com.fitnessapp.fitness_api.repository.UserRepository;
import com.fitnessapp.fitness_api.service.MealService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/meals")
@RequiredArgsConstructor
public class MealController {

    private final MealService mealService;
    private final UserRepository userRepository;

    @PostMapping("/add")
    public ResponseEntity<String> addMeal(@RequestBody MealRequest request, Principal principal) {
        User user = userRepository.findByEmail(principal.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));

        String message = mealService.addMeal(user, request);
        return ResponseEntity.ok(message);
    }

    @GetMapping
    public ResponseEntity<List<MealDto>> getMealsForDate(@RequestParam(required = false) String date,
                                                         Principal principal) {
        User user = userRepository.findByEmail(principal.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));
        LocalDate target = (date != null) ? LocalDate.parse(date) : LocalDate.now();
        List<MealDto> meals = mealService.getMealsForDate(user, target);
        return ResponseEntity.ok(meals);
    }
    
    @GetMapping("/all")
    public ResponseEntity<List<MealDto>> getAllMeals(Principal principal) {
        User user = userRepository.findByEmail(principal.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));
        List<MealDto> meals = mealService.getMealsForUser(user);
        return ResponseEntity.ok(meals);
    }
    
    @GetMapping("/nutrition")
    public ResponseEntity<DailyNutritionDto> getDailyNutrition(@RequestParam(required = false) String date,
                                                              Principal principal) {
        User user = userRepository.findByEmail(principal.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));
        LocalDate target = (date != null) ? LocalDate.parse(date) : LocalDate.now();
        DailyNutritionDto nutrition = mealService.getDailyNutrition(user, target);
        return ResponseEntity.ok(nutrition);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<String> updateMeal(@PathVariable Long id, 
                                           @RequestBody MealRequest request, 
                                           Principal principal) {
        User user = userRepository.findByEmail(principal.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        String message = mealService.updateMeal(id, request, user);
        return ResponseEntity.ok(message);
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteMeal(@PathVariable Long id, Principal principal) {
        User user = userRepository.findByEmail(principal.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        String message = mealService.deleteMeal(id, user);
        return ResponseEntity.ok(message);
    }
}
