function CompletedWorkoutItem({ completed }) {
  const date = new Date(completed.completed_at).toLocaleDateString();

  return (
    <li className="completed-item">
      <span>{completed.title}</span>
      {completed.duration && <span>{completed.duration} mins</span>}
      <span className="completed-at">{date}</span>
    </li>
  );
}

export default CompletedWorkoutItem;