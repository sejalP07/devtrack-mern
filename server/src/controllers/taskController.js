const mongoose = require('mongoose');
const Task = require('../models/Task');

// ── Helpers ───────────────────────────────────────────────────────────────────

/**
 * Returns true if the given string is a valid MongoDB ObjectId.
 */
const isValidId = (id) => mongoose.Types.ObjectId.isValid(id);

/**
 * Extracts Mongoose validation error messages into a flat array.
 */
const extractValidationErrors = (err) =>
  Object.values(err.errors).map((e) => e.message);

// ── GET /api/tasks ─────────────────────────────────────────────────────────────
const getTasks = async (req, res, next) => {
  try {
    const { search, status, priority } = req.query;

    // Build filter object incrementally so only provided params are applied
    const filter = {};

    if (status) {
      filter.status = status;
    }

    if (priority) {
      filter.priority = priority;
    }

    if (search) {
      // Case-insensitive regex search across title and description
      const regex = new RegExp(search, 'i');
      filter.$or = [{ title: regex }, { description: regex }];
    }

    const tasks = await Task.find(filter).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: tasks.length,
      data: tasks,
    });
  } catch (err) {
    next(err);
  }
};

// ── GET /api/tasks/stats ───────────────────────────────────────────────────────
const getTaskStats = async (req, res, next) => {
  try {
    // Run all counts in parallel for efficiency
    const [total, todo, inProgress, done, highPriority] = await Promise.all([
      Task.countDocuments(),
      Task.countDocuments({ status: 'Todo' }),
      Task.countDocuments({ status: 'In Progress' }),
      Task.countDocuments({ status: 'Done' }),
      Task.countDocuments({ priority: 'High' }),
    ]);

    res.status(200).json({
      success: true,
      data: { total, todo, inProgress, done, highPriority },
    });
  } catch (err) {
    next(err);
  }
};

// ── GET /api/tasks/:id ─────────────────────────────────────────────────────────
const getTaskById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!isValidId(id)) {
      return res.status(400).json({
        success: false,
        message: `Invalid task ID: ${id}`,
      });
    }

    const task = await Task.findById(id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found',
      });
    }

    res.status(200).json({ success: true, data: task });
  } catch (err) {
    next(err);
  }
};

// ── POST /api/tasks ────────────────────────────────────────────────────────────
const createTask = async (req, res, next) => {
  try {
    const task = await Task.create(req.body);

    res.status(201).json({ success: true, data: task });
  } catch (err) {
    // Surface Mongoose validation errors as 400 with details
    if (err.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: extractValidationErrors(err),
      });
    }
    next(err);
  }
};

// ── PUT /api/tasks/:id ─────────────────────────────────────────────────────────
const updateTask = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!isValidId(id)) {
      return res.status(400).json({
        success: false,
        message: `Invalid task ID: ${id}`,
      });
    }

    const task = await Task.findByIdAndUpdate(
      id,
      req.body,
      {
        new: true,          // return the updated document
        runValidators: true, // enforce schema rules on update
      }
    );

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found',
      });
    }

    res.status(200).json({ success: true, data: task });
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: extractValidationErrors(err),
      });
    }
    next(err);
  }
};

// ── DELETE /api/tasks/:id ──────────────────────────────────────────────────────
const deleteTask = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!isValidId(id)) {
      return res.status(400).json({
        success: false,
        message: `Invalid task ID: ${id}`,
      });
    }

    const task = await Task.findByIdAndDelete(id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Task deleted successfully',
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getTasks,
  getTaskStats,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
};
