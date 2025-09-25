# Fitness API – Backend Architecture

## Overview
- Framework: Spring Boot 3.x (Java 21)
- Persistence: Spring Data JPA (Hibernate) + PostgreSQL
- Security: Spring Security (stateless) with JWT (JJWT)
- Validation: Spring Validation
- Build: Maven

## Project Structure
```
src/main/java/com/fitnessapp/fitness_api
  FitnessApiApplication.java
  config/
    CorsConfig.java
    SecurityConfig.java
  controller/
    AuthController.java
    UserController.java
    FoodController.java
    MealController.java
    GoalController.java
    TestController.java
  dto/
    AuthResponse.java
    DailyNutritionDto.java
    FoodDto.java
    GoalRequest.java
    LoginRequest.java
    MealDto.java
    MealRequest.java
    RegisterRequest.java
    UserDto.java
  entity/
    User.java
    Goal.java
    Meal.java
    Food.java
    Gender.java, ActivityLevel.java, GoalType.java, MealType.java, FoodCategory.java
  exception/
  repository/
    UserRepository.java
    GoalRepository.java
    MealRepository.java
    FoodRepository.java
  security/
    JwtAuthFilter.java
    JwtService.java
  service/
    AuthService.java
    UserService.java
    FoodService.java
    MealService.java
    GoalService.java
    DataInitializationService.java

src/main/resources
  application.properties

pom.xml
API_TESTING_GUIDE.md, README.md
```

## Architecture and Request Lifecycle
1. Client sends HTTP request to `/api/**`.
2. `SecurityFilterChain` (stateless) applies CORS, disables CSRF, and installs `JwtAuthFilter`.
3. `JwtAuthFilter`:
   - Skips public endpoints (`/api/auth/**`, Swagger).
   - For protected routes, validates `Authorization: Bearer <jwt>` using `JwtService`.
   - Loads user by email claim and sets `SecurityContext` with `ROLE_USER`.
4. Controller receives request (optionally with `Principal`).
5. Service layer runs business logic; repositories access DB.
6. Response serialized to JSON.

## Security
- Stateless sessions, CSRF disabled.
- Public: `/api/auth/**`, Swagger, `/`, `/actuator/health`, and `GET /api/foods/**`.
- Protected: `/api/users/**`, `/api/meals/**`, `/api/goals/**`.
- Passwords: BCrypt via `PasswordEncoder`.
- JWT: HS256 with secret from `app.jwt.secret`, expiry from `app.jwt.expiration-ms`.

Example (JwtService):
```java
public String generateToken(User user) {
    Date now = new Date();
    Date exp = new Date(now.getTime() + expirationMs);
    return Jwts.builder()
        .setSubject(user.getEmail())
        .claim("uid", user.getId())
        .setIssuedAt(now)
        .setExpiration(exp)
        .signWith(getSigningKey(), SignatureAlgorithm.HS256)
        .compact();
}
```

## Domain Model
- `User`: profile (name, age, height, weight, gender), `email` (unique), `password` (BCrypt), `activityLevel`, `goal`, computed `dailyCalorieTarget`, relations: `meals` (OneToMany), `detailedGoals` (OneToMany).
- `Food`: per-100g nutrition (calories, protein, carbs, fat, fiber), `FoodCategory`, `isActive`, helpers to compute macros for any quantity.
- `Meal`: links `User` and `Food`, `MealType`, quantity (g), totals for macros and calories, `mealDate`, `createdAt`; computes nutrition via `calculateNutrition()`.
- `Goal`: description, targetWeight, targetDate, `GoalType`, owner `User`.

Daily calories (Mifflin-St Jeor + activity + goal):
```java
if (u.getGender() == null || u.getGender() == Gender.MALE) {
  bmr = 10 * u.getWeight() + 6.25 * u.getHeight() - 5 * u.getAge() + 5;
} else {
  bmr = 10 * u.getWeight() + 6.25 * u.getHeight() - 5 * u.getAge() - 161;
}
```

## Repositories
- `UserRepository`: find by email.
- `MealRepository`: find by user; by user and date.
- `GoalRepository`: find by user.
- `FoodRepository`: active foods, by category, case-insensitive name search, high-protein and low-calorie JPQL helpers.

Examples:
```java
@Query("SELECT f FROM Food f WHERE f.isActive = true AND f.calories <= :maxCalories ORDER BY f.calories ASC")
List<Food> findLowCalorieFoods(@Param("maxCalories") Double maxCalories);

@Query("SELECT f FROM Food f WHERE f.isActive = true AND f.protein >= :minProtein ORDER BY f.protein DESC")
List<Food> findHighProteinFoods(@Param("minProtein") Double minProtein);
```

## Services
- `AuthService`: register (duplicate check, hash password), authenticate (verify password, return JWT).
- `UserService`: CRUD and `calculateDailyCalories(User)`; saves `dailyCalorieTarget`.
- `FoodService`: DTO mapping; list/search/filter foods; recommendations by goal; high-protein/low-calorie helpers; soft delete.
- `MealService`: add/update/delete meals for current user; compute meal nutrition; daily aggregations (`DailyNutritionDto`).
- `GoalService`: placeholder for business logic (controller currently uses repository for CRUD).

`MealService.addMeal` response logic (excerpt):
```java
double totalCaloriesToday = getTotalCaloriesToday(user);
double targetCalories = user.getDailyCalorieTarget() != null ? user.getDailyCalorieTarget() : 2000.0;
StringBuilder message = new StringBuilder()
  .append("Meal added successfully! ")
  .append("Calories: ").append(meal.getCalories()).append(" cal")
  .append(" | Total today: ").append(totalCaloriesToday).append("/").append(targetCalories);
```

## Controllers and Endpoints (Base `/api`)
- Auth
  - `POST /auth/register` → Register user
  - `POST /auth/login` → Returns JWT (string)
- Users (auth)
  - `GET /users`
  - `GET /users/{id}`
  - `POST /users`
  - `PUT /users/{id}`
  - `DELETE /users/{id}`
  - `GET /users/me` → current user
  - `PUT /users/me/profile` → update profile, recompute calories
- Foods (public GET)
  - `GET /foods`
  - `GET /foods/search?name=...`
  - `GET /foods/category/{category}`
  - `GET /foods/recommendations?goalType=...`
  - `GET /foods/high-protein`
  - `GET /foods/low-calorie`
  - `GET /foods/{id}`
  - `POST /foods`, `PUT /foods/{id}`, `DELETE /foods/{id}` (admin-like)
- Meals (auth)
  - `POST /meals/add`
  - `GET /meals?date=YYYY-MM-DD`
  - `GET /meals/all`
  - `GET /meals/nutrition?date=YYYY-MM-DD`
  - `PUT /meals/{id}`
  - `DELETE /meals/{id}`
- Goals (auth)
  - `POST /goals/add`
  - `GET /goals`
  - `DELETE /goals/{id}`

See `API_TESTING_GUIDE.md` for request/response examples.

## Configuration
- `application.properties`
  - JDBC URL, user, password (PostgreSQL).
  - `spring.jpa.hibernate.ddl-auto=create-drop` (dev mode).
  - `spring.jpa.show-sql=true`.
  - `app.jwt.secret`, `app.jwt.expiration-ms`.
  - Security logging at DEBUG for dev.
- `CorsConfig`
  - Permissive `allowedOriginPatterns` for local dev; exposes `Authorization` header.
- `pom.xml`
  - Spring Boot starters: web, security, data-jpa, validation; PostgreSQL; Lombok; JJWT.

## Running Locally
Prerequisites: JDK 21, Maven, PostgreSQL (or the provided Neon DB).

Commands (Windows PowerShell):
```powershell
cd "D:\WORKS\Personalized Diet & Fitness\fitness-api"
./mvnw.cmd spring-boot:run
```

- Base URL: `http://localhost:8080/api`
- Quick flow: Register → Login (get JWT) → Update profile → Browse foods → Add meals → Get daily nutrition.
- Sample calls and payloads are in `API_TESTING_GUIDE.md`.

## Key Design Choices (for interviews)
- Clear layering: Controller → Service → Repository → DB; DTOs for transport.
- Stateless auth with JWT; extensible roles/authorities.
- Personalized calories: BMR (Mifflin-St Jeor) + activity + goal adjustment.
- Nutrition computation at write-time to simplify reads.
- Repository JPQL for high-protein/low-calorie and search.
- Dev-focused CORS and logging to speed frontend integration.

## Production Hardening
- Externalize secrets (env/secret manager); remove hard-coded DB/JWT values.
- Switch JPA DDL to `validate`; add migrations (Flyway/Liquibase).
- Return structured auth payloads (`{ token, expiresAt }`).
- Role-based authorization; restrict food admin endpoints.
- Bean validation on DTOs; global exception handling (`@ControllerAdvice`).
- Pagination and caching for large lists; N+1 avoidance.
- Observability (tracing/metrics); rate limiting.
- Tight CORS to known domains; HTTPS everywhere.
