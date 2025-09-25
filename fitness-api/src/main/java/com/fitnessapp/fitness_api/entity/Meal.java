package com.fitnessapp.fitness_api.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.time.LocalDate;

@Entity
@Table(name = "meals")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Meal {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne
    @JoinColumn(name = "food_id")
    private Food food;

    @Enumerated(EnumType.STRING)
    private MealType mealType;

    private String foodName; // Keep for backward compatibility
    private double quantity;   // in grams
    private double calories;
    private double protein;
    private double carbs;
    private double fat;
    private double fiber;
    
    @Column(name = "meal_date")
    private LocalDate mealDate;
    
    private LocalDateTime createdAt;
    
    // Helper method to calculate total nutrition
    public void calculateNutrition() {
        if (food != null) {
            this.calories = food.getCaloriesForQuantity(this.quantity);
            this.protein = food.getProteinForQuantity(this.quantity);
            this.carbs = food.getCarbsForQuantity(this.quantity);
            this.fat = food.getFatForQuantity(this.quantity);
            this.fiber = food.getFiberForQuantity(this.quantity);
        }
    }
}
