const express = require("express");
const { body, param, query } = require("express-validator");
const {
  validateRequest,
} = require("../middleware/validation/validationMiddleware");
const { authMiddleware } = require("../middleware/auth/authMiddleware");
const taskController = require("../controllers/taskController");

const router = express.Router();

// Apply authentication middleware to all task routes
router.use(authMiddleware);

// Create new task
router.post(
  "/",
  [
    body("title").isLength({ min: 1, max: 200 }).trim(),
    body("description").optional().isLength({ max: 1000 }).trim(),
    body("status")
      .optional()
      .isIn(["pending", "in_progress", "completed", "cancelled"]),
    body("priority").optional().isIn(["low", "medium", "high", "urgent"]),
    body("due_date").optional().isISO8601(),
    body("assignee_id").optional().isUUID(),
    body("tags").optional().isArray(),
    body("estimated_hours").optional().isFloat({ min: 0 }),
    validateRequest,
  ],
  taskController.createTask
);

// Get all tasks with filtering and pagination
router.get(
  "/",
  [
    query("page").optional().isInt({ min: 1 }),
    query("limit").optional().isInt({ min: 1, max: 100 }),
    query("status")
      .optional()
      .isIn(["pending", "in_progress", "completed", "cancelled"]),
    query("priority").optional().isIn(["low", "medium", "high", "urgent"]),
    query("assignee_id").optional().isUUID(),
    query("search").optional().isLength({ min: 1 }),
    query("due_date_from").optional().isISO8601(),
    query("due_date_to").optional().isISO8601(),
    validateRequest,
  ],
  taskController.getTasks
);

// Get task statistics
router.get("/stats", taskController.getTaskStats);

// Get task by ID
router.get(
  "/:taskId",
  [param("taskId").isUUID(), validateRequest],
  taskController.getTaskById
);

// Update task
router.put(
  "/:taskId",
  [
    param("taskId").isUUID(),
    body("title").optional().isLength({ min: 1, max: 200 }).trim(),
    body("description").optional().isLength({ max: 1000 }).trim(),
    body("status")
      .optional()
      .isIn(["pending", "in_progress", "completed", "cancelled"]),
    body("priority").optional().isIn(["low", "medium", "high", "urgent"]),
    body("due_date").optional().isISO8601(),
    body("assignee_id").optional().isUUID(),
    body("tags").optional().isArray(),
    body("estimated_hours").optional().isFloat({ min: 0 }),
    body("actual_hours").optional().isFloat({ min: 0 }),
    validateRequest,
  ],
  taskController.updateTask
);

// Assign task to user
router.put(
  "/:taskId/assign",
  [param("taskId").isUUID(), body("assignee_id").isUUID(), validateRequest],
  taskController.assignTask
);

// Delete task
router.delete(
  "/:taskId",
  [param("taskId").isUUID(), validateRequest],
  taskController.deleteTask
);

module.exports = router;
