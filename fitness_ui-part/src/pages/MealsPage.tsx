import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Plus, 
  Search, 
  Coffee, 
  Sun, 
  Moon, 
  Cookie,
  Trash2,
  Edit,
  Utensils
} from 'lucide-react';
import { useFitness } from '../context/FitnessContext';
import { Food, MealFood } from '../types';
import { foodDatabase, searchFoods } from '../services/foodDatabase';
import Card from '../components/UI/Card';
import Button from '../components/UI/Button';

const MealsPage: React.FC = () => {
  const { meals, addMeal } = useFitness();
  const [selectedMealType, setSelectedMealType] = useState<'breakfast' | 'lunch' | 'dinner' | 'snack'>('breakfast');
  const [showAddFood, setShowAddFood] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFoods, setSelectedFoods] = useState<MealFood[]>([]);

  const today = new Date().toISOString().split('T')[0];
  const todayMeals = meals.filter(meal => meal.date === today);

  const mealTypes = [
    { value: 'breakfast', label: 'Breakfast', icon: Coffee, color: 'from-yellow-400 to-orange-500' },
    { value: 'lunch', label: 'Lunch', icon: Sun, color: 'from-emerald-400 to-green-500' },
    { value: 'dinner', label: 'Dinner', icon: Moon, color: 'from-blue-400 to-indigo-500' },
    { value: 'snack', label: 'Snacks', icon: Cookie, color: 'from-purple-400 to-pink-500' }
  ];

  const filteredFoods = searchFoods(searchQuery);

  const handleAddFood = (food: Food) => {
    const existingFood = selectedFoods.find(f => f.food.id === food.id);
    if (existingFood) {
      setSelectedFoods(prev => 
        prev.map(f => 
          f.food.id === food.id 
            ? { ...f, quantity: f.quantity + 1, calories: (f.quantity + 1) * food.calories }
            : f
        )
      );
    } else {
      setSelectedFoods(prev => [...prev, { food, quantity: 1, calories: food.calories }]);
    }
  };

  const handleRemoveFood = (foodId: string) => {
    setSelectedFoods(prev => prev.filter(f => f.food.id !== foodId));
  };

  const handleQuantityChange = (foodId: string, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveFood(foodId);
      return;
    }
    
    setSelectedFoods(prev =>
      prev.map(f =>
        f.food.id === foodId
          ? { ...f, quantity, calories: quantity * f.food.calories }
          : f
      )
    );
  };

  const handleSaveMeal = () => {
    if (selectedFoods.length === 0) return;

    const totalCalories = selectedFoods.reduce((sum, f) => sum + f.calories, 0);
    
    addMeal({
      type: selectedMealType,
      foods: selectedFoods,
      date: today,
      totalCalories
    });

    setSelectedFoods([]);
    setShowAddFood(false);
  };

  const getMealsByType = (type: string) => {
    return todayMeals.filter(meal => meal.type === type);
  };

  const getTotalCaloriesForType = (type: string) => {
    return getMealsByType(type).reduce((sum, meal) => sum + meal.totalCalories, 0);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Meal Tracking</h1>
        <p className="text-gray-600">
          Track your daily food intake and stay on top of your nutrition goals.
        </p>
      </motion.div>

      {/* Meal Type Tabs */}
      <div className="flex flex-wrap gap-4 mb-8">
        {mealTypes.map((mealType) => {
          const Icon = mealType.icon;
          const isActive = selectedMealType === mealType.value;
          const mealCalories = getTotalCaloriesForType(mealType.value);
          
          return (
            <motion.button
              key={mealType.value}
              onClick={() => setSelectedMealType(mealType.value as any)}
              className={`flex items-center space-x-3 px-6 py-4 rounded-xl transition-all ${
                isActive
                  ? 'bg-white shadow-lg ring-2 ring-emerald-500'
                  : 'bg-white shadow-md hover:shadow-lg'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className={`w-10 h-10 bg-gradient-to-r ${mealType.color} rounded-lg flex items-center justify-center`}>
                <Icon className="w-5 h-5 text-white" />
              </div>
              <div className="text-left">
                <p className="font-semibold text-gray-900">{mealType.label}</p>
                <p className="text-sm text-gray-600">{mealCalories} cal</p>
              </div>
            </motion.button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Meals List */}
        <div className="lg:col-span-2">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              {mealTypes.find(t => t.value === selectedMealType)?.label} Foods
            </h2>
            <Button onClick={() => setShowAddFood(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Food
            </Button>
          </div>

          <div className="space-y-4">
            {getMealsByType(selectedMealType).length === 0 ? (
              <Card className="p-8 text-center">
                <Utensils className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No foods added for {selectedMealType} yet.</p>
                <Button 
                  onClick={() => setShowAddFood(true)}
                  variant="outline"
                  className="mt-4"
                >
                  Add Your First Food
                </Button>
              </Card>
            ) : (
              getMealsByType(selectedMealType).map((meal) => (
                <Card key={meal.id}>
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {meal.type.charAt(0).toUpperCase() + meal.type.slice(1)} - {meal.totalCalories} cal
                      </h3>
                      <div className="flex space-x-2">
                        <Button variant="ghost" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {meal.foods.map((mealFood, index) => (
                        <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                          <img
                            src={mealFood.food.image}
                            alt={mealFood.food.name}
                            className="w-12 h-12 object-cover rounded-lg"
                          />
                          <div className="flex-1">
                            <p className="font-medium text-gray-900">{mealFood.food.name}</p>
                            <p className="text-sm text-gray-600">
                              {mealFood.quantity}x • {mealFood.calories} cal
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>
        </div>

        {/* Daily Summary */}
        <div className="lg:col-span-1">
          <Card className="sticky top-8">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Today's Summary</h3>
              
              <div className="space-y-4">
                {mealTypes.map((mealType) => {
                  const calories = getTotalCaloriesForType(mealType.value);
                  const Icon = mealType.icon;
                  
                  return (
                    <div key={mealType.value} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`w-8 h-8 bg-gradient-to-r ${mealType.color} rounded-lg flex items-center justify-center`}>
                          <Icon className="w-4 h-4 text-white" />
                        </div>
                        <span className="font-medium text-gray-900">{mealType.label}</span>
                      </div>
                      <span className="text-gray-600">{calories} cal</span>
                    </div>
                  );
                })}
                
                <div className="border-t pt-4">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-gray-900">Total</span>
                    <span className="font-bold text-lg text-emerald-600">
                      {todayMeals.reduce((sum, meal) => sum + meal.totalCalories, 0)} cal
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Add Food Modal */}
      {showAddFood && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
          >
            <div className="p-6 border-b border-gray-100">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-semibold text-gray-900">Add Food to {selectedMealType}</h3>
                <Button variant="ghost" onClick={() => setShowAddFood(false)}>
                  ×
                </Button>
              </div>
              
              {/* Search */}
              <div className="mt-4 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search foods..."
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="flex h-96">
              {/* Food List */}
              <div className="flex-1 overflow-y-auto p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredFoods.map((food) => (
                    <div
                      key={food.id}
                      onClick={() => handleAddFood(food)}
                      className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:border-emerald-300 hover:bg-emerald-50 cursor-pointer transition-all"
                    >
                      <img
                        src={food.image}
                        alt={food.name}
                        className="w-12 h-12 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{food.name}</p>
                        <p className="text-sm text-gray-600">{food.calories} cal</p>
                      </div>
                      <Plus className="w-5 h-5 text-emerald-600" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Selected Foods */}
              <div className="w-80 bg-gray-50 border-l border-gray-200 p-6">
                <h4 className="font-semibold text-gray-900 mb-4">Selected Foods</h4>
                
                {selectedFoods.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No foods selected</p>
                ) : (
                  <div className="space-y-3 mb-6">
                    {selectedFoods.map((mealFood) => (
                      <div key={mealFood.food.id} className="flex items-center space-x-2 p-3 bg-white rounded-lg">
                        <img
                          src={mealFood.food.image}
                          alt={mealFood.food.name}
                          className="w-8 h-8 object-cover rounded"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">{mealFood.food.name}</p>
                          <p className="text-xs text-gray-600">{mealFood.calories} cal</p>
                        </div>
                        <div className="flex items-center space-x-1">
                          <button
                            onClick={() => handleQuantityChange(mealFood.food.id, mealFood.quantity - 1)}
                            className="w-6 h-6 flex items-center justify-center bg-gray-200 rounded text-gray-600 hover:bg-gray-300"
                          >
                            -
                          </button>
                          <span className="w-8 text-center text-sm">{mealFood.quantity}</span>
                          <button
                            onClick={() => handleQuantityChange(mealFood.food.id, mealFood.quantity + 1)}
                            className="w-6 h-6 flex items-center justify-center bg-gray-200 rounded text-gray-600 hover:bg-gray-300"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {selectedFoods.length > 0 && (
                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center mb-4">
                      <span className="font-semibold text-gray-900">Total Calories</span>
                      <span className="font-bold text-lg text-emerald-600">
                        {selectedFoods.reduce((sum, f) => sum + f.calories, 0)}
                      </span>
                    </div>
                    <Button onClick={handleSaveMeal} className="w-full">
                      Save Meal
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default MealsPage;