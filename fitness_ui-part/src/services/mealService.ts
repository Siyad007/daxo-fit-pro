import api from './api';

export interface Meal {
  id: number;
  userId: number;
  foodId?: number;
  foodName: string;
  mealType: 'BREAKFAST' | 'LUNCH' | 'DINNER' | 'SNACK';
  quantity: number; // in grams
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  mealDate: string;
  createdAt: string;
}

export interface MealRequest {
  foodId?: number;
  foodName?: string;
  mealType: 'BREAKFAST' | 'LUNCH' | 'DINNER' | 'SNACK';
  quantity: number;
  mealDate?: string;
}

export interface DailyNutrition {
  date: string;
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
  totalFiber: number;
  targetCalories: number;
  remainingCalories: number;
  calorieProgress: number; // percentage
}

export const MealService = {
  // Add a meal
  async addMeal(mealData: MealRequest): Promise<string> {
    const { data } = await api.post('/api/meals/add', mealData);
    return data;
  },

  // Get meals for a specific date
  async getMealsForDate(date?: string): Promise<Meal[]> {
    const params = date ? `?date=${date}` : '';
    const { data } = await api.get(`/api/meals${params}`);
    return data;
  },

  // Get all meals for user
  async getAllMeals(): Promise<Meal[]> {
    const { data } = await api.get('/api/meals/all');
    return data;
  },

  // Get daily nutrition summary
  async getDailyNutrition(date?: string): Promise<DailyNutrition> {
    const params = date ? `?date=${date}` : '';
    const { data } = await api.get(`/api/meals/nutrition${params}`);
    return data;
  },

  // Update a meal
  async updateMeal(mealId: number, mealData: MealRequest): Promise<string> {
    const { data } = await api.put(`/api/meals/${mealId}`, mealData);
    return data;
  },

  // Delete a meal
  async deleteMeal(mealId: number): Promise<string> {
    const { data } = await api.delete(`/api/meals/${mealId}`);
    return data;
  },

  // Get meals by type for a date
  async getMealsByType(mealType: string, date?: string): Promise<Meal[]> {
    const meals = await this.getMealsForDate(date);
    return meals.filter(meal => meal.mealType === mealType);
  },

  // Get total calories for a meal type on a date
  async getTotalCaloriesForType(mealType: string, date?: string): Promise<number> {
    const meals = await this.getMealsByType(mealType, date);
    return meals.reduce((total, meal) => total + meal.calories, 0);
  }
};
