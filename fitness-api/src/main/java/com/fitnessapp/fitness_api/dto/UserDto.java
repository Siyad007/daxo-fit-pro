package com.fitnessapp.fitness_api.dto;

import com.fitnessapp.fitness_api.entity.ActivityLevel;
import com.fitnessapp.fitness_api.entity.Gender;
import com.fitnessapp.fitness_api.entity.GoalType;
import lombok.Data;

@Data
public class UserDto {
    private String name;
    private Integer age;
    private Double weight;
    private Double height;
    private Gender gender;
    private ActivityLevel activityLevel;
    private GoalType goal;
}
