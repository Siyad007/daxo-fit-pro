import { Food } from '../types';

// Sample food database
export const foodDatabase: Food[] = [
  {
    id: '1',
    name: 'Grilled Chicken Breast',
    calories: 165,
    protein: 31,
    carbs: 0,
    fat: 3.6,
    image: 'https://images.unsplash.com/photo-1532550907401-a500c9a57435?w=200&h=200&fit=crop'
  },
  {
    id: '2',
    name: 'Brown Rice',
    calories: 111,
    protein: 2.6,
    carbs: 23,
    fat: 0.9,
    image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=200&h=200&fit=crop'
  },
  {
    id: '3',
    name: 'Salmon Fillet',
    calories: 208,
    protein: 25,
    carbs: 0,
    fat: 12,
    image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=200&h=200&fit=crop'
  },
  {
    id: '4',
    name: 'Quinoa',
    calories: 120,
    protein: 4.4,
    carbs: 22,
    fat: 1.9,
    image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=200&h=200&fit=crop'
  },
  {
    id: '5',
    name: 'Greek Yogurt',
    calories: 100,
    protein: 17,
    carbs: 6,
    fat: 0.4,
    image: 'https://images.unsplash.com/photo-1571212515410-3b4b2b0b0b0b?w=200&h=200&fit=crop'
  },
  {
    id: '6',
    name: 'Avocado',
    calories: 160,
    protein: 2,
    carbs: 9,
    fat: 15,
    image: 'https://images.unsplash.com/photo-1519162808019-7de1683fa2ad?w=200&h=200&fit=crop'
  },
  {
    id: '7',
    name: 'Eggs',
    calories: 155,
    protein: 13,
    carbs: 1.1,
    fat: 11,
    image: 'https://images.unsplash.com/photo-1518569656558-1e25a4d4b9bc?w=200&h=200&fit=crop'
  },
  {
    id: '8',
    name: 'Sweet Potato',
    calories: 86,
    protein: 1.6,
    carbs: 20,
    fat: 0.1,
    image: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=200&h=200&fit=crop'
  },
  {
    id: '9',
    name: 'Broccoli',
    calories: 34,
    protein: 2.8,
    carbs: 7,
    fat: 0.4,
    image: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=200&h=200&fit=crop'
  },
  {
    id: '10',
    name: 'Almonds',
    calories: 579,
    protein: 21,
    carbs: 22,
    fat: 50,
    image: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=200&h=200&fit=crop'
  }
];

export const searchFoods = (query: string): Food[] => {
  if (!query.trim()) return foodDatabase;
  
  return foodDatabase.filter(food =>
    food.name.toLowerCase().includes(query.toLowerCase())
  );
};

export const getRecommendedMeals = (goal: string) => {
  const meals = {
    lose: [
      {
        mealType: 'breakfast',
        foods: [
          foodDatabase.find(f => f.name === 'Greek Yogurt')!,
          foodDatabase.find(f => f.name === 'Almonds')!
        ]
      },
      {
        mealType: 'lunch',
        foods: [
          foodDatabase.find(f => f.name === 'Grilled Chicken Breast')!,
          foodDatabase.find(f => f.name === 'Broccoli')!
        ]
      },
      {
        mealType: 'dinner',
        foods: [
          foodDatabase.find(f => f.name === 'Salmon Fillet')!,
          foodDatabase.find(f => f.name === 'Sweet Potato')!
        ]
      }
    ],
    maintain: [
      {
        mealType: 'breakfast',
        foods: [
          foodDatabase.find(f => f.name === 'Eggs')!,
          foodDatabase.find(f => f.name === 'Avocado')!
        ]
      },
      {
        mealType: 'lunch',
        foods: [
          foodDatabase.find(f => f.name === 'Grilled Chicken Breast')!,
          foodDatabase.find(f => f.name === 'Brown Rice')!
        ]
      },
      {
        mealType: 'dinner',
        foods: [
          foodDatabase.find(f => f.name === 'Salmon Fillet')!,
          foodDatabase.find(f => f.name === 'Quinoa')!
        ]
      }
    ],
    gain: [
      {
        mealType: 'breakfast',
        foods: [
          foodDatabase.find(f => f.name === 'Eggs')!,
          foodDatabase.find(f => f.name === 'Avocado')!,
          foodDatabase.find(f => f.name === 'Almonds')!
        ]
      },
      {
        mealType: 'lunch',
        foods: [
          foodDatabase.find(f => f.name === 'Grilled Chicken Breast')!,
          foodDatabase.find(f => f.name === 'Brown Rice')!,
          foodDatabase.find(f => f.name === 'Sweet Potato')!
        ]
      },
      {
        mealType: 'dinner',
        foods: [
          foodDatabase.find(f => f.name === 'Salmon Fillet')!,
          foodDatabase.find(f => f.name === 'Quinoa')!,
          foodDatabase.find(f => f.name === 'Broccoli')!
        ]
      }
    ]
  };

  return meals[goal as keyof typeof meals] || meals.maintain;
};