package com.fitnessapp.fitness_api.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "goals")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Goal {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String description;       // Example: "Gain weight to 70kg in 2 months"
    private double targetWeight;      // Example: 70.0
    private LocalDate targetDate;     // Example: 2 months from now

    @Enumerated(EnumType.STRING)
    private GoalType type;            // LOSS, GAIN, MAINTAIN

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;                // link to the owner user
}
