import { createWorkout } from '../adapters/workout-adapters';

function AddWorkoutForm({ loadWorkouts }) {
  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const title = form.elements.title.value;
    if (!title) return;

    const { error } = await createWorkout(title);
    if (error) return console.error(error);

    await loadWorkouts();
    form.reset();
  };

  return (
    <form id="add-workout-form" onSubmit={handleSubmit}>
      <label htmlFor="title-input">New Workout:</label>
      <input type="text" name="title" id="title-input" placeholder="Workout title" />
      <button type="submit">Add</button>
    </form>
  );
}

export default AddWorkoutForm;