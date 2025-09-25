package com.fitnessapp.fitness_api.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "foods")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Food {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false, unique = true)
    private String name;
    
    @Column(nullable = false)
    private Double calories; // per 100g
    
    @Column(nullable = false)
    private Double protein; // per 100g
    
    @Column(nullable = false)
    private Double carbs; // per 100g
    
    @Column(nullable = false)
    private Double fat; // per 100g
    
    @Column(nullable = false)
    private Double fiber; // per 100g
    
    @Column(length = 1000)
    private String description;
    
    @Column(length = 500)
    private String imageUrl;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private FoodCategory category;
    
    @Column(nullable = false)
    private Boolean isActive = true;
    
    // Helper method to calculate nutrition for specific quantity
    public Double getCaloriesForQuantity(Double quantityInGrams) {
        return (this.calories * quantityInGrams) / 100.0;
    }
    
    public Double getProteinForQuantity(Double quantityInGrams) {
        return (this.protein * quantityInGrams) / 100.0;
    }
    
    public Double getCarbsForQuantity(Double quantityInGrams) {
        return (this.carbs * quantityInGrams) / 100.0;
    }
    
    public Double getFatForQuantity(Double quantityInGrams) {
        return (this.fat * quantityInGrams) / 100.0;
    }
    
    public Double getFiberForQuantity(Double quantityInGrams) {
        return (this.fiber * quantityInGrams) / 100.0;
    }
}
