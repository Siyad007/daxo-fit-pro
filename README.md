<img width="1918" height="975" alt="Screenshot 2025-09-25 120932" src="https://github.com/user-attachments/assets/d9477180-995e-4b9a-bbaa-1d561587a3fc" />
<img width="1919" height="987" alt="Screenshot 2025-09-25 120942" src="https://github.com/user-attachments/assets/9753058f-e6f7-471c-aa68-5e3614d865c3" />


Daxo-Fit-Pro 🏋️‍♂️🍎

Overview

A full‑stack app to personalize your diet and fitness. Set goals, get calorie targets from BMR + activity level, log meals, and track progress with a secure, role‑based experience.

Tech

- Backend: Spring Boot, PostgreSQL, JWT
- Frontend: React (Vite + TypeScript), Tailwind CSS

Core Features

- Secure auth (JWT): register, login, protected routes
- Smart goals: calculates BMR and daily calories automatically
- Meal tracking: add meals and macros; daily nutrition summary
- Progress & insights: dashboard charts, goal status
- Role‑based UI: admin vs user views

Domain Model (short)

- User: name, email, password, role (USER/ADMIN)
- Goal: target (weight, activity level, duration)
- Food/Meal: items, macros, meal type, timestamps

API (key endpoints)

- Auth
  - POST /auth/register → create user
  - POST /auth/login → get JWT
- User
  - GET /me → profile
- Goals
  - POST /goals → create (auto‑calculates BMR + calories)
  - GET /goals → list
  - PUT /goals/{id} → update
  - DELETE /goals/{id} → delete

How it works

1) Register → stored in PostgreSQL
2) Login → receive JWT
3) Create goal → backend computes BMR + daily calories
4) Use the dashboard → see calorie targets, meals, and progress

Quick Start

Backend (Spring Boot)

1) Create a PostgreSQL DB and set environment in `fitness-api/src/main/resources/application.properties` (or copy `application-example.properties`).
2) From `fitness-api/` run:

```
./mvnw spring-boot:run
```

Frontend (React + Vite)

1) From `fitness_ui-part/` install deps and start dev server:

```
npm install
npm run dev
```

Notes

- Store the JWT in `localStorage`; it is auto‑attached to API requests in the UI.
- BMR is calculated from age, gender, weight, height; daily calories adjust by activity level.
- See `fitness-api/README.md` for architecture details and testing tips.
