const pool = require('../db/pool');

module.exports.create = async (workout_id, user_id) => {
  const { rows } = await pool.query(
    `INSERT INTO completed_workouts (workout_id, user_id)
     VALUES ($1, $2)
     RETURNING *`,
    [workout_id, user_id]
  );
  return rows[0] || null;
};

module.exports.findByUser = async (user_id) => {
  const { rows } = await pool.query(
    `SELECT cw.completed_id, cw.completed_at, w.workout_id, w.title, w.duration
     FROM completed_workouts cw
     JOIN workouts w ON cw.workout_id = w.workout_id
     WHERE cw.user_id = $1
     ORDER BY cw.completed_at DESC`,
    [user_id]
  );
  return rows;
};