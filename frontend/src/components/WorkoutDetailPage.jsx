import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchExercisesByWorkout } from '../adapters/exercise-adapters';
import { fetchWorkoutsByUser, deleteWorkout } from '../adapters/workout-adapters';
import { logCompletedWorkout } from '../adapters/completed-workout-adapters';
import AddExerciseForm from './AddExerciseForm';
import ExerciseList from './ExerciseList';
import EditWorkoutForm from './EditWorkoutForm';

function WorkoutDetailPage({ currentUser, handleLogout }) {
  const { workout_id } = useParams();
  const navigate = useNavigate();
  const [workout, setWorkout] = useState(null);
  const [exercises, setExercises] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeMode, setActiveMode] = useState(null);

  const loadWorkout = async () => {
    const { data, error } = await fetchWorkoutsByUser(currentUser.user_id);
    if (error) return console.error(error);
    const found = data.find((w) => w.workout_id === Number(workout_id));
    setWorkout(found);
  };

  const loadExercises = async () => {
    setIsLoading(true);
    setError(null);
    const { data1, error: fetchError2 } = await fetchExercisesByWorkout(workout_id);
    console.log(data1, 'hello');
    const { data, error: fetchError } = await fetchExercisesByWorkout(workout_id);
    if (fetchError2) {
      setError(fetchError.message);
    } else {
      setExercises(data);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    loadWorkout();
    loadExercises();
  }, [workout_id]);

  const handleDelete = async () => {
    const { error } = await deleteWorkout(workout_id);
    if (error) return console.error(error);
    navigate('/workouts');
  };

  const handleComplete = async () => {
    const { error } = await logCompletedWorkout(workout_id);
    if (error) return console.error(error);
    navigate('/workouts');
  };

  return (
    <section>
      <div id="user-controls">
        <span>Welcome, <strong>{currentUser.username}</strong>!</span>
        <button onClick={handleLogout}>Log Out</button>
        <button onClick={() => navigate('/workouts')}>Back to Workouts</button>
      </div>

      {workout && (
        <div>
          <h2>{workout.title}</h2>
          {workout.duration && <p>{workout.duration} mins</p>}
          <div className="workout-actions">
            <button className="action-btn" onClick={() => setActiveMode(activeMode === 'edit' ? null : 'edit')}>
              {activeMode === 'edit' ? 'Cancel' : 'Edit Workout'}
            </button>
            <button className="complete-btn" onClick={handleComplete}>Mark as Complete</button>
            <button className="delete-btn" onClick={handleDelete}>Delete Workout</button>
          </div>
          {activeMode === 'edit' && (
            <EditWorkoutForm
              workout_id={workout_id}
              currentTitle={workout.title}
              currentDuration={workout.duration}
              onUpdate={(updated) => {
                setWorkout(updated);
                setActiveMode(null);
              }}
            />
          )}
        </div>
      )}

      {isLoading && <p>Loading exercises...</p>}
      {error && <p className="error">Something went wrong: {error}</p>}
      {activeMode !== 'edit' && (
        <AddExerciseForm workout_id={workout_id} loadExercises={loadExercises} />
      )}
      <ExerciseList exercises={exercises} loadExercises={loadExercises} workout_id={workout_id} />
    </section>
  );
}

export default WorkoutDetailPage;