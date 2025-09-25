export interface User {
  id: string;
  email: string;
  name?: string;
}

export interface UserGoals {
  age: number;
  gender: 'male' | 'female';
  height: number; // in cm
  weight: number; // in kg
  activityLevel: 'sedentary' | 'lightly_active' | 'moderately_active' | 'very_active' | 'extra_active';
  goal: 'lose' | 'maintain' | 'gain';
  dailyCalorieTarget: number;
}

export interface Food {
  id: string;
  name: string;
  calories: number;
  protein?: number;
  carbs?: number;
  fat?: number;
  image?: string;
}

export interface Meal {
  id: string;
  type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  foods: MealFood[];
  date: string;
  totalCalories: number;
}

export interface MealFood {
  food: Food;
  quantity: number;
  calories: number;
}

export interface ProgressEntry {
  date: string;
  caloriesConsumed: number;
  caloriesTarget: number;
  weight?: number;
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string, confirmPassword: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
  error?: string;
  userProfile?: any;
}

export interface FitnessContextType {
  goals: UserGoals | null;
  meals: Meal[];
  progress: ProgressEntry[];
  setGoals: (goals: UserGoals) => void;
  addMeal: (meal: Omit<Meal, 'id'>) => void;
  updateProgress: (entry: ProgressEntry) => void;
  getTodayProgress: () => ProgressEntry | null;
  getWeeklyProgress: () => ProgressEntry[];
}

// New types for backend integration
export interface BackendFood {
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

export interface BackendMeal {
  id: number;
  userId: number;
  foodId?: number;
  foodName: string;
  mealType: 'BREAKFAST' | 'LUNCH' | 'DINNER' | 'SNACK';
  quantity: number;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  mealDate: string;
  createdAt: string;
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
  calorieProgress: number;
}

export interface Goal {
  id: number;
  description: string;
  targetWeight: number;
  targetDate: string;
  type: 'LOSS' | 'MAINTAIN' | 'GAIN';
  userId: number;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: string;
  progress: number;
  maxProgress: number;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  type: 'daily' | 'weekly' | 'monthly';
  target: number;
  current: number;
  reward: string;
  expiresAt: string;
  completed: boolean;
}