# 🏋️ Daxo Fit Pro - Complete Fitness Tracking App

A comprehensive fitness and nutrition tracking application built with React, TypeScript, and Spring Boot. Track your meals, monitor your progress, and achieve your fitness goals with personalized recommendations.

## ✨ Features

### 🔐 Authentication & User Management
- **Secure Registration & Login** with JWT authentication
- **User Profile Management** with personal information
- **Protected Routes** for authenticated users only
- **Automatic Session Management** with token refresh

### 🎯 Goal Setting & Tracking
- **Personalized Goal Setting** (Weight Loss, Maintenance, Weight Gain)
- **BMR Calculation** using Mifflin-St Jeor equation
- **Daily Calorie Targets** based on goals and activity level
- **Progress Tracking** with visual indicators

### 🍎 Food Database & Nutrition
- **Comprehensive Food Database** with 15+ healthy foods
- **Detailed Nutritional Information** (calories, protein, carbs, fat, fiber)
- **Food Categories** (Protein, Carbs, Vegetables, Fruits, etc.)
- **Smart Search & Filtering** by name, category, and nutritional content

### 🍽️ Meal Tracking
- **Real-time Meal Logging** with quantity tracking
- **Meal Types** (Breakfast, Lunch, Dinner, Snacks)
- **Automatic Calorie Calculation** based on food and quantity
- **Daily Nutrition Summary** with macro breakdown

### 📊 Progress Analytics
- **7-Day Calorie Trends** with interactive charts
- **Macro Distribution** tracking (Protein, Carbs, Fat, Fiber)
- **Goal Progress Visualization** with progress bars
- **Weekly Insights** and recommendations

### 🎨 Modern UI/UX
- **Responsive Design** that works on all devices
- **Smooth Animations** with Framer Motion
- **Beautiful Components** with Tailwind CSS
- **Dark/Light Mode** support
- **Mobile-First** approach

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm/yarn
- Java 21+ and Maven
- PostgreSQL database

### Backend Setup

1. **Navigate to the backend directory:**
   ```bash
   cd fitness-api
   ```

2. **Update database configuration in `application.properties`:**
   ```properties
   spring.datasource.url=jdbc:postgresql://your-db-host:5432/your-database
   spring.datasource.username=your-username
   spring.datasource.password=your-password
   ```

3. **Run the Spring Boot application:**
   ```bash
   mvn spring-boot:run
   ```

   The backend will start on `http://localhost:8080`

### Frontend Setup

1. **Navigate to the frontend directory:**
   ```bash
   cd fitness_ui-part
   ```

2. **Install dependencies:**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

   The frontend will start on `http://localhost:5173`

## 📱 Usage

### 1. Registration & Setup
- Register a new account with email and password
- Complete your profile with personal information
- Set your fitness goals and activity level
- The system will calculate your daily calorie target

### 2. Daily Usage
- **Dashboard**: View your daily progress and quick actions
- **Meal Tracking**: Log your meals throughout the day
- **Food Database**: Browse and search for healthy foods
- **Progress**: Monitor your weekly trends and goal progress

### 3. Features Overview
- **Smart Recommendations**: Get personalized food suggestions based on your goals
- **Real-time Updates**: See your progress update instantly
- **Nutrition Tracking**: Monitor your macro and micronutrient intake
- **Goal Management**: Set and track multiple fitness goals

## 🛠️ Technology Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development
- **Tailwind CSS** for styling
- **Framer Motion** for animations
- **React Router** for navigation
- **Axios** for API calls

### Backend
- **Spring Boot 3.5** with Java 21
- **Spring Security** with JWT authentication
- **Spring Data JPA** for database operations
- **PostgreSQL** for data persistence
- **Maven** for dependency management

### Database
- **PostgreSQL** with JPA entities
- **Food Database** with nutritional information
- **User Management** with profiles and goals
- **Meal Tracking** with detailed nutrition data

## 📊 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login

### User Management
- `GET /api/users/me` - Get current user profile
- `PUT /api/users/me/profile` - Update user profile

### Food Database
- `GET /api/foods` - Get all foods
- `GET /api/foods/search?name={query}` - Search foods
- `GET /api/foods/category/{category}` - Get foods by category
- `GET /api/foods/recommendations?goalType={type}` - Get recommended foods

### Meal Tracking
- `POST /api/meals/add` - Add a meal
- `GET /api/meals` - Get meals for date
- `GET /api/meals/nutrition` - Get daily nutrition summary
- `PUT /api/meals/{id}` - Update meal
- `DELETE /api/meals/{id}` - Delete meal

### Goals
- `POST /api/goals/add` - Add a goal
- `GET /api/goals` - Get user goals
- `DELETE /api/goals/{id}` - Delete goal

## 🎨 UI Components

### Core Components
- **Card**: Reusable card component with hover effects
- **Button**: Multiple variants (primary, secondary, ghost)
- **ProgressBar**: Animated progress indicators
- **ProtectedRoute**: Route protection for authenticated users

### Charts
- **SimpleChart**: Custom chart component for data visualization
- **Bar Charts**: For calorie trends and progress tracking
- **Progress Indicators**: For goal completion and daily targets

## 🔧 Configuration

### Environment Variables
Create a `.env` file in the frontend directory:
```env
VITE_API_BASE_URL=http://localhost:8080
```

### Database Configuration
Update the database connection in `application.properties`:
```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/fitness_db
spring.datasource.username=your_username
spring.datasource.password=your_password
```

## 📈 Features Roadmap

### Phase 1: Core Features ✅
- [x] User authentication and registration
- [x] Goal setting and BMR calculation
- [x] Food database with nutritional information
- [x] Meal tracking and logging
- [x] Progress visualization and analytics

### Phase 2: Enhanced Features 🚧
- [ ] Advanced meal planning
- [ ] Recipe integration
- [ ] Barcode scanning for food items
- [ ] Social features and challenges
- [ ] Mobile app (React Native)

### Phase 3: AI & Premium Features 📋
- [ ] AI-powered meal recommendations
- [ ] Personalized workout plans
- [ ] Health predictions and insights
- [ ] Premium subscription features
- [ ] Integration with fitness devices

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Unsplash** for beautiful food images
- **Lucide React** for amazing icons
- **Tailwind CSS** for the utility-first CSS framework
- **Framer Motion** for smooth animations

## 📞 Support

If you have any questions or need help, please:
- Open an issue on GitHub
- Check the documentation
- Contact the development team

---

**Built with ❤️ for fitness enthusiasts everywhere!**
