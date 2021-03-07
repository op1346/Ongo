'use strict'

const express = require('express');
const { models } = require('./db');

const router = express.Router();

const { User, Task } = models;

function asyncHandler(cb) {
  return async(req, res, next) => {
    try {
      await cb(req, res, next);
    } catch(error) {
      return next(error);
    }
  }
}

// GET All Tasks
router.get('/', asyncHandler(async(req, res) => {
  const tasks = await Task.findAll();
  res.json(tasks);
  res.status(200).end();
}));

// GET All completed tasks
router.get('/completed', asyncHandler(async(req, res) => {
  const tasks = await Task.findAll({
    where: {
      "taskCompleted": true
    }
  });
  res.json(tasks);
  res.status(200).end();
}));

// GET All incompleted tasks
router.get('/incomplete', asyncHandler(async(req, res) => {
  const tasks = await Task.findAll({
    where: {
      "taskCompleted": false
    }
  });
  res.json(tasks);
  res.status(200).end();
}));

// GET All followed tasks
router.get('/followed', asyncHandler(async(req, res) => {
  const userFollow = await User.findAll({
    where: {

    }
  });
  res.json(userFollow);
  res.status(200).end();
}));

// POST Add task
router.post('/', asyncHandler(async(req, res) => {
  const user = req.body;
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map(error => error.msg);
    return res.status(400).json({ errors: errorMessages });
  } else {
    const task = await Task.create(req.body);
    const taskId = task.dataValues.id;
    res.status(201).location(`/tasks/${taskId}`).end();
  }
}));

// PUT updates a task
router.put('/tasks/:id', asyncHandler(async(req, res) => {
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map(error => error.msg);
    res.status(400).json({ errors: errorMessages });
  }
  const task = await Task.findByPk(req.params.id);
  if (task) {
    const updated = await task.update(req.body);
    res.status(204).end();
  } else {
    res.status(404).json({ message: "No tasks found to update" });
  }
}));

// FOLLOW
router.put('/tasks/:id', asyncHandler(async(req, res) => {
  const task = await Task.findByPk(req.params.id);
  if (task) {

  } else {
    res.status(404).json({ message: "No tasks found" });
  }
}));

// UNFOLLOW
router.put('/tasks/:id', asyncHandler(async(req, res) => {
  const task = await Task.findByPk(req.params.id);
  if (task) {

  } else {
    res.status(404).json({ message: "No tasks found" });
  }
}));

//DELETE Tasks by user ID if Admin
router.delete('/tasks/', asyncHandler(async(req, res) => {
  const tasks = await Task.findAll({
    where: req.body.userId
  });
  const user = await User.findAll({
    where: {
      "isAdmin": true
    }
  })
  if (tasks && user) {
    await task.destroy();
    res.status(204).end();
  } else {
    res.status(404).json({ message: "No tasks found to delete" });
  };
}));

// DELETE individual tasks
router.delete('/tasks/:id', asyncHandler(async(req, res) => {
  const task = await Task.findByPk(req.params.id);
  if (task) {
    await task.destroy();
    res.status(204).end();
  } else {
    res.status(404).json({ message: "No tasks found to delete." });
  }
}))

module.exports = router;