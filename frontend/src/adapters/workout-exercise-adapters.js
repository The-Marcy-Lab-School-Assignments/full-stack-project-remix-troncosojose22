import handleFetch from './handleFetch';

export const addExerciseToWorkout = async (workout_id, exercise_id) => {
  return handleFetch(`/api/workouts/${workout_id}/exercises`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ exercise_id }),
  });
};

export const removeExerciseFromWorkout = async (workout_id, exercise_id) => {
  return handleFetch(`/api/workouts/${workout_id}/exercises/${exercise_id}`, {
    method: 'DELETE',
  });
};