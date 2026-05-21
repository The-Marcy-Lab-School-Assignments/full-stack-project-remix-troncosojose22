const completedWorkoutModel = require('../models/completedWorkoutModel');

module.exports.logCompleted = async (req, res, next) => {
  try {
    const { workout_id } = req.body;
    if (!workout_id) return res.status(400).send({ error: 'workout_id is required.' });
    const completed = await completedWorkoutModel.create(workout_id, req.session.user_id);
    if (!completed) return res.status(500).send({ error: 'Failed to log workout.' });
    res.status(201).send(completed);
  } catch (err) {
    next(err);
  }
};

module.exports.listCompleted = async (req, res, next) => {
  try {
    const { user_id } = req.params;
    const completed = await completedWorkoutModel.findByUser(user_id);
    res.send(completed);
  } catch (err) {
    next(err);
  }
};