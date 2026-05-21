import { deleteWorkout } from '../adapters/workout-adapters';

function WorkoutItem({ workout, loadWorkouts, onWorkoutClick }) {
  const handleDelete = async (e) => {
    e.stopPropagation();
    const { error } = await deleteWorkout(workout.workout_id);
    if (error) return console.error(error);
    loadWorkouts();
  };

  return (
    <li className="workout-item" onClick={() => onWorkoutClick(workout.workout_id)}>
      <span>{workout.title}</span>
      {workout.duration && <span>{workout.duration} mins</span>}
      <button className="delete-btn" onClick={handleDelete}>Delete</button>
    </li>
  );
}

export default WorkoutItem;