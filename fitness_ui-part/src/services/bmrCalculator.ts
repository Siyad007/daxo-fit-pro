import { UserGoals } from '../types';

export const calculateBMR = (
  age: number,
  gender: 'male' | 'female',
  height: number, // cm
  weight: number, // kg
  activityLevel: string,
  goal: 'lose' | 'maintain' | 'gain'
): number => {
  // Mifflin-St Jeor Equation
  let bmr: number;
  
  if (gender === 'male') {
    bmr = (10 * weight) + (6.25 * height) - (5 * age) + 5;
  } else {
    bmr = (10 * weight) + (6.25 * height) - (5 * age) - 161;
  }

  // Activity multipliers
  const activityMultipliers = {
    sedentary: 1.2,
    lightly_active: 1.375,
    moderately_active: 1.55,
    very_active: 1.725,
    extra_active: 1.9
  };

  const tdee = bmr * activityMultipliers[activityLevel as keyof typeof activityMultipliers];

  // Goal adjustments
  switch (goal) {
    case 'lose':
      return Math.round(tdee - 500); // 500 calorie deficit for ~1lb/week loss
    case 'gain':
      return Math.round(tdee + 500); // 500 calorie surplus for ~1lb/week gain
    case 'maintain':
    default:
      return Math.round(tdee);
  }
};

export const getActivityLevelDescription = (level: string): string => {
  const descriptions = {
    sedentary: 'Little or no exercise',
    lightly_active: 'Light exercise 1-3 days/week',
    moderately_active: 'Moderate exercise 3-5 days/week',
    very_active: 'Hard exercise 6-7 days/week',
    extra_active: 'Very hard exercise, physical job'
  };
  
  return descriptions[level as keyof typeof descriptions] || '';
};