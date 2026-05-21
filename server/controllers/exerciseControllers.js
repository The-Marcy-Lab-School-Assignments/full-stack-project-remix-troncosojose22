const exerciseModel = require('../models/exerciseModel');

module.exports.listExercises = async (req, res, next) => {
  try {
    const exercises = await exerciseModel.getAll();
    res.send(exercises);
  } catch (err) {
    next(err);
  }
};

module.exports.listByWorkout = async (req, res, next) => {
  try {
    const { workout_id } = req.params;
    const exercises = await exerciseModel.findByWorkout(workout_id);
    res.send(exercises);
  } catch (err) {
    next(err);
  }
};

module.exports.createExercise = async (req, res, next) => {
  try {
    const { title, description } = req.body;
    if (!title) return res.status(400).send({ error: 'Title is required.' });
    const exercise = await exerciseModel.create(title, description);
    res.status(201).send(exercise);
  } catch (err) {
    if (err.code === '23505') {
      return res.status(409).send({ error: 'An exercise with that title already exists.' });
    }
    next(err);
  }
};

module.exports.updateExercise = async (req, res, next) => {
  try {
    const { exercise_id } = req.params;
    const { title, description } = req.body;
    const updatedExercise = await exerciseModel.update(exercise_id, title, description);
    if (!updatedExercise) return res.status(404).send({ error: 'Exercise not found.' });
    res.send(updatedExercise);
  } catch (err) {
    next(err);
  }
};

module.exports.deleteExercise = async (req, res, next) => {
  try {
    const { exercise_id } = req.params;
    const deletedExercise = await exerciseModel.remove(exercise_id);
    if (!deletedExercise) return res.status(404).send({ error: 'Exercise not found.' });
    res.send(deletedExercise);
  } catch (err) {
    next(err);
  }
};