import './App.css'
import { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { getMe, login, register, logout } from './adapters/auth-adapters';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import WorkoutsPage from './components/WorkoutsPage';
import WorkoutDetailPage from './components/WorkoutDetailPage';

function App() {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const checkForSession = async () => {
      const { data: user } = await getMe();
      setCurrentUser(user);
    };
    checkForSession();
  }, []);

  const handleLogin = async (username, password) => {
    const { data: user, error } = await login(username, password);
    if (error) return error;
    setCurrentUser(user);
  };

  const handleRegister = async (username, password) => {
    const { data: user, error } = await register(username, password);
    if (error) return error;
    setCurrentUser(user);
  };

  const handleLogout = async () => {
    await logout();
    setCurrentUser(null);
  };

  return (
    <main>
      <h1>Workout Tracker</h1>
      <Routes>
        <Route
          path="/"
          element={currentUser ? <Navigate to="/workouts" /> : <Navigate to="/login" />}
        />
        <Route
          path="/login"
          element={currentUser ? <Navigate to="/workouts" /> : <LoginPage handleLogin={handleLogin} />}
        />
        <Route
          path="/register"
          element={currentUser ? <Navigate to="/workouts" /> : <RegisterPage handleRegister={handleRegister} />}
        />
        <Route
          path="/workouts"
          element={currentUser ? <WorkoutsPage currentUser={currentUser} handleLogout={handleLogout} /> : <Navigate to="/login" />}
        />
        <Route
          path="/workouts/:workout_id"
          element={currentUser ? <WorkoutDetailPage currentUser={currentUser} handleLogout={handleLogout} /> : <Navigate to="/login" />}
        />
      </Routes>
    </main>
  );
}

export default App;