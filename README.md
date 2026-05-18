# Todo App — Full-Stack Case Study

A full-stack Todo app built with React, Express, and Postgres. Demonstrates session-based authentication, session rehydration, auth-dependent data fetching, and conditional rendering — the same patterns students use in their full-stack projects.

## User Stories

**Auth**

- A user can register for an account with a username and password
- A user can log in to an existing account
- A user can log out
- A returning user who has an active session is automatically logged in when they revisit the app

**Todos**

- A logged-in user can see all of their workouts
- A logged-in user can create a new workout by entering a title and exercises
- A logged-in user can track completed workouts
- A logged-in user can delete a workout

## Schema

```
users
─────────────────────────────
user_id       SERIAL PRIMARY KEY
username      TEXT UNIQUE NOT NULL
password_hash TEXT NOT NULL

workouts
─────────────────────────────
workout_id     SERIAL PRIMARY KEY
title       TEXT NOT NULL
duration    INTEGER
user_id     INTEGER REFERENCES users(user_id) ON DELETE CASCADE

exercises
______________________________
exercise_id SERIAL PRIMARY KEY
title       TEXT NOT NULL
description TEXT


workout_exercises
______________________________
workout_exercise_id SERIAL PRIMARY KEY
workout_id INTEGER REFERENCES workouts(workout_id) ON DELETE CASCADE
exercise_id INTEGER REFERENCES exercises(exercise_id) ON DELETE CASCADE
UNIQUE (workout_id, exercise_id)
```

A user has many workouts. Deleting a user cascades to delete all of their workouts.

Workouts can have many exercises, and an exercise can belong to many workouts

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
| POST   | `/api/workouts/:workout_id/exercise`               | `{ exercise_id }`     | `{ workout_id, duration, title, user_id }`   |
| POST   | `/api/workouts`                                    | `{ title }`           | `{ workout_id, title, duration, user_id }`   |
| PATCH  | `/api/workouts/:workout_id`                        | `{ title, duration }` | `{ workout_id, title, duration, user_id }`   |
| DELETE | `/api/workouts/:workout_id`                        | —                     | `{ workout_id, title, duration, user_id }`   |
| DELETE | `/api/workouts/:workout_id/exercises/:exercise_id` | —                     | `{ workout_id, title, duration, user_id }`   |

### Exercise endpoints

| Method | Endpoint                      | Request Body             | Response                              |
| ------ | ----------------------------- | ------------------------ | ------------------------------------- |
| GET    | `/api/exercises`              | —                        | `{ exercise_id, title, description }` |
| POST   | `/api/exercises`              | `{ title, description }` | `{ exercise_id, title, description }` |
| PATCH  | `/api/exercises/:exercise_id` | `{ title, description }` | `{ exercise_id, title, description }` |
| DELETE | `/api/exercises/:exercise_id` | —                        | `{ exercise_id, title, description }` |

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
swe-casestudy-7-todo-app/
├── frontend/               # React app (Vite)
│   ├── src/
│   │   ├── App.jsx         # Root component: currentUser state, session rehydration, auth handlers
│   │   ├── adapters/
│   │   │   ├── auth-adapters.js  # Fetch adapters for /api/auth/* endpoints
│   │   │   └── todo-adapters.js  # Fetch adapters for /api/todos/* endpoints
│   │   └── components/
│   │       ├── AuthPage.jsx    # Login + Register forms (shown when logged out)
│   │       ├── TodoPage.jsx    # Main app container (shown when logged in)
│   │       ├── AddTodoForm.jsx # Form to create a new todo
│   │       ├── TodoList.jsx    # Renders a list of TodoItems
│   │       └── TodoItem.jsx    # Single todo: checkbox, title, delete button
│   └── vite.config.js      # Proxies /api requests to Express in development
└── server/                 # Express + Postgres API
    ├── index.js            # App entry point, route definitions
    ├── controllers/
    │   ├── authControllers.js  # register, login, logout, getMe
    │   └── todoControllers.js  # list, create, update, delete todos
    ├── models/
    │   ├── userModel.js    # SQL queries for the users table
    │   └── todoModel.js    # SQL queries for the todos table
    ├── middleware/
    │   ├── checkAuthentication.js  # Blocks unauthenticated requests
    │   └── logRoutes.js            # Logs each incoming request
    └── db/
        ├── pool.js         # Postgres connection pool
        └── seed.js         # Creates tables and inserts sample data
```
