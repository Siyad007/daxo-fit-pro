package com.fitnessapp.fitness_api.service;

import com.fitnessapp.fitness_api.dto.FoodDto;
import com.fitnessapp.fitness_api.entity.Food;
import com.fitnessapp.fitness_api.entity.FoodCategory;
import com.fitnessapp.fitness_api.entity.GoalType;
import com.fitnessapp.fitness_api.repository.FoodRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FoodService {
    
    private final FoodRepository foodRepository;
    
    public List<FoodDto> getAllFoods() {
        return foodRepository.findByIsActiveTrue()
                .stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }
    
    public List<FoodDto> searchFoods(String name) {
        return foodRepository.findByNameContainingIgnoreCase(name)
                .stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }
    
    public List<FoodDto> getFoodsByCategory(FoodCategory category) {
        return foodRepository.findByCategoryAndIsActiveTrue(category)
                .stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }
    
    public List<FoodDto> getRecommendedFoods(GoalType goalType) {
        List<Food> foods;
        
        switch (goalType) {
            case LOSS:
                // Low calorie, high protein foods for weight loss
                foods = foodRepository.findLowCalorieFoods(200.0);
                break;
            case GAIN:
                // High calorie, high protein foods for weight gain
                foods = foodRepository.findHighProteinFoods(15.0);
                break;
            case MAINTAIN:
            default:
                // Balanced foods for maintenance
                foods = foodRepository.findByIsActiveTrue();
                break;
        }
        
        return foods.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }
    
    public List<FoodDto> getHighProteinFoods() {
        return foodRepository.findHighProteinFoods(15.0)
                .stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }
    
    public List<FoodDto> getLowCalorieFoods() {
        return foodRepository.findLowCalorieFoods(150.0)
                .stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }
    
    public FoodDto getFoodById(Long id) {
        return foodRepository.findById(id)
                .map(this::convertToDto)
                .orElse(null);
    }
    
    public FoodDto createFood(FoodDto foodDto) {
        Food food = convertToEntity(foodDto);
        food.setIsActive(true);
        Food savedFood = foodRepository.save(food);
        return convertToDto(savedFood);
    }
    
    public FoodDto updateFood(Long id, FoodDto foodDto) {
        return foodRepository.findById(id)
                .map(existingFood -> {
                    existingFood.setName(foodDto.getName());
                    existingFood.setCalories(foodDto.getCalories());
                    existingFood.setProtein(foodDto.getProtein());
                    existingFood.setCarbs(foodDto.getCarbs());
                    existingFood.setFat(foodDto.getFat());
                    existingFood.setFiber(foodDto.getFiber());
                    existingFood.setDescription(foodDto.getDescription());
                    existingFood.setImageUrl(foodDto.getImageUrl());
                    existingFood.setCategory(foodDto.getCategory());
                    existingFood.setIsActive(foodDto.getIsActive());
                    
                    Food savedFood = foodRepository.save(existingFood);
                    return convertToDto(savedFood);
                })
                .orElse(null);
    }
    
    public void deleteFood(Long id) {
        foodRepository.findById(id)
                .ifPresent(food -> {
                    food.setIsActive(false);
                    foodRepository.save(food);
                });
    }
    
    private FoodDto convertToDto(Food food) {
        return FoodDto.builder()
                .id(food.getId())
                .name(food.getName())
                .calories(food.getCalories())
                .protein(food.getProtein())
                .carbs(food.getCarbs())
                .fat(food.getFat())
                .fiber(food.getFiber())
                .description(food.getDescription())
                .imageUrl(food.getImageUrl())
                .category(food.getCategory())
                .isActive(food.getIsActive())
                .build();
    }
    
    private Food convertToEntity(FoodDto foodDto) {
        return Food.builder()
                .id(foodDto.getId())
                .name(foodDto.getName())
                .calories(foodDto.getCalories())
                .protein(foodDto.getProtein())
                .carbs(foodDto.getCarbs())
                .fat(foodDto.getFat())
                .fiber(foodDto.getFiber())
                .description(foodDto.getDescription())
                .imageUrl(foodDto.getImageUrl())
                .category(foodDto.getCategory())
                .isActive(foodDto.getIsActive())
                .build();
    }
}
