import api from './api';

export interface Food {
  id: number;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  description: string;
  imageUrl: string;
  category: 'PROTEIN' | 'CARBOHYDRATE' | 'VEGETABLE' | 'FRUIT' | 'DAIRY' | 'GRAIN' | 'NUTS_SEEDS' | 'BEVERAGE' | 'SNACK' | 'OTHER';
  isActive: boolean;
}

export interface FoodSearchParams {
  name?: string;
  category?: string;
  goalType?: 'LOSS' | 'MAINTAIN' | 'GAIN';
  maxCalories?: number;
  minProtein?: number;
}

export const FoodService = {
  // Get all foods
  async getAllFoods(): Promise<Food[]> {
    const { data } = await api.get('/api/foods');
    return data;
  },

  // Search foods by name
  async searchFoods(query: string): Promise<Food[]> {
    const { data } = await api.get(`/api/foods/search?name=${encodeURIComponent(query)}`);
    return data;
  },

  // Get foods by category
  async getFoodsByCategory(category: string): Promise<Food[]> {
    const { data } = await api.get(`/api/foods/category/${category}`);
    return data;
  },

  // Get recommended foods based on goal
  async getRecommendedFoods(goalType: 'LOSS' | 'MAINTAIN' | 'GAIN'): Promise<Food[]> {
    const { data } = await api.get(`/api/foods/recommendations?goalType=${goalType}`);
    return data;
  },

  // Get high protein foods
  async getHighProteinFoods(): Promise<Food[]> {
    const { data } = await api.get('/api/foods/high-protein');
    return data;
  },

  // Get low calorie foods
  async getLowCalorieFoods(): Promise<Food[]> {
    const { data } = await api.get('/api/foods/low-calorie');
    return data;
  },

  // Get food by ID
  async getFoodById(id: number): Promise<Food> {
    const { data } = await api.get(`/api/foods/${id}`);
    return data;
  },

  // Create new food (admin only)
  async createFood(food: Omit<Food, 'id'>): Promise<Food> {
    const { data } = await api.post('/api/foods', food);
    return data;
  },

  // Update food (admin only)
  async updateFood(id: number, food: Partial<Food>): Promise<Food> {
    const { data } = await api.put(`/api/foods/${id}`, food);
    return data;
  },

  // Delete food (admin only)
  async deleteFood(id: number): Promise<void> {
    await api.delete(`/api/foods/${id}`);
  }
};
