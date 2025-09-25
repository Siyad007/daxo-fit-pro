package com.fitnessapp.fitness_api.service;

import com.fitnessapp.fitness_api.entity.Food;
import com.fitnessapp.fitness_api.entity.FoodCategory;
import com.fitnessapp.fitness_api.repository.FoodRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class DataInitializationService implements CommandLineRunner {

    private final FoodRepository foodRepository;

    @Override
    public void run(String... args) throws Exception {
        // Only initialize if no foods exist
        if (foodRepository.count() == 0) {
            initializeFoodData();
        }
    }

    private void initializeFoodData() {
        // Protein foods
        foodRepository.save(createFood("Grilled Chicken Breast", 165.0, 31.0, 0.0, 3.6, 0.0, 
                "Lean protein source", "https://images.unsplash.com/photo-1532550907401-a500c9a57435?w=200&h=200&fit=crop", 
                FoodCategory.PROTEIN));
        
        foodRepository.save(createFood("Salmon Fillet", 208.0, 25.0, 0.0, 12.0, 0.0, 
                "Rich in omega-3 fatty acids", "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=200&h=200&fit=crop", 
                FoodCategory.PROTEIN));
        
        foodRepository.save(createFood("Eggs", 155.0, 13.0, 1.1, 11.0, 0.0, 
                "Complete protein with all essential amino acids", "https://images.unsplash.com/photo-1518569656558-1e25a4d4b9bc?w=200&h=200&fit=crop", 
                FoodCategory.PROTEIN));
        
        foodRepository.save(createFood("Greek Yogurt", 100.0, 17.0, 6.0, 0.4, 0.0, 
                "High protein dairy product", "https://images.unsplash.com/photo-1571212515410-3b4b2b0b0b0b?w=200&h=200&fit=crop", 
                FoodCategory.DAIRY));

        // Carbohydrate foods
        foodRepository.save(createFood("Brown Rice", 111.0, 2.6, 23.0, 0.9, 1.8, 
                "Whole grain complex carbohydrate", "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=200&h=200&fit=crop", 
                FoodCategory.GRAIN));
        
        foodRepository.save(createFood("Quinoa", 120.0, 4.4, 22.0, 1.9, 2.8, 
                "Complete protein grain", "https://images.unsplash.com/photo-1512058564366-18510be2db19?w=200&h=200&fit=crop", 
                FoodCategory.GRAIN));
        
        foodRepository.save(createFood("Sweet Potato", 86.0, 1.6, 20.0, 0.1, 3.0, 
                "Nutritious complex carbohydrate", "https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=200&h=200&fit=crop", 
                FoodCategory.CARBOHYDRATE));

        // Vegetables
        foodRepository.save(createFood("Broccoli", 34.0, 2.8, 7.0, 0.4, 2.6, 
                "High in vitamins and fiber", "https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=200&h=200&fit=crop", 
                FoodCategory.VEGETABLE));
        
        foodRepository.save(createFood("Spinach", 23.0, 2.9, 3.6, 0.4, 2.2, 
                "Iron-rich leafy green", "https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=200&h=200&fit=crop", 
                FoodCategory.VEGETABLE));

        // Fruits
        foodRepository.save(createFood("Avocado", 160.0, 2.0, 9.0, 15.0, 6.7, 
                "Healthy monounsaturated fats", "https://images.unsplash.com/photo-1519162808019-7de1683fa2ad?w=200&h=200&fit=crop", 
                FoodCategory.FRUIT));
        
        foodRepository.save(createFood("Banana", 89.0, 1.1, 23.0, 0.3, 2.6, 
                "Natural energy source", "https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=200&h=200&fit=crop", 
                FoodCategory.FRUIT));

        // Nuts and Seeds
        foodRepository.save(createFood("Almonds", 579.0, 21.0, 22.0, 50.0, 12.0, 
                "Healthy fats and protein", "https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=200&h=200&fit=crop", 
                FoodCategory.NUTS_SEEDS));
        
        foodRepository.save(createFood("Chia Seeds", 486.0, 17.0, 42.0, 31.0, 34.0, 
                "High in omega-3 and fiber", "https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=200&h=200&fit=crop", 
                FoodCategory.NUTS_SEEDS));

        // Snacks
        foodRepository.save(createFood("Oatmeal", 68.0, 2.4, 12.0, 1.4, 1.7, 
                "Fiber-rich breakfast option", "https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=200&h=200&fit=crop", 
                FoodCategory.GRAIN));
        
        foodRepository.save(createFood("Apple", 52.0, 0.3, 14.0, 0.2, 2.4, 
                "Fiber-rich fruit", "https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=200&h=200&fit=crop", 
                FoodCategory.FRUIT));
    }

    private Food createFood(String name, Double calories, Double protein, Double carbs, 
                           Double fat, Double fiber, String description, String imageUrl, FoodCategory category) {
        return Food.builder()
                .name(name)
                .calories(calories)
                .protein(protein)
                .carbs(carbs)
                .fat(fat)
                .fiber(fiber)
                .description(description)
                .imageUrl(imageUrl)
                .category(category)
                .isActive(true)
                .build();
    }
}
