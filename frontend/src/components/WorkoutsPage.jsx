import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchWorkoutsByUser } from '../adapters/workout-adapters';
import { fetchCompletedWorkouts } from '../adapters/completed-workout-adapters';
import AddWorkoutForm from './AddWorkoutForm';
import WorkoutList from './WorkoutList';
import CompletedWorkoutList from './CompletedWorkoutList';

function WorkoutsPage({ currentUser, handleLogout }) {
  const [workouts, setWorkouts] = useState([]);
  const [completedWorkouts, setCompletedWorkouts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const loadWorkouts = async () => {
    setIsLoading(true);
    setError(null);
    const { data, error: fetchError } = await fetchWorkoutsByUser(currentUser.user_id);
    if (fetchError) {
      setError(fetchError.message);
    } else {
      setWorkouts(data);
    }
    setIsLoading(false);
  };

  const loadCompletedWorkouts = async () => {
    const { data, error: fetchError } = await fetchCompletedWorkouts(currentUser.user_id);
    if (fetchError) return console.error(fetchError);
    setCompletedWorkouts(data);
  };

  useEffect(() => {
    loadWorkouts();
    loadCompletedWorkouts();
  }, []);

  const handleWorkoutClick = (workout_id) => {
    navigate(`/workouts/${workout_id}`);
  };

  return (
    <section>
      <div id="user-controls">
        <span>Welcome, <strong>{currentUser.username}</strong>!</span>
        <button onClick={handleLogout}>Log Out</button>
      </div>
      <AddWorkoutForm loadWorkouts={loadWorkouts} />
      {isLoading && <p>Loading workouts...</p>}
      {error && <p className="error">Something went wrong: {error}</p>}
      <WorkoutList workouts={workouts} loadWorkouts={loadWorkouts} onWorkoutClick={handleWorkoutClick} />
      <h2>Completed Workouts</h2>
      <CompletedWorkoutList completedWorkouts={completedWorkouts} />
    </section>
  );
}

export default WorkoutsPage;