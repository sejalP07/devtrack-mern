const express = require('express');
const {
  getTasks,
  getTaskStats,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
} = require('../controllers/taskController');

const router = express.Router();

// IMPORTANT: /stats must be registered before /:id so Express does not
// interpret the literal string "stats" as a MongoDB ObjectId parameter.
router.get('/stats', getTaskStats);

router.route('/')
  .get(getTasks)
  .post(createTask);

router.route('/:id')
  .get(getTaskById)
  .put(updateTask)
  .delete(deleteTask);

module.exports = router;
