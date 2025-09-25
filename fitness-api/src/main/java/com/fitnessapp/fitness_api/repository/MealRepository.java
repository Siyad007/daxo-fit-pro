package com.fitnessapp.fitness_api.repository;

import com.fitnessapp.fitness_api.entity.Meal;
import com.fitnessapp.fitness_api.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public interface MealRepository extends JpaRepository<Meal, Long> {
    List<Meal> findByUserAndCreatedAtBetween(User user, LocalDateTime start, LocalDateTime end);
    List<Meal> findByUserAndMealDate(User user, LocalDate date);
    List<Meal> findByUser(User user);
}