package com.fitnessapp.fitness_api.service;

import com.fitnessapp.fitness_api.entity.User;
import com.fitnessapp.fitness_api.entity.Gender;
import com.fitnessapp.fitness_api.entity.ActivityLevel;
import com.fitnessapp.fitness_api.entity.GoalType;
import com.fitnessapp.fitness_api.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    // Create a new user
    public User createUser(User user) {
        // Calculate daily calories before saving
        int dailyCalories = calculateDailyCalories(user);
        user.setDailyCalorieTarget(dailyCalories);
        return userRepository.save(user);
    }

    // Get all users
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    // Get user by ID
    public User getUserById(Long id) {
        return userRepository.findById(id).orElse(null);
    }

    // Get user by email
    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email).orElse(null);
    }

    // Update user
    public User updateUser(Long id, User updatedUser) {
        return userRepository.findById(id)
                .map(user -> {
                    user.setName(updatedUser.getName());
                    user.setAge(updatedUser.getAge());
                    user.setHeight(updatedUser.getHeight());
                    user.setWeight(updatedUser.getWeight());
                    user.setGoal(updatedUser.getGoal());
                    user.setGender(updatedUser.getGender());
                    user.setActivityLevel(updatedUser.getActivityLevel());

                    // Recalculate daily calories if any key field changed
                    int dailyCalories = calculateDailyCalories(user);
                    user.setDailyCalorieTarget(dailyCalories);

                    return userRepository.save(user);
                }).orElse(null);
    }

    // Delete user
    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }

    // Calculate daily calories based on gender, activity, and goal
    public int calculateDailyCalories(User u) {
        double bmr;

        // BMR formula (Mifflin-St Jeor)
        if (u.getGender() == null || u.getGender() == Gender.MALE) {
            bmr = 10 * u.getWeight() + 6.25 * u.getHeight() - 5 * u.getAge() + 5;
        } else { // FEMALE
            bmr = 10 * u.getWeight() + 6.25 * u.getHeight() - 5 * u.getAge() - 161;
        }

        // Activity factor
        double factor;
        if (u.getActivityLevel() == null) factor = 1.2; // Sedentary default
        else {
            switch (u.getActivityLevel()) {
                case LIGHT -> factor = 1.375;
                case MODERATE -> factor = 1.55;
                case ACTIVE -> factor = 1.725;
                default -> factor = 1.2;
            }
        }

        double tdee = bmr * factor;

        // Adjust based on goal
        if (u.getGoal() != null) {
            switch (u.getGoal()) {
                case LOSS -> tdee -= 500;
                case GAIN -> tdee += 500;
                default -> {} // MAINTAIN -> no change
            }
        }

        return (int) Math.round(tdee);
    }
}
