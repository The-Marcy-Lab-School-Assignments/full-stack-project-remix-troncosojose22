import CompletedWorkoutItem from './CompletedWorkoutItem';

function CompletedWorkoutList({ completedWorkouts }) {
  if (!completedWorkouts.length) return <p>No completed workouts yet.</p>;

  return (
    <ul id="completed-list">
      {completedWorkouts.map((completed) => (
        <CompletedWorkoutItem
          key={completed.completed_id}
          completed={completed}
        />
      ))}
    </ul>
  );
}

export default CompletedWorkoutList;