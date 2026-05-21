import ExerciseItem from './ExerciseItem';

function ExerciseList({ exercises, loadExercises, workout_id }) {
  return (
    <ul id="exercise-list">
      {exercises.map((exercise) => (
        <ExerciseItem
          key={exercise.exercise_id}
          exercise={exercise}
          loadExercises={loadExercises}
          workout_id={workout_id}
        />
      ))}
    </ul>
  );
}

export default ExerciseList;