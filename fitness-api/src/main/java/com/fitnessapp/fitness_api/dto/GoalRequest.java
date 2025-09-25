package com.fitnessapp.fitness_api.dto;

import com.fitnessapp.fitness_api.entity.GoalType;
import lombok.Data;

import java.time.LocalDate;

@Data
public class GoalRequest {

    private String description;       // Example: "Gain weight to 70kg in 2 months"
    private double targetWeight;      // Example: 70.0
    private LocalDate targetDate;     // Example: 2025-11-30
    private GoalType type;            // LOSS, GAIN, MAINTAIN
}
