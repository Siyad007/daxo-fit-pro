import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Target, 
  Plus, 
  TrendingUp, 
  Utensils,
  Calendar,
  Award,
  Flame,
  Activity,
  Clock,
  Zap,
  Leaf,
  Apple,
  TrendingDown,
  AlertCircle,
  CheckCircle,
  Star
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useFitness } from '../context/FitnessContext';
import { FoodService, Food } from '../services/foodService';
import { MealService, DailyNutrition } from '../services/mealService';
import Card from '../components/UI/Card';
import Button from '../components/UI/Button';
import ProgressBar from '../components/UI/ProgressBar';

const DashboardPage: React.FC = () => {
  const { user, userProfile } = useAuth();
  const { goals, getTodayProgress } = useFitness();
  const [dailyNutrition, setDailyNutrition] = useState<DailyNutrition | null>(null);
  const [recommendedFoods, setRecommendedFoods] = useState<Food[]>([]);
  const [recentMeals, setRecentMeals] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const todayProgress = getTodayProgress();
  const caloriesConsumed = dailyNutrition?.totalCalories || todayProgress?.caloriesConsumed || 0;
  const caloriesTarget = dailyNutrition?.targetCalories || goals?.dailyCalorieTarget || 2000;
  const remainingCalories = dailyNutrition?.remainingCalories || Math.max(caloriesTarget - caloriesConsumed, 0);
  
  const progressPercentage = dailyNutrition?.calorieProgress || (caloriesConsumed / caloriesTarget) * 100;

  useEffect(() => {
    loadDashboardData();
  }, [user, goals]);

  const loadDashboardData = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const [nutrition, meals, foods] = await Promise.all([
        MealService.getDailyNutrition(),
        MealService.getMealsForDate(),
        goals ? FoodService.getRecommendedFoods(goals.goal.toUpperCase() as any) : Promise.resolve([])
      ]);
      
      setDailyNutrition(nutrition);
      setRecentMeals(meals.slice(0, 3));
      setRecommendedFoods(foods.slice(0, 4));
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const quickActions = [
    {
      title: 'Add Meal',
      description: 'Log your food intake',
      icon: Plus,
      href: '/meals',
      color: 'from-emerald-500 to-emerald-600'
    },
    {
      title: 'Food Database',
      description: 'Browse healthy foods',
      icon: Utensils,
      href: '/foods',
      color: 'from-orange-500 to-orange-600'
    },
    {
      title: 'Recommendations',
      description: 'Get meal suggestions',
      icon: Target,
      href: '/recommendations',
      color: 'from-blue-500 to-blue-600'
    },
    {
      title: 'Track Progress',
      description: 'View your analytics',
      icon: TrendingUp,
      href: '/progress',
      color: 'from-purple-500 to-purple-600'
    }
  ];

  const stats = [
    {
      label: 'Calories Today',
      value: Math.round(caloriesConsumed),
      target: Math.round(caloriesTarget),
      icon: Flame,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100'
    },
    {
      label: 'Protein',
      value: Math.round(dailyNutrition?.totalProtein || 0),
      suffix: 'g',
      icon: Zap,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      label: 'Progress',
      value: Math.round(progressPercentage),
      suffix: '%',
      icon: Award,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-100'
    }
  ];

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const getMotivationalMessage = () => {
    if (progressPercentage >= 100) {
      return { message: "Amazing! You've reached your daily goal! 🎉", type: 'success' };
    } else if (progressPercentage >= 80) {
      return { message: "You're almost there! Keep it up! 💪", type: 'warning' };
    } else if (progressPercentage >= 50) {
      return { message: "Great progress! You're halfway there! 🌟", type: 'info' };
    } else {
      return { message: "Let's get started! Every meal counts! 🚀", type: 'info' };
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
        </div>
      </div>
    );
  }

  if (!goals) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Card className="p-8 text-center">
          <Target className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Set Your Goals First</h2>
          <p className="text-gray-600 mb-6">
            To get started with tracking your fitness journey, we need to set up your personal goals and calculate your daily calorie needs.
          </p>
          <Link to="/goals">
            <Button size="lg">
              Set Up Goals
              <Target className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Welcome Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-gray-900">
          {getGreeting()}, {user?.name || 'there'}! 👋
        </h1>
        <p className="text-gray-600 mt-2">
          {new Date().toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </p>
        
        {/* Motivational Message */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className={`mt-4 p-4 rounded-lg ${
            getMotivationalMessage().type === 'success' ? 'bg-green-50 border border-green-200' :
            getMotivationalMessage().type === 'warning' ? 'bg-yellow-50 border border-yellow-200' :
            'bg-blue-50 border border-blue-200'
          }`}
        >
          <p className={`font-medium ${
            getMotivationalMessage().type === 'success' ? 'text-green-800' :
            getMotivationalMessage().type === 'warning' ? 'text-yellow-800' :
            'text-blue-800'
          }`}>
            {getMotivationalMessage().message}
          </p>
        </motion.div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
          >
            <Card>
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                    <p className="text-3xl font-bold text-gray-900">
                      {stat.value.toLocaleString()}{stat.suffix}
                      {stat.target && (
                        <span className="text-sm text-gray-500 font-normal">
                          /{stat.target.toLocaleString()}
                        </span>
                      )}
                    </p>
                  </div>
                  <div className={`w-12 h-12 ${stat.bgColor} rounded-lg flex items-center justify-center`}>
                    <stat.icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Progress Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="mb-8"
      >
        <Card>
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Today's Progress</h2>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Calendar className="w-4 h-4" />
                <span>Daily Goal</span>
              </div>
            </div>
            
            <ProgressBar
              value={caloriesConsumed}
              max={caloriesTarget}
              label={`${caloriesConsumed} / ${caloriesTarget} calories`}
              size="lg"
              color={progressPercentage > 100 ? 'red' : progressPercentage > 80 ? 'yellow' : 'emerald'}
            />
            
            <div className="mt-4 flex justify-between text-sm">
              <span className="text-gray-600">
                {remainingCalories > 0 ? `${remainingCalories} calories remaining` : 'Goal exceeded!'}
              </span>
              <span className={`font-medium ${
                progressPercentage > 100 ? 'text-red-600' : 
                progressPercentage > 80 ? 'text-yellow-600' : 'text-emerald-600'
              }`}>
                {progressPercentage.toFixed(1)}% of goal
              </span>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="mb-8"
      >
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {quickActions.map((action, index) => (
            <motion.div
              key={action.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 + index * 0.1 }}
            >
              <Link to={action.href}>
                <Card hover className="p-6 cursor-pointer group">
                  <div className="flex items-center space-x-4">
                    <div className={`w-12 h-12 bg-gradient-to-r ${action.color} rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform`}>
                      <action.icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 group-hover:text-emerald-600 transition-colors">
                        {action.title}
                      </h3>
                      <p className="text-gray-600 text-sm">{action.description}</p>
                    </div>
                  </div>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Recent Meals & Recommendations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Recent Meals */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <Card>
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Recent Meals</h3>
                <Link to="/meals">
                  <Button variant="ghost" size="sm">View All</Button>
                </Link>
              </div>
              
              {recentMeals.length === 0 ? (
                <div className="text-center py-8">
                  <Utensils className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-4">No meals logged today</p>
                  <Link to="/meals">
                    <Button size="sm">Add Your First Meal</Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {recentMeals.map((meal, index) => (
                    <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-lg flex items-center justify-center">
                        <Utensils className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{meal.foodName}</p>
                        <p className="text-sm text-gray-600">
                          {meal.mealType} • {Math.round(meal.calories)} cal
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">{meal.quantity}g</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </Card>
        </motion.div>

        {/* Recommended Foods */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
        >
          <Card>
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Recommended for You</h3>
                <Link to="/foods">
                  <Button variant="ghost" size="sm">Browse All</Button>
                </Link>
              </div>
              
              {recommendedFoods.length === 0 ? (
                <div className="text-center py-8">
                  <Star className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-4">Loading recommendations...</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {recommendedFoods.map((food) => (
                    <div key={food.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <img
                        src={food.imageUrl}
                        alt={food.name}
                        className="w-10 h-10 object-cover rounded-lg"
                        onError={(e) => {
                          e.currentTarget.src = '/placeholder-food.jpg';
                        }}
                      />
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{food.name}</p>
                        <p className="text-sm text-gray-600">
                          {food.calories} cal • {food.protein}g protein
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="text-xs px-2 py-1 bg-emerald-100 text-emerald-800 rounded-full">
                          {food.category.replace('_', ' ')}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Macro Breakdown */}
      {dailyNutrition && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mb-8"
        >
          <Card>
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Today's Nutrition Breakdown</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-red-50 rounded-lg">
                  <div className="text-2xl font-bold text-red-600">{Math.round(dailyNutrition.totalProtein)}g</div>
                  <div className="text-sm text-gray-600">Protein</div>
                </div>
                <div className="text-center p-4 bg-yellow-50 rounded-lg">
                  <div className="text-2xl font-bold text-yellow-600">{Math.round(dailyNutrition.totalCarbs)}g</div>
                  <div className="text-sm text-gray-600">Carbs</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{Math.round(dailyNutrition.totalFat)}g</div>
                  <div className="text-sm text-gray-600">Fat</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">{Math.round(dailyNutrition.totalFiber)}g</div>
                  <div className="text-sm text-gray-600">Fiber</div>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
      )}
    </div>
  );
};

export default DashboardPage;