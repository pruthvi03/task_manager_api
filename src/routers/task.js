const express = require('express');
const router = new express.Router();
const auth = require('../middleware/auth');
const taskFunctions = require('../controller/taskController');

// Create task route
router.post('/tasks', auth, taskFunctions.createTask);

// Get user tasks 
// GET /tasks?completed=true
// GET /tasks?limit=10&skip=10
// GET /tasks?sortBy=createdAt:desc
router.get('/tasks', auth, taskFunctions.getTask);

// get tasks which are completed or not completed
router.get('/tasks/:completed', auth, taskFunctions.taskByStatus);

// get user's all tasks
router.patch("/tasks", auth, taskFunctions.userTasks);

// Delete the task by description
router.delete("/tasks/:task", auth, taskFunctions.deleteTaskByDecription);

module.exports = router;