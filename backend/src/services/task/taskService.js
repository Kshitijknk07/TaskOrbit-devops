const { Task, User } = require("../../models");
const { Op } = require("sequelize");

class TaskService {
  // Create new task
  async createTask(taskData, userId) {
    try {
      const task = await Task.create({
        ...taskData,
        created_by: userId,
        assignee_id: taskData.assignee_id || userId,
      });

      // Fetch task with related data
      const createdTask = await Task.findByPk(task.id, {
        include: [
          { model: User, as: "creator", attributes: ["id", "name", "email"] },
          { model: User, as: "assignee", attributes: ["id", "name", "email"] },
        ],
      });

      return {
        success: true,
        data: createdTask,
        message: "Task created successfully",
      };
    } catch (error) {
      throw error;
    }
  }

  // Get all tasks with filtering and pagination
  async getTasks(userId, filters = {}, page = 1, limit = 10) {
    try {
      const offset = (page - 1) * limit;
      const whereClause = {};

      // Apply filters
      if (filters.status) {
        whereClause.status = filters.status;
      }

      if (filters.priority) {
        whereClause.priority = filters.priority;
      }

      if (filters.assignee_id) {
        whereClause.assignee_id = filters.assignee_id;
      }

      if (filters.search) {
        whereClause[Op.or] = [
          { title: { [Op.iLike]: `%${filters.search}%` } },
          { description: { [Op.iLike]: `%${filters.search}%` } },
        ];
      }

      // Date filters
      if (filters.due_date_from) {
        whereClause.due_date = {
          ...whereClause.due_date,
          [Op.gte]: new Date(filters.due_date_from),
        };
      }

      if (filters.due_date_to) {
        whereClause.due_date = {
          ...whereClause.due_date,
          [Op.lte]: new Date(filters.due_date_to),
        };
      }

      const { count, rows } = await Task.findAndCountAll({
        where: whereClause,
        include: [
          { model: User, as: "creator", attributes: ["id", "name", "email"] },
          { model: User, as: "assignee", attributes: ["id", "name", "email"] },
        ],
        order: [["created_at", "DESC"]],
        limit,
        offset,
      });

      return {
        success: true,
        data: {
          tasks: rows,
          pagination: {
            page,
            limit,
            total: count,
            totalPages: Math.ceil(count / limit),
          },
        },
        message: "Tasks retrieved successfully",
      };
    } catch (error) {
      throw error;
    }
  }

  // Get task by ID
  async getTaskById(taskId, userId) {
    try {
      const task = await Task.findByPk(taskId, {
        include: [
          { model: User, as: "creator", attributes: ["id", "name", "email"] },
          { model: User, as: "assignee", attributes: ["id", "name", "email"] },
        ],
      });

      if (!task) {
        throw new Error("Task not found");
      }

      return {
        success: true,
        data: task,
        message: "Task retrieved successfully",
      };
    } catch (error) {
      throw error;
    }
  }

  // Update task
  async updateTask(taskId, updateData, userId) {
    try {
      const task = await Task.findByPk(taskId);

      if (!task) {
        throw new Error("Task not found");
      }

      // Check if user can update this task
      if (task.created_by !== userId && task.assignee_id !== userId) {
        throw new Error(
          "You can only update tasks you created or are assigned to"
        );
      }

      await task.update(updateData);

      // Fetch updated task with related data
      const updatedTask = await Task.findByPk(taskId, {
        include: [
          { model: User, as: "creator", attributes: ["id", "name", "email"] },
          { model: User, as: "assignee", attributes: ["id", "name", "email"] },
        ],
      });

      return {
        success: true,
        data: updatedTask,
        message: "Task updated successfully",
      };
    } catch (error) {
      throw error;
    }
  }

  // Delete task
  async deleteTask(taskId, userId) {
    try {
      const task = await Task.findByPk(taskId);

      if (!task) {
        throw new Error("Task not found");
      }

      // Only creator can delete task
      if (task.created_by !== userId) {
        throw new Error("You can only delete tasks you created");
      }

      await task.destroy();

      return {
        success: true,
        message: "Task deleted successfully",
      };
    } catch (error) {
      throw error;
    }
  }

  // Get task statistics
  async getTaskStats(userId) {
    try {
      const stats = await Task.findAll({
        where: {
          [Op.or]: [{ created_by: userId }, { assignee_id: userId }],
        },
        attributes: [
          "status",
          "priority",
          [Task.sequelize.fn("COUNT", Task.sequelize.col("id")), "count"],
        ],
        group: ["status", "priority"],
      });

      const totalTasks = await Task.count({
        where: {
          [Op.or]: [{ created_by: userId }, { assignee_id: userId }],
        },
      });

      const completedTasks = await Task.count({
        where: {
          status: "completed",
          [Op.or]: [{ created_by: userId }, { assignee_id: userId }],
        },
      });

      return {
        success: true,
        data: {
          totalTasks,
          completedTasks,
          completionRate:
            totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0,
          stats,
        },
        message: "Task statistics retrieved successfully",
      };
    } catch (error) {
      throw error;
    }
  }

  // Assign task to user
  async assignTask(taskId, assigneeId, userId) {
    try {
      const task = await Task.findByPk(taskId);

      if (!task) {
        throw new Error("Task not found");
      }

      // Check if assignee exists
      const assignee = await User.findByPk(assigneeId);
      if (!assignee) {
        throw new Error("Assignee not found");
      }

      // Only creator can assign task
      if (task.created_by !== userId) {
        throw new Error("You can only assign tasks you created");
      }

      await task.update({ assignee_id: assigneeId });

      const updatedTask = await Task.findByPk(taskId, {
        include: [
          { model: User, as: "creator", attributes: ["id", "name", "email"] },
          { model: User, as: "assignee", attributes: ["id", "name", "email"] },
        ],
      });

      return {
        success: true,
        data: updatedTask,
        message: "Task assigned successfully",
      };
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new TaskService();
