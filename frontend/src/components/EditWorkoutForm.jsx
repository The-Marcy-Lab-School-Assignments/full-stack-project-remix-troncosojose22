import { useState } from 'react';
import { updateWorkout } from '../adapters/workout-adapters';

function EditWorkoutForm({ workout_id, currentTitle, currentDuration, onUpdate }) {
  const [title, setTitle] = useState(currentTitle || '');
  const [duration, setDuration] = useState(currentDuration || '');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { data, error } = await updateWorkout(workout_id, { title, duration: Number(duration) });
    if (error) return console.error(error);
    onUpdate(data);
  };

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="edit-title">Title:</label>
      <input
        type="text"
        id="edit-title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <label htmlFor="edit-duration">Duration (mins):</label>
      <input
        type="number"
        id="edit-duration"
        value={duration}
        onChange={(e) => setDuration(e.target.value)}
      />
      <button type="submit">Save</button>
    </form>
  );
}

export default EditWorkoutForm;