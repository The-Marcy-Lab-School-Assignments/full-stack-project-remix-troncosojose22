import handleFetch from './handleFetch';

export const fetchExercisesByWorkout = async (workout_id) => {
  return handleFetch(`/api/workouts/${workout_id}/exercises`);
};

export const fetchAllExercises = async () => {
  return handleFetch('/api/exercises');
};

export const createExercise = async (title, description) => {
  return handleFetch('/api/exercises', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, description }),
  });
};

export const updateExercise = async (exercise_id, updates) => {
  return handleFetch(`/api/exercises/${exercise_id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates),
  });
};

export const deleteExercise = async (exercise_id) => {
  return handleFetch(`/api/exercises/${exercise_id}`, { method: 'DELETE' });
};