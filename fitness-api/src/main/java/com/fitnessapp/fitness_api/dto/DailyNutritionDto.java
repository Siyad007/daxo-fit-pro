package com.fitnessapp.fitness_api.dto;

import lombok.*;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DailyNutritionDto {
    private LocalDate date;
    private Double totalCalories;
    private Double totalProtein;
    private Double totalCarbs;
    private Double totalFat;
    private Double totalFiber;
    private Double targetCalories;
    private Double remainingCalories;
    private Double calorieProgress; // percentage
}
