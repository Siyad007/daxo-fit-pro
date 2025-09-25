package com.fitnessapp.fitness_api.dto;

import com.fitnessapp.fitness_api.entity.FoodCategory;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FoodDto {
    private Long id;
    private String name;
    private Double calories;
    private Double protein;
    private Double carbs;
    private Double fat;
    private Double fiber;
    private String description;
    private String imageUrl;
    private FoodCategory category;
    private Boolean isActive;
}
