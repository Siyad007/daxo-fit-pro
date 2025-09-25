import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Target, Activity, Weight, Ruler } from 'lucide-react';
import { UserService, ProfileUpdatePayload } from '../services/userService';
import Button from '../components/UI/Button';
import Card from '../components/UI/Card';

const SetupGoalsPage: React.FC = () => {
  const [formData, setFormData] = useState<ProfileUpdatePayload>({
    name: '',
    age: 25,
    weight: 70,
    height: 170,
    gender: 'MALE',
    activityLevel: 'LIGHT',
    goal: 'MAINTAIN'
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      await UserService.updateProfile(formData);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to save profile');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: keyof ProfileUpdatePayload, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-blue-50 to-white flex items-center justify-center px-4">
      <div className="w-full max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Target className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Setup Your Fitness Goals</h1>
          <p className="text-gray-600 mt-2">
            Tell us about yourself so we can create your personalized fitness plan
          </p>
        </motion.div>

        <Card>
          <div className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Personal Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <User className="inline w-4 h-4 mr-1" />
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    placeholder="Enter your full name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Age
                  </label>
                  <input
                    type="number"
                    min="16"
                    max="100"
                    value={formData.age}
                    onChange={(e) => handleInputChange('age', parseInt(e.target.value))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Weight className="inline w-4 h-4 mr-1" />
                    Weight (kg)
                  </label>
                  <input
                    type="number"
                    min="30"
                    max="200"
                    step="0.1"
                    value={formData.weight}
                    onChange={(e) => handleInputChange('weight', parseFloat(e.target.value))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Ruler className="inline w-4 h-4 mr-1" />
                    Height (cm)
                  </label>
                  <input
                    type="number"
                    min="120"
                    max="220"
                    value={formData.height}
                    onChange={(e) => handleInputChange('height', parseInt(e.target.value))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>

              {/* Gender */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Gender
                </label>
                <div className="flex space-x-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="gender"
                      value="MALE"
                      checked={formData.gender === 'MALE'}
                      onChange={(e) => handleInputChange('gender', e.target.value)}
                      className="mr-2"
                    />
                    Male
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="gender"
                      value="FEMALE"
                      checked={formData.gender === 'FEMALE'}
                      onChange={(e) => handleInputChange('gender', e.target.value)}
                      className="mr-2"
                    />
                    Female
                  </label>
                </div>
              </div>

              {/* Activity Level */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  <Activity className="inline w-4 h-4 mr-1" />
                  Activity Level
                </label>
                <select
                  value={formData.activityLevel}
                  onChange={(e) => handleInputChange('activityLevel', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                >
                  <option value="SEDENTARY">Sedentary (Little or no exercise)</option>
                  <option value="LIGHT">Light (Light exercise 1-3 days/week)</option>
                  <option value="MODERATE">Moderate (Moderate exercise 3-5 days/week)</option>
                  <option value="ACTIVE">Active (Hard exercise 6-7 days/week)</option>
                </select>
              </div>

              {/* Fitness Goal */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  <Target className="inline w-4 h-4 mr-1" />
                  Fitness Goal
                </label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <label className={`p-4 border rounded-lg cursor-pointer transition-all ${
                    formData.goal === 'LOSS' ? 'border-emerald-500 bg-emerald-50' : 'border-gray-300'
                  }`}>
                    <input
                      type="radio"
                      name="goal"
                      value="LOSS"
                      checked={formData.goal === 'LOSS'}
                      onChange={(e) => handleInputChange('goal', e.target.value)}
                      className="sr-only"
                    />
                    <div className="text-center">
                      <div className="text-lg font-semibold text-gray-900">Lose Weight</div>
                      <div className="text-sm text-gray-600">Create calorie deficit</div>
                    </div>
                  </label>

                  <label className={`p-4 border rounded-lg cursor-pointer transition-all ${
                    formData.goal === 'MAINTAIN' ? 'border-emerald-500 bg-emerald-50' : 'border-gray-300'
                  }`}>
                    <input
                      type="radio"
                      name="goal"
                      value="MAINTAIN"
                      checked={formData.goal === 'MAINTAIN'}
                      onChange={(e) => handleInputChange('goal', e.target.value)}
                      className="sr-only"
                    />
                    <div className="text-center">
                      <div className="text-lg font-semibold text-gray-900">Maintain Weight</div>
                      <div className="text-sm text-gray-600">Keep current weight</div>
                    </div>
                  </label>

                  <label className={`p-4 border rounded-lg cursor-pointer transition-all ${
                    formData.goal === 'GAIN' ? 'border-emerald-500 bg-emerald-50' : 'border-gray-300'
                  }`}>
                    <input
                      type="radio"
                      name="goal"
                      value="GAIN"
                      checked={formData.goal === 'GAIN'}
                      onChange={(e) => handleInputChange('goal', e.target.value)}
                      className="sr-only"
                    />
                    <div className="text-center">
                      <div className="text-lg font-semibold text-gray-900">Gain Weight</div>
                      <div className="text-sm text-gray-600">Build muscle & weight</div>
                    </div>
                  </label>
                </div>
              </div>

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm"
                >
                  {error}
                </motion.div>
              )}

              <Button
                type="submit"
                isLoading={isLoading}
                className="w-full"
                size="lg"
              >
                Complete Setup
              </Button>
            </form>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default SetupGoalsPage;
