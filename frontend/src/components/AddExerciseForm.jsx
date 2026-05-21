import { useState, useEffect } from 'react';
import { fetchAllExercises, createExercise } from '../adapters/exercise-adapters';
import { addExerciseToWorkout } from '../adapters/workout-exercise-adapters';

function AddExerciseForm({ workout_id, loadExercises }) {
  const [allExercises, setAllExercises] = useState([]);
  const [selectedExerciseId, setSelectedExerciseId] = useState('');
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [addError, setAddError] = useState(null);
  const [createFormError, setCreateFormError] = useState(null);

  useEffect(() => {
    const loadAllExercises = async () => {
      const { data, error } = await fetchAllExercises();
      if (error) return console.error(error);
      setAllExercises(data);
    };
    loadAllExercises();
  }, []);

  const handleAddExisting = async (e) => {
    e.preventDefault();
    if (!selectedExerciseId) return;
    setAddError(null);
    const { error } = await addExerciseToWorkout(workout_id, selectedExerciseId);
    if (error) return setAddError('This exercise is already in the workout.');
    await loadExercises();
    setSelectedExerciseId('');
  };

  const handleCreateAndAdd = async (e) => {
    e.preventDefault();
    if (!newTitle) return;
    setCreateFormError(null);
    const { data: exercise, error: createError } = await createExercise(newTitle, newDescription);
    if (createError) return setCreateFormError('An exercise with that title already exists.');
    const { error: addError } = await addExerciseToWorkout(workout_id, exercise.exercise_id);
    if (addError) return console.error(addError);
    await loadExercises();
    setAllExercises((prev) => [...prev, exercise]);
    setNewTitle('');
    setNewDescription('');
    setShowCreateForm(false);
  };

  return (
    <div id="add-exercise-form">
      {!showCreateForm && (
        <form onSubmit={handleAddExisting}>
          <label htmlFor="exercise-select">Add exercise:</label>
          <select
            id="exercise-select"
            value={selectedExerciseId}
            onChange={(e) => setSelectedExerciseId(e.target.value)}
          >
            <option value="">Select an exercise</option>
            {allExercises.map((exercise) => (
              <option key={exercise.exercise_id} value={exercise.exercise_id}>
                {exercise.title}
              </option>
            ))}
          </select>
          {addError && <p className="error">{addError}</p>}
          <button type="submit">Add</button>
        </form>
      )}

      <button onClick={() => setShowCreateForm((prev) => !prev)}>
        {showCreateForm ? 'Cancel' : 'Create new exercise'}
      </button>

      {showCreateForm && (
        <form onSubmit={handleCreateAndAdd}>
          <label htmlFor="new-title">Exercise title:</label>
          <input
            type="text"
            id="new-title"
            placeholder="e.g. Deadlift"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
          />
          <label htmlFor="new-description">Description (optional):</label>
          <input
            type="text"
            id="new-description"
            placeholder="e.g. Posterior chain compound movement"
            value={newDescription}
            onChange={(e) => setNewDescription(e.target.value)}
          />
          {createFormError && <p className="error">{createFormError}</p>}
          <button type="submit">Create and Add</button>
        </form>
      )}
    </div>
  );
}

export default AddExerciseForm;