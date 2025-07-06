const { User, Task } = require("../models");
const bcrypt = require("bcryptjs");

const seedData = async () => {
  try {
    console.log("🌱 Starting database seeding...");

    // Create demo users
    const demoUsers = [
      {
        email: "admin@taskorbit.com",
        password: "admin123",
        name: "Admin User",
        role: "admin",
      },
      {
        email: "john@example.com",
        password: "john123",
        name: "John Doe",
        role: "user",
      },
      {
        email: "jane@example.com",
        password: "jane123",
        name: "Jane Smith",
        role: "user",
      },
    ];

    const createdUsers = [];
    for (const userData of demoUsers) {
      const existingUser = await User.findOne({
        where: { email: userData.email },
      });
      if (!existingUser) {
        const user = await User.create(userData);
        createdUsers.push(user);
        console.log(`✅ Created user: ${user.name} (${user.email})`);
      } else {
        createdUsers.push(existingUser);
        console.log(
          `ℹ️  User already exists: ${existingUser.name} (${existingUser.email})`
        );
      }
    }

    // Create demo tasks
    const demoTasks = [
      {
        title: "Setup TaskOrbit Infrastructure",
        description:
          "Set up the complete TaskOrbit development environment with Docker and Kubernetes",
        status: "in_progress",
        priority: "high",
        due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
        created_by: createdUsers[0].id,
        assignee_id: createdUsers[0].id,
        tags: ["infrastructure", "devops"],
        estimated_hours: 8.0,
      },
      {
        title: "Implement User Authentication",
        description:
          "Create secure JWT-based authentication system with user registration and login",
        status: "completed",
        priority: "medium",
        due_date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
        completed_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
        created_by: createdUsers[0].id,
        assignee_id: createdUsers[1].id,
        tags: ["authentication", "security"],
        estimated_hours: 6.0,
        actual_hours: 5.5,
      },
      {
        title: "Create Task Management API",
        description:
          "Build RESTful API endpoints for task CRUD operations with proper validation",
        status: "pending",
        priority: "high",
        due_date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
        created_by: createdUsers[0].id,
        assignee_id: createdUsers[2].id,
        tags: ["api", "backend"],
        estimated_hours: 10.0,
      },
      {
        title: "Design Frontend Dashboard",
        description:
          "Create responsive dashboard with task management interface using React",
        status: "pending",
        priority: "medium",
        due_date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
        created_by: createdUsers[1].id,
        assignee_id: createdUsers[1].id,
        tags: ["frontend", "ui"],
        estimated_hours: 12.0,
      },
      {
        title: "Setup Monitoring and Logging",
        description:
          "Implement Prometheus metrics and Grafana dashboards for system monitoring",
        status: "pending",
        priority: "low",
        due_date: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), // 10 days from now
        created_by: createdUsers[0].id,
        assignee_id: createdUsers[2].id,
        tags: ["monitoring", "devops"],
        estimated_hours: 4.0,
      },
    ];

    for (const taskData of demoTasks) {
      const existingTask = await Task.findOne({
        where: {
          title: taskData.title,
          created_by: taskData.created_by,
        },
      });

      if (!existingTask) {
        const task = await Task.create(taskData);
        console.log(`✅ Created task: ${task.title}`);
      } else {
        console.log(`ℹ️  Task already exists: ${existingTask.title}`);
      }
    }

    console.log("🎉 Database seeding completed successfully!");
    console.log(
      `📊 Created ${createdUsers.length} users and ${demoTasks.length} tasks`
    );
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    throw error;
  }
};

module.exports = { seedData };
