package com.fitnessapp.fitness_api.dto;

import com.fitnessapp.fitness_api.entity.MealType;
import lombok.*;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MealRequest {
    private Long foodId;
    private String foodName; // For backward compatibility
    private MealType mealType;
    private Double quantity; // in grams
    private LocalDate mealDate;
}