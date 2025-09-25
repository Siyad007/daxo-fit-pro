package com.fitnessapp.fitness_api.dto;

import com.fitnessapp.fitness_api.entity.MealType;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MealDto {
    private Long id;
    private Long userId;
    private Long foodId;
    private String foodName;
    private MealType mealType;
    private Double quantity; // in grams
    private Double calories;
    private Double protein;
    private Double carbs;
    private Double fat;
    private Double fiber;
    private LocalDate mealDate;
    private LocalDateTime createdAt;
}
