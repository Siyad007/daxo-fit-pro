# 🏋️ Fitness App API Testing Guide

## Base URL
```
http://localhost:8080/api
```

## Authentication
All protected endpoints require JWT token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

---

## 🔐 Authentication APIs

### 1. Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com",
  "age": null,
  "weight": null,
  "height": null,
  "username": null,
  "goal": null,
  "activityLevel": null,
  "gender": null,
  "dailyCalorieTarget": null,
  "meals": [],
  "detailedGoals": []
}
```

### 2. Login User
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
"eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJqb2huQGV4YW1wbGUuY29tIiwiaWF0IjoxNzM0NzI4MDAwLCJleHAiOjE3MzQ3MzE2MDB9.example-jwt-token"
```

---

## 👤 User Management APIs

### 3. Get My Profile
```http
GET /api/users/me
Authorization: Bearer <jwt-token>
```

### 4. Update My Profile
```http
PUT /api/users/me/profile
Authorization: Bearer <jwt-token>
Content-Type: application/json

{
  "name": "John Doe",
  "age": 25,
  "weight": 70.0,
  "height": 175.0,
  "gender": "MALE",
  "activityLevel": "MODERATE",
  "goal": "LOSS"
}
```

**Response:**
```json
{
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com",
  "age": 25,
  "weight": 70.0,
  "height": 175.0,
  "gender": "MALE",
  "activityLevel": "MODERATE",
  "goal": "LOSS",
  "dailyCalorieTarget": 1850
}
```

---

## 🍎 Food Database APIs

### 5. Get All Foods
```http
GET /api/foods
```

**Response:**
```json
[
  {
    "id": 1,
    "name": "Grilled Chicken Breast",
    "calories": 165.0,
    "protein": 31.0,
    "carbs": 0.0,
    "fat": 3.6,
    "fiber": 0.0,
    "description": "Lean protein source",
    "imageUrl": "https://images.unsplash.com/photo-1532550907401-a500c9a57435?w=200&h=200&fit=crop",
    "category": "PROTEIN",
    "isActive": true
  }
]
```

### 6. Search Foods
```http
GET /api/foods/search?name=chicken
```

### 7. Get Foods by Category
```http
GET /api/foods/category/PROTEIN
```

**Available Categories:**
- `PROTEIN`
- `CARBOHYDRATE`
- `VEGETABLE`
- `FRUIT`
- `DAIRY`
- `GRAIN`
- `NUTS_SEEDS`
- `BEVERAGE`
- `SNACK`
- `OTHER`

### 8. Get Recommended Foods
```http
GET /api/foods/recommendations?goalType=LOSS
```

**Available Goal Types:**
- `LOSS` - Low calorie, high protein foods
- `GAIN` - High calorie, high protein foods
- `MAINTAIN` - Balanced foods

### 9. Get High Protein Foods
```http
GET /api/foods/high-protein
```

### 10. Get Low Calorie Foods
```http
GET /api/foods/low-calorie
```

### 11. Get Food by ID
```http
GET /api/foods/1
```

---

## 🍽️ Meal Tracking APIs

### 12. Add Meal
```http
POST /api/meals/add
Authorization: Bearer <jwt-token>
Content-Type: application/json

{
  "foodId": 1,
  "mealType": "BREAKFAST",
  "quantity": 150.0,
  "mealDate": "2024-01-15"
}
```

**Available Meal Types:**
- `BREAKFAST`
- `LUNCH`
- `DINNER`
- `SNACK`

**Response:**
```json
"Meal added successfully! Calories: 247.5 cal | Total today: 247.5/1850 | Remaining: 1602.5 cal"
```

### 13. Get Meals for Date
```http
GET /api/meals?date=2024-01-15
Authorization: Bearer <jwt-token>
```

**Response:**
```json
[
  {
    "id": 1,
    "userId": 1,
    "foodId": 1,
    "foodName": "Grilled Chicken Breast",
    "mealType": "BREAKFAST",
    "quantity": 150.0,
    "calories": 247.5,
    "protein": 46.5,
    "carbs": 0.0,
    "fat": 5.4,
    "fiber": 0.0,
    "mealDate": "2024-01-15",
    "createdAt": "2024-01-15T08:30:00"
  }
]
```

### 14. Get All My Meals
```http
GET /api/meals/all
Authorization: Bearer <jwt-token>
```

### 15. Get Daily Nutrition Summary
```http
GET /api/meals/nutrition?date=2024-01-15
Authorization: Bearer <jwt-token>
```

**Response:**
```json
{
  "date": "2024-01-15",
  "totalCalories": 1247.5,
  "totalProtein": 89.2,
  "totalCarbs": 45.6,
  "totalFat": 23.4,
  "totalFiber": 8.9,
  "targetCalories": 1850.0,
  "remainingCalories": 602.5,
  "calorieProgress": 67.4
}
```

### 16. Update Meal
```http
PUT /api/meals/1
Authorization: Bearer <jwt-token>
Content-Type: application/json

{
  "foodId": 2,
  "mealType": "LUNCH",
  "quantity": 200.0,
  "mealDate": "2024-01-15"
}
```

### 17. Delete Meal
```http
DELETE /api/meals/1
Authorization: Bearer <jwt-token>
```

---

## 🎯 Goals Management APIs

### 18. Add Goal
```http
POST /api/goals/add
Authorization: Bearer <jwt-token>
Content-Type: application/json

{
  "description": "Lose 5kg in 2 months",
  "targetWeight": 65.0,
  "targetDate": "2024-03-15",
  "type": "LOSS"
}
```

### 19. Get My Goals
```http
GET /api/goals
Authorization: Bearer <jwt-token>
```

### 20. Delete Goal
```http
DELETE /api/goals/1
Authorization: Bearer <jwt-token>
```

---

## 🧪 Testing Workflow

### Step 1: Register and Login
1. Register a new user
2. Login to get JWT token
3. Save the token for subsequent requests

### Step 2: Set Up Profile
1. Update user profile with personal information
2. This will calculate your daily calorie target

### Step 3: Explore Food Database
1. Get all available foods
2. Search for specific foods
3. Get recommended foods based on your goal

### Step 4: Track Meals
1. Add meals throughout the day
2. Check daily nutrition summary
3. Update or delete meals as needed

### Step 5: Set Goals
1. Add detailed fitness goals
2. Track progress over time

---

## 📊 Sample Test Data

### Complete Meal Day Example:
```json
// Breakfast
{
  "foodId": 1, // Grilled Chicken Breast
  "mealType": "BREAKFAST",
  "quantity": 100.0
}

// Lunch
{
  "foodId": 2, // Brown Rice
  "mealType": "LUNCH",
  "quantity": 200.0
}

// Dinner
{
  "foodId": 3, // Salmon Fillet
  "mealType": "DINNER",
  "quantity": 150.0
}

// Snack
{
  "foodId": 4, // Greek Yogurt
  "mealType": "SNACK",
  "quantity": 100.0
}
```

---

## 🔧 Testing Tools

### Using Postman:
1. Import the collection (if available)
2. Set base URL to `http://localhost:8080/api`
3. Add JWT token to Authorization header for protected endpoints

### Using curl:
```bash
# Register
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@example.com","password":"password123"}'

# Login
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"password123"}'

# Get foods (with token)
curl -X GET http://localhost:8080/api/foods \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Using JavaScript/Fetch:
```javascript
// Login and get token
const loginResponse = await fetch('http://localhost:8080/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email: 'john@example.com', password: 'password123' })
});
const token = await loginResponse.text();

// Use token for protected requests
const foodsResponse = await fetch('http://localhost:8080/api/foods', {
  headers: { 'Authorization': `Bearer ${token}` }
});
const foods = await foodsResponse.json();
```

---

## 🚀 Quick Start Testing

1. **Start the backend server**
2. **Register a user** using the auth endpoint
3. **Login** to get your JWT token
4. **Update your profile** to set goals and calculate calories
5. **Browse foods** to see available options
6. **Add some meals** to test tracking
7. **Check your daily nutrition** summary

This API provides a complete fitness tracking system with food database, meal logging, and personalized recommendations based on user goals!


