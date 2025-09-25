import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Target, Calculator, Save } from 'lucide-react';
import { useFitness } from '../context/FitnessContext';
import { UserGoals } from '../types';
import { calculateBMR, getActivityLevelDescription } from '../services/bmrCalculator';
import Card from '../components/UI/Card';
import Button from '../components/UI/Button';

const GoalsPage: React.FC = () => {
  const { goals, setGoals } = useFitness();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState<Omit<UserGoals, 'dailyCalorieTarget'>>({
    age: goals?.age || 25,
    gender: goals?.gender || 'female',
    height: goals?.height || 170,
    weight: goals?.weight || 70,
    activityLevel: goals?.activityLevel || 'moderately_active',
    goal: goals?.goal || 'maintain'
  });

  const [calculatedCalories, setCalculatedCalories] = useState(0);

  useEffect(() => {
    const calories = calculateBMR(
      formData.age,
      formData.gender,
      formData.height,
      formData.weight,
      formData.activityLevel,
      formData.goal
    );
    setCalculatedCalories(calories);
  }, [formData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newGoals: UserGoals = {
      ...formData,
      dailyCalorieTarget: calculatedCalories
    };
    
    setGoals(newGoals);
    navigate('/dashboard');
  };

  const handleInputChange = (field: keyof typeof formData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-8"
      >
        <Target className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Set Your Fitness Goals</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Help us personalize your experience by providing some basic information. We'll calculate your daily calorie needs using scientifically-proven formulas.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form */}
        <div className="lg:col-span-2">
          <Card>
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Personal Info */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Age</label>
                    <input
                      type="number"
                      value={formData.age}
                      onChange={(e) => handleInputChange('age', parseInt(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      min="16"
                      max="100"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
                    <select
                      value={formData.gender}
                      onChange={(e) => handleInputChange('gender', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    >
                      <option value="female">Female</option>
                      <option value="male">Male</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Height (cm)</label>
                    <input
                      type="number"
                      value={formData.height}
                      onChange={(e) => handleInputChange('height', parseInt(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      min="120"
                      max="250"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Weight (kg)</label>
                    <input
                      type="number"
                      value={formData.weight}
                      onChange={(e) => handleInputChange('weight', parseInt(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      min="30"
                      max="300"
                      step="0.1"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Activity Level */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Activity Level</h3>
                <div className="space-y-3">
                  {[
                    { value: 'sedentary', label: 'Sedentary' },
                    { value: 'lightly_active', label: 'Lightly Active' },
                    { value: 'moderately_active', label: 'Moderately Active' },
                    { value: 'very_active', label: 'Very Active' },
                    { value: 'extra_active', label: 'Extra Active' }
                  ].map((option) => (
                    <label key={option.value} className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                      <input
                        type="radio"
                        value={option.value}
                        checked={formData.activityLevel === option.value}
                        onChange={(e) => handleInputChange('activityLevel', e.target.value)}
                        className="text-emerald-600 focus:ring-emerald-500"
                      />
                      <div className="ml-3">
                        <p className="font-medium text-gray-900">{option.label}</p>
                        <p className="text-sm text-gray-600">{getActivityLevelDescription(option.value)}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Goal */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Fitness Goal</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    { value: 'lose', label: 'Lose Weight', description: '500 cal deficit' },
                    { value: 'maintain', label: 'Maintain Weight', description: 'Balanced intake' },
                    { value: 'gain', label: 'Gain Weight', description: '500 cal surplus' }
                  ].map((option) => (
                    <label key={option.value} className="cursor-pointer">
                      <input
                        type="radio"
                        value={option.value}
                        checked={formData.goal === option.value}
                        onChange={(e) => handleInputChange('goal', e.target.value)}
                        className="sr-only"
                      />
                      <div className={`p-4 border-2 rounded-lg text-center transition-all ${
                        formData.goal === option.value
                          ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                          : 'border-gray-200 hover:border-emerald-300 text-gray-700'
                      }`}>
                        <p className="font-medium">{option.label}</p>
                        <p className="text-sm opacity-75">{option.description}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <Button type="submit" size="lg" className="w-full">
                <Save className="w-5 h-5 mr-2" />
                Save Goals
              </Button>
            </form>
          </Card>
        </div>

        {/* Calculation Preview */}
        <div className="lg:col-span-1">
          <Card className="sticky top-8">
            <div className="p-6">
              <div className="flex items-center space-x-2 mb-4">
                <Calculator className="w-6 h-6 text-emerald-600" />
                <h3 className="text-lg font-semibold text-gray-900">Calorie Calculator</h3>
              </div>
              
              <div className="space-y-4">
                <div className="text-center p-4 bg-gradient-to-r from-emerald-50 to-blue-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Daily Calorie Target</p>
                  <p className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
                    {calculatedCalories.toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-600">calories per day</p>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Age:</span>
                    <span className="font-medium">{formData.age} years</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Gender:</span>
                    <span className="font-medium capitalize">{formData.gender}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Height:</span>
                    <span className="font-medium">{formData.height} cm</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Weight:</span>
                    <span className="font-medium">{formData.weight} kg</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Goal:</span>
                    <span className="font-medium capitalize">{formData.goal} weight</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-100">
                  <p className="text-xs text-gray-500 text-center">
                    Calculated using the Mifflin-St Jeor equation with activity level adjustments
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default GoalsPage;