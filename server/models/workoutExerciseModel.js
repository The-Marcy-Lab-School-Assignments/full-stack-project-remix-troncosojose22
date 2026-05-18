const pool = require('../db/pool');

module.exports.add = async (workout_id, exercise_id) => {
  const { rows } = await pool.query(
    'INSERT INTO workout_exercises (workout_id, exercise_id) VALUES ($1, $2) RETURNING *',
    [workout_id, exercise_id]
  );
  return rows[0];
};

module.exports.remove = async (workout_id, exercise_id) => {
  const { rows } = await pool.query(
    'DELETE FROM workout_exercises WHERE workout_id = $1 AND exercise_id = $2 RETURNING *',
    [workout_id, exercise_id]
  );
  return rows[0] || null;
}; 