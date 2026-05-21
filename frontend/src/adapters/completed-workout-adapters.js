import handleFetch from './handleFetch';

export const logCompletedWorkout = async (workout_id) => {
  return handleFetch('/api/completed', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ workout_id }),
  });
};

export const fetchCompletedWorkouts = async (user_id) => {
  return handleFetch(`/api/user/${user_id}/completed`);
};