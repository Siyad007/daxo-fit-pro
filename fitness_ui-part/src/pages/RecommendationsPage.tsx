import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Target, Plus, Clock, Flame } from 'lucide-react';
import { useFitness } from '../context/FitnessContext';
import { getRecommendedMeals } from '../services/foodDatabase';
import { MealFood } from '../types';
import Card from '../components/UI/Card';
import Button from '../components/UI/Button';

const RecommendationsPage: React.FC = () => {
  const { goals, addMeal } = useFitness();
  
  const recommendations = goals ? getRecommendedMeals(goals.goal) : [];
  const today = new Date().toISOString().split('T')[0];

  const handleAddMealFromRecommendation = (foods: any[], mealType: string) => {
    const mealFoods: MealFood[] = foods.map(food => ({
      food,
      quantity: 1,
      calories: food.calories
    }));

    const totalCalories = mealFoods.reduce((sum, f) => sum + f.calories, 0);

    addMeal({
      type: mealType as any,
      foods: mealFoods,
      date: today,
      totalCalories
    });
  };

  const getMealTypeInfo = (type: string) => {
    const info = {
      breakfast: { icon: Clock, color: 'from-yellow-400 to-orange-500', time: '7:00 AM' },
      lunch: { icon: Clock, color: 'from-emerald-400 to-green-500', time: '12:00 PM' },
      dinner: { icon: Clock, color: 'from-blue-400 to-indigo-500', time: '7:00 PM' }
    };
    return info[type as keyof typeof info] || info.lunch;
  };

  if (!goals) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Card className="p-8 text-center">
          <Target className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Set Your Goals First</h2>
          <p className="text-gray-600 mb-6">
            We need to know your fitness goals to provide personalized meal recommendations.
          </p>
          <Link to="/setup-goals">
            <Button size="lg">Set Up Goals</Button>
          </Link>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Meal Recommendations</h1>
        <p className="text-gray-600">
          Personalized meal suggestions based on your {goals.goal} weight goal.
        </p>
      </motion.div>

      {/* Goal Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="mb-8"
      >
        <Card>
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Your Daily Target</h3>
                <p className="text-gray-600">Based on your {goals.goal} weight goal</p>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold text-emerald-600">{goals.dailyCalorieTarget}</p>
                <p className="text-sm text-gray-600">calories/day</p>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Recommendations */}
      <div className="space-y-8">
        {recommendations.map((recommendation, index) => {
          const mealInfo = getMealTypeInfo(recommendation.mealType);
          const Icon = mealInfo.icon;
          const totalCalories = recommendation.foods.reduce((sum, food) => sum + food.calories, 0);

          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
            >
              <Card>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-3">
                      <div className={`w-12 h-12 bg-gradient-to-r ${mealInfo.color} rounded-lg flex items-center justify-center`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 capitalize">
                          {recommendation.mealType}
                        </h3>
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <span className="flex items-center">
                            <Flame className="w-4 h-4 mr-1" />
                            {totalCalories} calories
                          </span>
                          <span>{mealInfo.time}</span>
                        </div>
                      </div>
                    </div>
                    
                    <Button
                      onClick={() => handleAddMealFromRecommendation(recommendation.foods, recommendation.mealType)}
                      size="sm"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add to Meal
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {recommendation.foods.map((food, foodIndex) => (
                      <motion.div
                        key={food.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3, delay: foodIndex * 0.1 }}
                        className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors"
                      >
                        <img
                          src={food.image}
                          alt={food.name}
                          className="w-full h-24 object-cover rounded-lg mb-3"
                        />
                        <h4 className="font-medium text-gray-900 mb-1">{food.name}</h4>
                        <div className="flex justify-between text-sm text-gray-600">
                          <span>{food.calories} cal</span>
                          <span>{food.protein}g protein</span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Pro Tip */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.8 }}
        className="mt-12"
      >
        <Card className="bg-gradient-to-r from-emerald-50 to-blue-50 border-emerald-200">
          <div className="p-6">
            <div className="flex items-start space-x-3">
              <Target className="w-6 h-6 text-emerald-600 mt-1" />
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Pro Tip</h4>
                <p className="text-gray-700">
                  These recommendations are tailored to your {goals.goal} weight goal. You can mix and match foods or adjust portions to fit your preferences while staying within your calorie target.
                </p>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default RecommendationsPage;