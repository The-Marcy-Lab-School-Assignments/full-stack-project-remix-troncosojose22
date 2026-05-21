import handleFetch from './handleFetch';

export const fetchAllWorkouts = async () => {
  return handleFetch('/api/workouts');
};

export const fetchWorkoutsByUser = async (user_id) => {
  return handleFetch(`/api/user/${user_id}/workouts`);
};

export const createWorkout = async (title) => {
  return handleFetch('/api/workouts', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title }),
  });
};

export const updateWorkout = async (workout_id, updates) => {
  return handleFetch(`/api/workouts/${workout_id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates),
  });
};

export const deleteWorkout = async (workout_id) => {
  return handleFetch(`/api/workouts/${workout_id}`, { method: 'DELETE' });
};