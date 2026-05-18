const pool = require('../db/pool');

module.exports.findByWorkout = async (workout_id) => {
  const { rows } = await pool.query(
    `SELECT e.exercise_id, e.title, e.description
     FROM exercises e
     JOIN workout_exercises we ON e.exercise_id = we.exercise_id
     WHERE we.workout_id = $1`,
    [workout_id]
  );
  return rows;
};

module.exports.create = async (title, description) => {
  const { rows } = await pool.query(
    'INSERT INTO exercises (title, description) VALUES ($1, $2) RETURNING *',
    [title, description]
  );
  return rows[0];
};

module.exports.update = async (exercise_id, title, description) => {
  const { rows } = await pool.query(
    'UPDATE exercises SET title = $1, description = $2 WHERE exercise_id = $3 RETURNING *',
    [title, description, exercise_id]
  );
  return rows[0] || null;
};

module.exports.remove = async (exercise_id) => {
  const { rows } = await pool.query(
    'DELETE FROM exercises WHERE exercise_id = $1 RETURNING *',
    [exercise_id]
  );
  return rows[0] || null;
};