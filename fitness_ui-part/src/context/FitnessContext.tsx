import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { UserGoals, Meal, ProgressEntry, FitnessContextType, BackendMeal, DailyNutrition } from '../types';
import { useAuth } from './AuthContext';
import { MealService } from '../services/mealService';
import { UserService } from '../services/userService';

const FitnessContext = createContext<FitnessContextType | undefined>(undefined);

export const useFitness = () => {
  const context = useContext(FitnessContext);
  if (context === undefined) {
    throw new Error('useFitness must be used within a FitnessProvider');
  }
  return context;
};

interface FitnessProviderProps {
  children: ReactNode;
}

export const FitnessProvider: React.FC<FitnessProviderProps> = ({ children }) => {
  const { user, userProfile } = useAuth();
  const [goals, setGoalsState] = useState<UserGoals | null>(null);
  const [meals, setMeals] = useState<Meal[]>([]);
  const [progress, setProgress] = useState<ProgressEntry[]>([]);
  const [dailyNutrition, setDailyNutrition] = useState<DailyNutrition | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load user data when user changes
  useEffect(() => {
    if (user && userProfile) {
      loadUserData();
    } else {
      // Clear data when user logs out
      setGoalsState(null);
      setMeals([]);
      setProgress([]);
      setDailyNutrition(null);
    }
  }, [user, userProfile]);

  // Auto-refresh data every 5 minutes
  useEffect(() => {
    if (user) {
      const interval = setInterval(() => {
        loadUserData();
      }, 5 * 60 * 1000); // 5 minutes

      return () => clearInterval(interval);
    }
  }, [user]);

  const loadUserData = async () => {
    if (!user) return;

    setIsLoading(true);
    setError(null);

    try {
      // Load user profile and goals
      if (userProfile) {
        const userGoals: UserGoals = {
          age: userProfile.age || 25,
          gender: userProfile.gender?.toLowerCase() as 'male' | 'female' || 'male',
          height: userProfile.height || 170,
          weight: userProfile.weight || 70,
          activityLevel: userProfile.activityLevel?.toLowerCase() as any || 'moderately_active',
          goal: userProfile.goal?.toLowerCase() as any || 'maintain',
          dailyCalorieTarget: userProfile.dailyCalorieTarget || 2000
        };
        setGoalsState(userGoals);
      }

      // Load meals and nutrition
      await Promise.all([
        loadMeals(),
        loadDailyNutrition()
      ]);
    } catch (err) {
      console.error('Error loading user data:', err);
      setError('Failed to load data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const loadMeals = async () => {
    try {
      const backendMeals = await MealService.getMealsForDate();
      const convertedMeals = convertBackendMealsToFrontend(backendMeals);
      setMeals(convertedMeals);
      
      // Update progress from meals
      updateProgressFromMeals(convertedMeals);
    } catch (err) {
      console.error('Error loading meals:', err);
    }
  };

  const loadDailyNutrition = async () => {
    try {
      const nutrition = await MealService.getDailyNutrition();
      setDailyNutrition(nutrition);
    } catch (err) {
      console.error('Error loading daily nutrition:', err);
    }
  };

  const convertBackendMealsToFrontend = (backendMeals: BackendMeal[]): Meal[] => {
    // Group meals by date and type
    const mealGroups: { [key: string]: BackendMeal[] } = {};
    
    backendMeals.forEach(meal => {
      const key = `${meal.mealDate}-${meal.mealType}`;
      if (!mealGroups[key]) {
        mealGroups[key] = [];
      }
      mealGroups[key].push(meal);
    });

    // Convert to frontend format
    return Object.entries(mealGroups).map(([key, meals]) => {
      const [date, type] = key.split('-');
      const totalCalories = meals.reduce((sum, meal) => sum + meal.calories, 0);
      
      return {
        id: meals[0].id.toString(),
        type: type.toLowerCase() as any,
        foods: meals.map(meal => ({
          food: {
            id: meal.foodId?.toString() || 'unknown',
            name: meal.foodName,
            calories: meal.calories / meal.quantity * 100, // per 100g
            protein: meal.protein / meal.quantity * 100,
            carbs: meal.carbs / meal.quantity * 100,
            fat: meal.fat / meal.quantity * 100,
            image: '/placeholder-food.jpg'
          },
          quantity: meal.quantity,
          calories: meal.calories
        })),
        date,
        totalCalories
      };
    });
  };

  const updateProgressFromMeals = (meals: Meal[]) => {
    const progressMap: { [date: string]: ProgressEntry } = {};
    
    meals.forEach(meal => {
      if (!progressMap[meal.date]) {
        progressMap[meal.date] = {
          date: meal.date,
          caloriesConsumed: 0,
          caloriesTarget: goals?.dailyCalorieTarget || 2000
        };
      }
      progressMap[meal.date].caloriesConsumed += meal.totalCalories;
    });

    const newProgress = Object.values(progressMap);
    setProgress(newProgress);
  };

  const setGoals = async (newGoals: UserGoals) => {
    setGoalsState(newGoals);
    
    // Update user profile in backend
    if (userProfile) {
      try {
        await UserService.updateProfile({
          name: userProfile.name,
          age: newGoals.age,
          weight: newGoals.weight,
          height: newGoals.height,
          gender: newGoals.gender.toUpperCase() as 'MALE' | 'FEMALE',
          activityLevel: newGoals.activityLevel.toUpperCase() as any,
          goal: newGoals.goal.toUpperCase() as any
        });
      } catch (err) {
        console.error('Error updating profile:', err);
      }
    }
  };

  const addMeal = async (mealData: Omit<Meal, 'id'>) => {
    try {
      // Convert frontend meal to backend format
      const backendMeal = {
        foodId: mealData.foods[0]?.food.id ? parseInt(mealData.foods[0].food.id) : undefined,
        foodName: mealData.foods[0]?.food.name || 'Unknown Food',
        mealType: mealData.type.toUpperCase() as any,
        quantity: mealData.foods.reduce((sum, f) => sum + f.quantity, 0),
        mealDate: mealData.date
      };

      await MealService.addMeal(backendMeal);
      
      // Reload data
      await loadMeals();
      await loadDailyNutrition();
    } catch (err) {
      console.error('Error adding meal:', err);
      setError('Failed to add meal. Please try again.');
    }
  };

  const updateProgress = (entry: ProgressEntry) => {
    const existingIndex = progress.findIndex(p => p.date === entry.date);
    let updatedProgress;
    
    if (existingIndex >= 0) {
      updatedProgress = [...progress];
      updatedProgress[existingIndex] = entry;
    } else {
      updatedProgress = [...progress, entry];
    }
    
    setProgress(updatedProgress);
  };

  const getTodayProgress = (): ProgressEntry | null => {
    const today = new Date().toISOString().split('T')[0];
    return progress.find(p => p.date === today) || null;
  };

  const getWeeklyProgress = (): ProgressEntry[] => {
    const today = new Date();
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    
    return progress.filter(p => {
      const date = new Date(p.date);
      return date >= weekAgo && date <= today;
    }).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  };

  const value: FitnessContextType = {
    goals,
    meals,
    progress,
    setGoals,
    addMeal,
    updateProgress,
    getTodayProgress,
    getWeeklyProgress
  };

  return (
    <FitnessContext.Provider value={value}>
      {children}
    </FitnessContext.Provider>
  );
};