const User = require("./User");
const Task = require("./Task");

// Define associations
User.hasMany(Task, {
  foreignKey: "created_by",
  as: "createdTasks",
});

User.hasMany(Task, {
  foreignKey: "assignee_id",
  as: "assignedTasks",
});

Task.belongsTo(User, {
  foreignKey: "created_by",
  as: "creator",
});

Task.belongsTo(User, {
  foreignKey: "assignee_id",
  as: "assignee",
});

module.exports = {
  User,
  Task,
};
