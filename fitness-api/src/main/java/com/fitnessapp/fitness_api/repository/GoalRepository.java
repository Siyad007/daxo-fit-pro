package com.fitnessapp.fitness_api.repository;

import com.fitnessapp.fitness_api.entity.Goal;
import com.fitnessapp.fitness_api.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface GoalRepository extends JpaRepository<Goal, Long> {
    List<Goal> findByUser(User user);
}
