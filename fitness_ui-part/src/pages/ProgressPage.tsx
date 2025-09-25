import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  Calendar, 
  Target, 
  Award,
  Flame,
  Activity,
  Zap,
  Leaf,
  Apple,
  Clock,
  Trophy,
  Star
} from 'lucide-react';
import { useFitness } from '../context/FitnessContext';
import { MealService, DailyNutrition } from '../services/mealService';
import { GoalService, Goal } from '../services/goalService';
import Card from '../components/UI/Card';
import SimpleChart from '../components/Charts/SimpleChart';

const ProgressPage: React.FC = () => {
  const { goals, getWeeklyProgress, getTodayProgress } = useFitness();
  const [dailyNutrition, setDailyNutrition] = useState<DailyNutrition | null>(null);
  const [weeklyNutrition, setWeeklyNutrition] = useState<DailyNutrition[]>([]);
  const [goalsList, setGoalsList] = useState<Goal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const weeklyProgress = getWeeklyProgress();
  const todayProgress = getTodayProgress();

  useEffect(() => {
    loadProgressData();
  }, []);

  const loadProgressData = async () => {
    setIsLoading(true);
    try {
      const [nutrition, goals] = await Promise.all([
        MealService.getDailyNutrition(),
        GoalService.getMyGoals()
      ]);
      
      setDailyNutrition(nutrition);
      setGoalsList(goals);
      
      // Load weekly nutrition data
      const weeklyData = [];
      for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];
        
        try {
          const dayNutrition = await MealService.getDailyNutrition(dateStr);
          weeklyData.push(dayNutrition);
        } catch (error) {
          // If no data for this day, create empty entry
          weeklyData.push({
            date: dateStr,
            totalCalories: 0,
            totalProtein: 0,
            totalCarbs: 0,
            totalFat: 0,
            totalFiber: 0,
            targetCalories: goals?.dailyCalorieTarget || 2000,
            remainingCalories: goals?.dailyCalorieTarget || 2000,
            calorieProgress: 0
          });
        }
      }
      
      setWeeklyNutrition(weeklyData);
    } catch (error) {
      console.error('Error loading progress data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Generate chart data from real nutrition data
  const generateChartData = () => {
    return weeklyNutrition.map((day, index) => {
      const date = new Date(day.date);
      return {
        label: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        value: day.totalCalories,
        color: day.calorieProgress >= 100 ? '#ef4444' : day.calorieProgress >= 80 ? '#f59e0b' : '#10b981'
      };
    });
  };

  const chartData = generateChartData();
  
  const weeklyAverage = weeklyNutrition.length > 0 
    ? weeklyNutrition.reduce((sum, day) => sum + day.totalCalories, 0) / weeklyNutrition.length 
    : 0;
  const weeklyTargetAverage = weeklyNutrition.length > 0 
    ? weeklyNutrition.reduce((sum, day) => sum + day.targetCalories, 0) / weeklyNutrition.length 
    : goals?.dailyCalorieTarget || 2000;
  const avgDifference = weeklyAverage - weeklyTargetAverage;

  const stats = [
    {
      label: 'Today\'s Intake',
      value: Math.round(dailyNutrition?.totalCalories || todayProgress?.caloriesConsumed || 0),
      target: Math.round(dailyNutrition?.targetCalories || goals?.dailyCalorieTarget || 2000),
      icon: Flame,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100'
    },
    {
      label: 'Protein Today',
      value: Math.round(dailyNutrition?.totalProtein || 0),
      suffix: 'g',
      icon: Zap,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      label: 'Weekly Average',
      value: Math.round(weeklyAverage),
      target: Math.round(weeklyTargetAverage),
      icon: Activity,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-100'
    },
    {
      label: 'Goal Progress',
      value: Math.round(dailyNutrition?.calorieProgress || 0),
      suffix: '%',
      icon: Award,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    }
  ];

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
        </div>
      </div>
    );
  }

  const getInsightMessage = () => {
    if (avgDifference > 200) {
      return {
        type: 'warning',
        message: 'You\'re consistently over your calorie target. Consider adjusting portion sizes or food choices.',
        color: 'text-yellow-700',
        bgColor: 'bg-yellow-50',
        borderColor: 'border-yellow-200'
      };
    } else if (avgDifference < -200) {
      return {
        type: 'info',
        message: 'You\'re under your calorie target. Make sure you\'re eating enough to support your goals.',
        color: 'text-blue-700',
        bgColor: 'bg-blue-50',
        borderColor: 'border-blue-200'
      };
    } else {
      return {
        type: 'success',
        message: 'Great job! You\'re staying close to your calorie target. Keep up the excellent work!',
        color: 'text-emerald-700',
        bgColor: 'bg-emerald-50',
        borderColor: 'border-emerald-200'
      };
    }
  };

  const insight = getInsightMessage();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Progress & Analytics</h1>
        <p className="text-gray-600">
          Track your calorie intake and see how you're progressing toward your fitness goals.
        </p>
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
                    <p className="text-2xl font-bold text-gray-900">
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

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
z        {/* Simple Progress Chart */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <Card>
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">7-Day Calorie Trend</h3>
              <SimpleChart
                data={chartData}
                type="bar"
                height={250}
                showValues={true}
              />
              <div className="mt-4 flex justify-between text-sm text-gray-600">
                <span>Target: {Math.round(weeklyTargetAverage)} cal/day</span>
                <span>Avg: {Math.round(weeklyAverage)} cal/day</span>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Daily Variance */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Card>
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Today's Macro Breakdown</h3>
              {dailyNutrition ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 bg-red-500 rounded"></div>
                      <span className="text-sm text-gray-600">Protein</span>
                    </div>
                    <span className="font-semibold">{Math.round(dailyNutrition.totalProtein)}g</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 bg-yellow-500 rounded"></div>
                      <span className="text-sm text-gray-600">Carbs</span>
                    </div>
                    <span className="font-semibold">{Math.round(dailyNutrition.totalCarbs)}g</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 bg-green-500 rounded"></div>
                      <span className="text-sm text-gray-600">Fat</span>
                    </div>
                    <span className="font-semibold">{Math.round(dailyNutrition.totalFat)}g</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 bg-purple-500 rounded"></div>
                      <span className="text-sm text-gray-600">Fiber</span>
                    </div>
                    <span className="font-semibold">{Math.round(dailyNutrition.totalFiber)}g</span>
                  </div>
                </div>
              ) : (
                <div className="h-64 flex items-center justify-center">
                  <div className="text-center">
                    <Activity className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">No nutrition data available</p>
                  </div>
                </div>
              )}
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Insights */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.5 }}
      >
        <Card className={`${insight.bgColor} ${insight.borderColor} border-2`}>
          <div className="p-6">
            <div className="flex items-start space-x-3">
              <TrendingUp className={`w-6 h-6 ${insight.color} mt-1`} />
              <div>
                <h4 className={`font-semibold ${insight.color} mb-2`}>Weekly Insight</h4>
                <p className={insight.color}>{insight.message}</p>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default ProgressPage;