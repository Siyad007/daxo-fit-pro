package com.fitnessapp.fitness_api.service;

import com.fitnessapp.fitness_api.dto.MealRequest;
import com.fitnessapp.fitness_api.dto.MealDto;
import com.fitnessapp.fitness_api.dto.DailyNutritionDto;
import com.fitnessapp.fitness_api.entity.User;
import com.fitnessapp.fitness_api.entity.Meal;
import com.fitnessapp.fitness_api.entity.Food;
import com.fitnessapp.fitness_api.repository.MealRepository;
import com.fitnessapp.fitness_api.repository.FoodRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MealService {

    private final MealRepository mealRepository;
    private final FoodRepository foodRepository;

    public String addMeal(User user, MealRequest request) {
        Food food = null;
        if (request.getFoodId() != null) {
            food = foodRepository.findById(request.getFoodId()).orElse(null);
        }
        
        Meal meal = Meal.builder()
                .user(user)
                .food(food)
                .mealType(request.getMealType())
                .foodName(request.getFoodName())
                .quantity(request.getQuantity())
                .mealDate(request.getMealDate() != null ? request.getMealDate() : LocalDate.now())
                .createdAt(LocalDateTime.now())
                .build();
        
        // Calculate nutrition based on food and quantity
        meal.calculateNutrition();
        
        mealRepository.save(meal);
        
        // Generate response message
        double totalCaloriesToday = getTotalCaloriesToday(user);
        double targetCalories = user.getDailyCalorieTarget() != null ? user.getDailyCalorieTarget() : 2000.0;
        
        StringBuilder message = new StringBuilder();
        message.append("Meal added successfully! ");
        message.append("Calories: ").append(meal.getCalories()).append(" cal");
        message.append(" | Total today: ").append(totalCaloriesToday).append("/").append(targetCalories);
        
        if (totalCaloriesToday > targetCalories) {
            message.append(" | You've exceeded your daily target!");
        } else {
            double remaining = targetCalories - totalCaloriesToday;
            message.append(" | Remaining: ").append(remaining).append(" cal");
        }
        
        return message.toString();
    }

    public List<MealDto> getMealsForDate(User user, LocalDate date) {
        return mealRepository.findByUserAndMealDate(user, date)
                .stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }
    
    public List<MealDto> getMealsForUser(User user) {
        return mealRepository.findByUser(user)
                .stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }
    
    public DailyNutritionDto getDailyNutrition(User user, LocalDate date) {
        List<Meal> meals = mealRepository.findByUserAndMealDate(user, date);
        
        double totalCalories = meals.stream().mapToDouble(Meal::getCalories).sum();
        double totalProtein = meals.stream().mapToDouble(Meal::getProtein).sum();
        double totalCarbs = meals.stream().mapToDouble(Meal::getCarbs).sum();
        double totalFat = meals.stream().mapToDouble(Meal::getFat).sum();
        double totalFiber = meals.stream().mapToDouble(Meal::getFiber).sum();
        
        double targetCalories = user.getDailyCalorieTarget() != null ? user.getDailyCalorieTarget() : 2000.0;
        double remainingCalories = Math.max(0, targetCalories - totalCalories);
        double calorieProgress = (totalCalories / targetCalories) * 100;
        
        return DailyNutritionDto.builder()
                .date(date)
                .totalCalories(totalCalories)
                .totalProtein(totalProtein)
                .totalCarbs(totalCarbs)
                .totalFat(totalFat)
                .totalFiber(totalFiber)
                .targetCalories(targetCalories)
                .remainingCalories(remainingCalories)
                .calorieProgress(calorieProgress)
                .build();
    }
    
    public String updateMeal(Long mealId, MealRequest request, User user) {
        return mealRepository.findById(mealId)
                .map(meal -> {
                    if (!meal.getUser().getId().equals(user.getId())) {
                        return "Unauthorized to update this meal";
                    }
                    
                    Food food = null;
                    if (request.getFoodId() != null) {
                        food = foodRepository.findById(request.getFoodId()).orElse(null);
                    }
                    
                    meal.setFood(food);
                    meal.setMealType(request.getMealType());
                    meal.setFoodName(request.getFoodName());
                    meal.setQuantity(request.getQuantity());
                    meal.setMealDate(request.getMealDate() != null ? request.getMealDate() : LocalDate.now());
                    
                    // Recalculate nutrition
                    meal.calculateNutrition();
                    
                    mealRepository.save(meal);
                    return "Meal updated successfully";
                })
                .orElse("Meal not found");
    }
    
    public String deleteMeal(Long mealId, User user) {
        return mealRepository.findById(mealId)
                .map(meal -> {
                    if (!meal.getUser().getId().equals(user.getId())) {
                        return "Unauthorized to delete this meal";
                    }
                    
                    mealRepository.delete(meal);
                    return "Meal deleted successfully";
                })
                .orElse("Meal not found");
    }
    
    private double getTotalCaloriesToday(User user) {
        LocalDate today = LocalDate.now();
        return mealRepository.findByUserAndMealDate(user, today)
                .stream()
                .mapToDouble(Meal::getCalories)
                .sum();
    }
    
    private MealDto convertToDto(Meal meal) {
        return MealDto.builder()
                .id(meal.getId())
                .userId(meal.getUser().getId())
                .foodId(meal.getFood() != null ? meal.getFood().getId() : null)
                .foodName(meal.getFoodName())
                .mealType(meal.getMealType())
                .quantity(meal.getQuantity())
                .calories(meal.getCalories())
                .protein(meal.getProtein())
                .carbs(meal.getCarbs())
                .fat(meal.getFat())
                .fiber(meal.getFiber())
                .mealDate(meal.getMealDate())
                .createdAt(meal.getCreatedAt())
                .build();
    }
}