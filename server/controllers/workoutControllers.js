const workoutModel = require('../models/workoutModel');

module.exports.listWorkouts = async (req, res, next) => {
  try {
    const workouts = await workoutModel.getAll();
    res.send(workouts);
  } catch (err) {
    next(err);
  }
};

module.exports.listByUser = async (req, res, next) => {
  try {
    const { user_id } = req.params;
    const workouts = await workoutModel.findByUser(user_id);
    res.send(workouts);
  } catch (err) {
    next(err);
  }
};

module.exports.createWorkout = async (req, res, next) => {
  try {
    const { title } = req.body;
    if (!title) return res.status(400).send({ error: 'Title is required.' });
    const workout = await workoutModel.create(title, req.session.user_id);
    res.status(201).send(workout);
  } catch (err) {
    next(err);
  }
};

module.exports.updateWorkout = async (req, res, next) => {
  try {
    const { workout_id } = req.params;
    const workout = await workoutModel.find(workout_id);
    if (!workout) return res.status(404).send({ error: 'Workout not found.' });
    if (workout.user_id !== req.session.user_id) {
      return res.status(403).send({ error: 'Not authorized.' });
    }
    const { title, duration } = req.body;
    const updatedWorkout = await workoutModel.update(workout_id, title, duration);
    res.send(updatedWorkout);
  } catch (err) {
    next(err);
  }
};

module.exports.deleteWorkout = async (req, res, next) => {
  try {
    const { workout_id } = req.params;
    const workout = await workoutModel.find(workout_id);
    if (!workout) return res.status(404).send({ error: 'Workout not found.' });
    if (workout.user_id !== req.session.user_id) {
      return res.status(403).send({ error: 'Not authorized.' });
    }
    const deletedWorkout = await workoutModel.remove(workout_id);
    res.send(deletedWorkout);
  } catch (err) {
    next(err);
  }
};