# Workout Tracker

A full-stack Workout Tracker built with React, Express, and Postgres. Track your workouts, log completed sessions, and build a personal exercise library, all in one place.

## User Stories

**Auth**

- A user can register for an account with a username and password
- A user can log in to an existing account
- A user can log out
- A returning user who has an active session is automatically logged in when they revisit the app

**Workouts**

- A user can see all of their workouts
- A user can create a new workout by entering a title
- A user can edit a workout's title and duration
- A user can mark a workout as complete
- A user can delete a workout
- A user can view their completed workout history

**Exercises**

- A user can add an existing exercise to a workout
- A user can create a new exercise and add it to a workout
- A user can remove an exercise from a workout

## Schema

```
users
─────────────────────────────
user_id       SERIAL PRIMARY KEY
username      TEXT UNIQUE NOT NULL
password_hash TEXT NOT NULL

workouts
─────────────────────────────
workout_id   SERIAL PRIMARY KEY
title        TEXT NOT NULL
duration     INTEGER
user_id      INTEGER REFERENCES users(user_id) ON DELETE CASCADE

exercises
─────────────────────────────
exercise_id  SERIAL PRIMARY KEY
title        TEXT NOT NULL UNIQUE
description  TEXT

workout_exercises
─────────────────────────────
workout_exercise_id SERIAL PRIMARY KEY
workout_id   INTEGER REFERENCES workouts(workout_id) ON DELETE CASCADE
exercise_id  INTEGER REFERENCES exercises(exercise_id) ON DELETE CASCADE
UNIQUE (workout_id, exercise_id)

completed_workouts
─────────────────────────────
completed_id  SERIAL PRIMARY KEY
workout_id    INTEGER REFERENCES workouts(workout_id) ON DELETE CASCADE
user_id       INTEGER REFERENCES users(user_id) ON DELETE CASCADE
completed_at  TIMESTAMP DEFAULT NOW()
```

A user has many workouts. Deleting a user cascades to delete all of their workouts.

Workouts can have many exercises, and an exercise can belong to many workouts.

## API Contract

### Auth endpoints

| Method | Endpoint             | Request Body             | Response                          |
| ------ | -------------------- | ------------------------ | --------------------------------- |
| POST   | `/api/auth/register` | `{ username, password }` | `{ user_id, username }`           |
| POST   | `/api/auth/login`    | `{ username, password }` | `{ user_id, username }`           |
| DELETE | `/api/auth/logout`   | —                        | `{ message }`                     |
| GET    | `/api/auth/me`       | —                        | `{ user_id, username }` or `null` |

### Workout endpoints

| Method | Endpoint                                           | Request Body          | Response                                     |
| ------ | -------------------------------------------------- | --------------------- | -------------------------------------------- |
| GET    | `/api/workouts`                                    | —                     | `[{ workout_id, title, duration, user_id }]` |
| GET    | `/api/user/:user_id/workouts`                      | —                     | `[{ workout_id, title, duration, user_id }]` |
| GET    | `/api/workouts/:workout_id/exercises`              | —                     | `[{ exercise_id, title, description }]`      |
| POST   | `/api/workouts`                                    | `{ title }`           | `{ workout_id, title, duration, user_id }`   |
| POST   | `/api/workouts/:workout_id/exercises`              | `{ exercise_id }`     | `{ workout_id, duration, title, user_id }`   |
| PATCH  | `/api/workouts/:workout_id`                        | `{ title, duration }` | `{ workout_id, title, duration, user_id }`   |
| DELETE | `/api/workouts/:workout_id`                        | —                     | `{ workout_id, title, duration, user_id }`   |
| DELETE | `/api/workouts/:workout_id/exercises/:exercise_id` | —                     | `{ workout_id, title, duration, user_id }`   |

### Exercise endpoints

| Method | Endpoint                      | Request Body             | Response                                |
| ------ | ----------------------------- | ------------------------ | --------------------------------------- |
| GET    | `/api/exercises`              | —                        | `[{ exercise_id, title, description }]` |
| POST   | `/api/exercises`              | `{ title, description }` | `{ exercise_id, title, description }`   |
| PATCH  | `/api/exercises/:exercise_id` | `{ title, description }` | `{ exercise_id, title, description }`   |
| DELETE | `/api/exercises/:exercise_id` | —                        | `{ exercise_id, title, description }`   |

### Completed workout endpoints

| Method | Endpoint                       | Request Body     | Response                                                        |
| ------ | ------------------------------ | ---------------- | --------------------------------------------------------------- |
| POST   | `/api/completed`               | `{ workout_id }` | `{ completed_id, workout_id, user_id, completed_at }`           |
| GET    | `/api/user/:user_id/completed` | —                | `[{ completed_id, completed_at, workout_id, title, duration }]` |

## Setup

### 1. Database

Create a local Postgres database:

```sh
createdb workouts_db
```

### 2. Server

```sh
cd server
npm install
cp .env.template .env
```

Open `.env` and fill in your Postgres credentials and a session secret. Then seed the database:

```sh
npm run db:seed
```

Start the server:

```sh
npm run dev
```

The server runs on `http://localhost:8080`.

### 3. Frontend

In a second terminal:

```sh
cd frontend
npm install
npm run dev
```

The frontend runs on `http://localhost:5173`. The Vite dev proxy forwards all `/api` requests to the Express server so session cookies work correctly.

## Seed Users

After running `npm run db:seed`, these accounts are available:

| Username | Password    |
| -------- | ----------- |
| alice    | password123 |
| bob      | password123 |

## Application Structure

```
workout-app/
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── adapters/
│   │   │   ├── handleFetch.js
│   │   │   ├── auth-adapters.js
│   │   │   ├── workout-adapters.js
│   │   │   ├── exercise-adapters.js
│   │   │   ├── workout-exercise-adapters.js
│   │   │   └── completed-workout-adapters.js
│   │   └── components/
│   │       ├── LoginPage.jsx
│   │       ├── RegisterPage.jsx
│   │       ├── WorkoutsPage.jsx
│   │       ├── WorkoutDetailPage.jsx
│   │       ├── AddWorkoutForm.jsx
│   │       ├── WorkoutList.jsx
│   │       ├── WorkoutItem.jsx
│   │       ├── EditWorkoutForm.jsx
│   │       ├── AddExerciseForm.jsx
│   │       ├── ExerciseList.jsx
│   │       ├── ExerciseItem.jsx
│   │       ├── CompletedWorkoutList.jsx
│   │       └── CompletedWorkoutItem.jsx
│   └── vite.config.js
└── server/
    ├── index.js
    ├── controllers
    │   ├── authControllers.js
    │   ├── workoutControllers.js
    │   ├── exerciseControllers.js
    │   ├── workoutExerciseControllers.js
    │   └── completedWorkoutControllers.js
    ├── models/
    │   ├── userModel.js
    │   ├── workoutModel.js
    │   ├── exerciseModel.js
    │   ├── workoutExerciseModel.js
    │   └── completedWorkoutModel.js
    ├── middleware/
    │   ├── checkAuthentication.js
    │   └── logRoutes.js
    └── db/
        ├── pool.js
        └── seed.js
```
