const taskService = require("../services/task/taskService");

class TaskController {
  // Create new task
  async createTask(req, res, next) {
    try {
      const result = await taskService.createTask(req.body, req.user.id);

      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  }

  // Get all tasks with filtering
  async getTasks(req, res, next) {
    try {
      const {
        page = 1,
        limit = 10,
        status,
        priority,
        assignee_id,
        search,
        due_date_from,
        due_date_to,
      } = req.query;

      const filters = {
        status,
        priority,
        assignee_id,
        search,
        due_date_from,
        due_date_to,
      };

      const result = await taskService.getTasks(
        req.user.id,
        filters,
        parseInt(page),
        parseInt(limit)
      );

      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  // Get task by ID
  async getTaskById(req, res, next) {
    try {
      const { taskId } = req.params;

      const result = await taskService.getTaskById(taskId, req.user.id);

      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  // Update task
  async updateTask(req, res, next) {
    try {
      const { taskId } = req.params;

      const result = await taskService.updateTask(
        taskId,
        req.body,
        req.user.id
      );

      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  // Delete task
  async deleteTask(req, res, next) {
    try {
      const { taskId } = req.params;

      const result = await taskService.deleteTask(taskId, req.user.id);

      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  // Get task statistics
  async getTaskStats(req, res, next) {
    try {
      const result = await taskService.getTaskStats(req.user.id);

      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  // Assign task to user
  async assignTask(req, res, next) {
    try {
      const { taskId } = req.params;
      const { assignee_id } = req.body;

      const result = await taskService.assignTask(
        taskId,
        assignee_id,
        req.user.id
      );

      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new TaskController();
