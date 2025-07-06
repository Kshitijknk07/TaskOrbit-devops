const { validationResult } = require("express-validator");

const validateRequest = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: errors.array().map((error) => ({
        field: error.path,
        message: error.msg,
        value: error.value,
      })),
    });
  }

  next();
};

// Common validation rules
const commonValidations = {
  email: {
    in: ["body"],
    isEmail: {
      errorMessage: "Please provide a valid email address",
    },
    normalizeEmail: true,
  },

  password: {
    in: ["body"],
    isLength: {
      options: { min: 6, max: 100 },
      errorMessage: "Password must be at least 6 characters long",
    },
  },

  name: {
    in: ["body"],
    isLength: {
      options: { min: 2, max: 50 },
      errorMessage: "Name must be between 2 and 50 characters",
    },
    trim: true,
  },

  taskTitle: {
    in: ["body"],
    isLength: {
      options: { min: 1, max: 200 },
      errorMessage: "Task title must be between 1 and 200 characters",
    },
    trim: true,
  },

  taskDescription: {
    in: ["body"],
    optional: true,
    isLength: {
      options: { max: 1000 },
      errorMessage: "Task description must be less than 1000 characters",
    },
    trim: true,
  },

  taskStatus: {
    in: ["body"],
    optional: true,
    isIn: {
      options: [["pending", "in_progress", "completed", "cancelled"]],
      errorMessage:
        "Status must be one of: pending, in_progress, completed, cancelled",
    },
  },

  taskPriority: {
    in: ["body"],
    optional: true,
    isIn: {
      options: [["low", "medium", "high", "urgent"]],
      errorMessage: "Priority must be one of: low, medium, high, urgent",
    },
  },

  dueDate: {
    in: ["body"],
    optional: true,
    isISO8601: {
      errorMessage: "Due date must be a valid date",
    },
  },

  userId: {
    in: ["params", "body"],
    isUUID: {
      errorMessage: "User ID must be a valid UUID",
    },
  },

  taskId: {
    in: ["params"],
    isUUID: {
      errorMessage: "Task ID must be a valid UUID",
    },
  },
};

module.exports = {
  validateRequest,
  commonValidations,
};
