const workoutExerciseModel = require('../models/workoutExerciseModel');
const workoutModel = require('../models/workoutModel');

module.exports.addExercise = async (req, res, next) => {
  try {
    const { workout_id } = req.params;
    const { exercise_id } = req.body;
    if (!exercise_id) return res.status(400).send({ error: 'exercise_id is required.' });
    const workout = await workoutModel.find(workout_id);
    if (!workout) return res.status(404).send({ error: 'Workout not found.' });
    if (workout.user_id !== req.session.user_id) {
      return res.status(403).send({ error: 'Not authorized.' });
    }
    const link = await workoutExerciseModel.add(workout_id, exercise_id);
    res.status(201).send(link);
  } catch (err) {
    if (err.code === '23505') {
      return res.status(409).send({ error: 'Exercise already in workout.' });
    }
    next(err);
  }
};

module.exports.removeExercise = async (req, res, next) => {
  try {
    const { workout_id, exercise_id } = req.params;
    const workout = await workoutModel.find(workout_id);
    if (!workout) return res.status(404).send({ error: 'Workout not found.' });
    if (workout.user_id !== req.session.user_id) {
      return res.status(403).send({ error: 'Not authorized.' });
    }
    const removed = await workoutExerciseModel.remove(workout_id, exercise_id);
    if (!removed) return res.status(404).send({ error: 'Exercise not found in workout.' });
    res.send(removed);
  } catch (err) {
    next(err);
  }
};