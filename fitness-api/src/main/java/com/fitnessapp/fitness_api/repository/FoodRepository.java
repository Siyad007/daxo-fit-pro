package com.fitnessapp.fitness_api.repository;

import com.fitnessapp.fitness_api.entity.Food;
import com.fitnessapp.fitness_api.entity.FoodCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FoodRepository extends JpaRepository<Food, Long> {
    
    List<Food> findByIsActiveTrue();
    
    List<Food> findByCategoryAndIsActiveTrue(FoodCategory category);
    
    @Query("SELECT f FROM Food f WHERE f.name ILIKE %:name% AND f.isActive = true")
    List<Food> findByNameContainingIgnoreCase(@Param("name") String name);
    
    @Query("SELECT f FROM Food f WHERE f.isActive = true ORDER BY f.calories ASC")
    List<Food> findAllByCaloriesAsc();
    
    @Query("SELECT f FROM Food f WHERE f.isActive = true ORDER BY f.protein DESC")
    List<Food> findAllByProteinDesc();
    
    @Query("SELECT f FROM Food f WHERE f.isActive = true AND f.calories <= :maxCalories ORDER BY f.calories ASC")
    List<Food> findLowCalorieFoods(@Param("maxCalories") Double maxCalories);
    
    @Query("SELECT f FROM Food f WHERE f.isActive = true AND f.protein >= :minProtein ORDER BY f.protein DESC")
    List<Food> findHighProteinFoods(@Param("minProtein") Double minProtein);
}
