const bcrypt = require('bcrypt');
const pool = require('./pool');

const SALT_ROUNDS = 8;

const seed = async () => {
  // Drop tables in reverse dependency order (join table first, then tables with FKs)
  await pool.query('DROP TABLE IF EXISTS workout_exercises');
  await pool.query('DROP TABLE IF EXISTS exercises');
  await pool.query('DROP TABLE IF EXISTS workouts');
  await pool.query('DROP TABLE IF EXISTS users');

  await pool.query(`
    CREATE TABLE users (
      user_id       SERIAL PRIMARY KEY,
      username      TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL
    )
  `);

  await pool.query(`
    CREATE TABLE workouts (
      workout_id SERIAL PRIMARY KEY,
      title      TEXT NOT NULL,
      duration   INTEGER,
      user_id    INTEGER REFERENCES users(user_id) ON DELETE CASCADE
    )
  `);

  await pool.query(`
    CREATE TABLE exercises (
      exercise_id SERIAL PRIMARY KEY,
      title       TEXT NOT NULL,
      description TEXT
    )
  `);

  await pool.query(`
    CREATE TABLE workout_exercises (
      workout_exercise_id SERIAL PRIMARY KEY,
      workout_id  INTEGER REFERENCES workouts(workout_id) ON DELETE CASCADE,
      exercise_id INTEGER REFERENCES exercises(exercise_id) ON DELETE CASCADE,
      UNIQUE (workout_id, exercise_id)
    )
  `);

  // Hash passwords in parallel — bcrypt is slow by design (CPU-bound hashing)
  const [aliceHash, bobHash] = await Promise.all([
    bcrypt.hash('password123', SALT_ROUNDS),
    bcrypt.hash('password123', SALT_ROUNDS),
  ]);

  // RETURNING captures inserted ids so we don't hardcode them
  const { rows: users } = await pool.query(`
    INSERT INTO users (username, password_hash) VALUES
      ('alice', $1),
      ('bob',   $2)
    RETURNING user_id, username
  `, [aliceHash, bobHash]);

  const [alice, bob] = users;

  const { rows: workouts } = await pool.query(`
    INSERT INTO workouts (title, duration, user_id) VALUES
      ('Morning Cardio',   30, $1),
      ('Upper Body Blast', 45, $1),
      ('Full Body Burn',   60, $2),
      ('Quick Core',       20, $2)
    RETURNING workout_id, title
  `, [alice.user_id, bob.user_id]);

  const [morningCardio, upperBody, fullBody, quickCore] = workouts;

  // Exercises are global (not user-scoped) — anyone can add them to their workouts
  const { rows: exercises } = await pool.query(`
    INSERT INTO exercises (title, description) VALUES
      ('Push-up',          'Upper body compound movement targeting chest, shoulders, and triceps'),
      ('Squat',            'Lower body compound movement targeting quads, hamstrings, and glutes'),
      ('Plank',            'Isometric core exercise holding a push-up position'),
      ('Jumping Jack',     'Full body cardio movement involving jumping with arms and legs spread'),
      ('Burpee',           'High intensity full body exercise combining a squat, push-up, and jump'),
      ('Lunge',            'Lower body exercise stepping forward and lowering the back knee'),
      ('Mountain Climber', 'Core and cardio drill driving knees to chest from a plank position')
    RETURNING exercise_id, title
  `);

  const [pushup, squat, plank, jumpingJack, burpee, lunge, mountainClimber] = exercises;

  // $1-$4 are workout IDs, $5-$10 are exercise IDs (lunge intentionally unlinked)
  await pool.query(`
    INSERT INTO workout_exercises (workout_id, exercise_id) VALUES
      ($1, $8),
      ($1, $9),
      ($1, $10),
      ($2, $5),
      ($2, $7),
      ($3, $5),
      ($3, $6),
      ($3, $8),
      ($3, $9),
      ($4, $7),
      ($4, $10)
  `, [
    morningCardio.workout_id,    // $1
    upperBody.workout_id,        // $2
    fullBody.workout_id,         // $3
    quickCore.workout_id,        // $4
    pushup.exercise_id,          // $5
    squat.exercise_id,           // $6
    plank.exercise_id,           // $7
    jumpingJack.exercise_id,     // $8
    burpee.exercise_id,          // $9
    mountainClimber.exercise_id, // $10
  ]);

  return { users, workouts, exercises };
};

seed()
  .then(({ users, workouts, exercises }) => {
    console.log('Database seeded successfully.');
    console.log(`  Users:     ${users.map((u) => u.username).join(', ')}`);
    console.log(`  Workouts:  ${workouts.map((w) => w.title).join(', ')}`);
    console.log(`  Exercises: ${exercises.map((e) => e.title).join(', ')}`);
  })
  .catch((err) => {
    console.error('Error seeding database:', err);
    process.exit(1);
  })
  .finally(() => pool.end());