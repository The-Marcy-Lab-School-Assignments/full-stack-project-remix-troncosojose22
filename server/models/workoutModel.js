const pool = require('../db/pool');

module.exports.getAll = async () => {
  const { rows } = await pool.query('SELECT * FROM workouts');
  return rows;
};

module.exports.findByUser = async (user_id) => {
  const { rows } = await pool.query(
    'SELECT * FROM workouts WHERE user_id = $1',
    [user_id]
  );
  return rows;
};

module.exports.find = async (workout_id) => {
  const { rows } = await pool.query(
    'SELECT * FROM workouts WHERE workout_id = $1',
    [workout_id]
  );
  return rows[0] || null;
};

module.exports.create = async (title, user_id) => {
  const { rows } = await pool.query(
    'INSERT INTO workouts (title, user_id) VALUES ($1, $2) RETURNING *',
    [title, user_id]
  );
  return rows[0];
};

module.exports.update = async (workout_id, title, duration) => {
  const { rows } = await pool.query(
    'UPDATE workouts SET title = $1, duration = $2 WHERE workout_id = $3 RETURNING *',
    [title, duration, workout_id]
  );
  return rows[0] || null;
};

module.exports.remove = async (workout_id) => {
  const { rows } = await pool.query(
    'DELETE FROM workouts WHERE workout_id = $1 RETURNING *',
    [workout_id]
  );
  return rows[0] || null;
};