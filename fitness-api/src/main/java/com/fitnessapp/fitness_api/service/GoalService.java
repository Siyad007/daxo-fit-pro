package com.fitnessapp.fitness_api.service;

import com.fitnessapp.fitness_api.entity.Goal;
import com.fitnessapp.fitness_api.repository.GoalRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class GoalService {
    private final GoalRepository goalRepository;

    public GoalService(GoalRepository goalRepository) {
        this.goalRepository = goalRepository;
    }

    public List<Goal> getAllGoals() {
        return goalRepository.findAll();
    }

    public Goal getGoalById(Long id) {
        return goalRepository.findById(id).orElse(null);
    }

    public Goal createGoal(Goal goal) {
        return goalRepository.save(goal);
    }

    public Goal updateGoal(Long id, Goal goalDetails) {
        return goalRepository.findById(id)
                .map(goal -> {
                    goal.setDescription(goalDetails.getDescription());
                    goal.setTargetWeight(goalDetails.getTargetWeight());
                    return goalRepository.save(goal);
                }).orElse(null);
    }

    public void deleteGoal(Long id) {
        goalRepository.deleteById(id);
    }
}
