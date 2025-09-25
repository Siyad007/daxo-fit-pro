package com.fitnessapp.fitness_api.controller;

import com.fitnessapp.fitness_api.dto.FoodDto;
import com.fitnessapp.fitness_api.entity.FoodCategory;
import com.fitnessapp.fitness_api.entity.GoalType;
import com.fitnessapp.fitness_api.service.FoodService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/foods")
@RequiredArgsConstructor
public class FoodController {

    private final FoodService foodService;

    @GetMapping
    public ResponseEntity<List<FoodDto>> getAllFoods() {
        List<FoodDto> foods = foodService.getAllFoods();
        return ResponseEntity.ok(foods);
    }

    @GetMapping("/search")
    public ResponseEntity<List<FoodDto>> searchFoods(@RequestParam String name) {
        List<FoodDto> foods = foodService.searchFoods(name);
        return ResponseEntity.ok(foods);
    }

    @GetMapping("/category/{category}")
    public ResponseEntity<List<FoodDto>> getFoodsByCategory(@PathVariable FoodCategory category) {
        List<FoodDto> foods = foodService.getFoodsByCategory(category);
        return ResponseEntity.ok(foods);
    }

    @GetMapping("/recommendations")
    public ResponseEntity<List<FoodDto>> getRecommendedFoods(@RequestParam GoalType goalType) {
        List<FoodDto> foods = foodService.getRecommendedFoods(goalType);
        return ResponseEntity.ok(foods);
    }

    @GetMapping("/high-protein")
    public ResponseEntity<List<FoodDto>> getHighProteinFoods() {
        List<FoodDto> foods = foodService.getHighProteinFoods();
        return ResponseEntity.ok(foods);
    }

    @GetMapping("/low-calorie")
    public ResponseEntity<List<FoodDto>> getLowCalorieFoods() {
        List<FoodDto> foods = foodService.getLowCalorieFoods();
        return ResponseEntity.ok(foods);
    }

    @GetMapping("/{id}")
    public ResponseEntity<FoodDto> getFoodById(@PathVariable Long id) {
        FoodDto food = foodService.getFoodById(id);
        if (food == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(food);
    }

    @PostMapping
    public ResponseEntity<FoodDto> createFood(@RequestBody FoodDto foodDto) {
        FoodDto createdFood = foodService.createFood(foodDto);
        return ResponseEntity.ok(createdFood);
    }

    @PutMapping("/{id}")
    public ResponseEntity<FoodDto> updateFood(@PathVariable Long id, @RequestBody FoodDto foodDto) {
        FoodDto updatedFood = foodService.updateFood(id, foodDto);
        if (updatedFood == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(updatedFood);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteFood(@PathVariable Long id) {
        foodService.deleteFood(id);
        return ResponseEntity.noContent().build();
    }
}
