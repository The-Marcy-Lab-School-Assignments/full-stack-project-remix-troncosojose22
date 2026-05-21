import WorkoutItem from './WorkoutItem';

function WorkoutList({ workouts, loadWorkouts, onWorkoutClick }) {
  return (
    <ul id="workout-list">
      {workouts.map((workout) => (
        <WorkoutItem
          key={workout.workout_id}
          workout={workout}
          loadWorkouts={loadWorkouts}
          onWorkoutClick={onWorkoutClick}
        />
      ))}
    </ul>
  );
}

export default WorkoutList;