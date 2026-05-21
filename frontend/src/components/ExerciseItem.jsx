import { removeExerciseFromWorkout } from '../adapters/workout-exercise-adapters';

function ExerciseItem({ exercise, loadExercises, workout_id }) {
  const handleRemove = async () => {
    const { error } = await removeExerciseFromWorkout(workout_id, exercise.exercise_id);
    if (error) return console.error(error);
    loadExercises();
  };

  return (
    <li className="exercise-item">
      <span>{exercise.title}</span>
      {exercise.description && <p>{exercise.description}</p>}
      <button className="delete-btn" onClick={handleRemove}>Remove</button>
    </li>
  );
}

export default ExerciseItem;