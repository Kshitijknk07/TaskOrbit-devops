import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { UserService } from './user.service';
import { TaskService } from './task.service';
import * as bcrypt from 'bcryptjs';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const userService = app.get(UserService);
  const taskService = app.get(TaskService);

  // Seed users
  const demoUsers = [
    {
      email: 'admin@taskorbit.com',
      password: 'admin123',
      name: 'Admin User',
      role: 'admin',
    },
    {
      email: 'john@example.com',
      password: 'john123',
      name: 'John Doe',
      role: 'user',
    },
    {
      email: 'jane@example.com',
      password: 'jane123',
      name: 'Jane Smith',
      role: 'user',
    },
  ];

  for (const user of demoUsers) {
    const exists = await userService.findByEmail(user.email);
    if (!exists) {
      const hash = await bcrypt.hash(user.password, 10);
      await userService.create({ ...user, password: hash });
      console.log(`Seeded user: ${user.email}`);
    }
  }

  // Seed tasks
  const users = await userService.findAll();
  const john = users.find((u) => u.email === 'john@example.com');
  const jane = users.find((u) => u.email === 'jane@example.com');
  const admin = users.find((u) => u.email === 'admin@taskorbit.com');

  const demoTasks = [
    {
      title: 'Setup TaskOrbit Infrastructure',
      description: 'Provision Redis and backend services',
      status: 'in_progress',
      priority: 'high',
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      assignedTo: admin?.email || '',
    },
    {
      title: 'Implement User Authentication',
      description: 'Add JWT and bcrypt-based authentication',
      status: 'completed',
      priority: 'medium',
      dueDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      assignedTo: john?.email || '',
    },
    {
      title: 'Create Task Management API',
      description: 'CRUD endpoints for tasks',
      status: 'pending',
      priority: 'high',
      dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
      assignedTo: jane?.email || '',
    },
  ];

  for (const task of demoTasks) {
    const tasks = await taskService.findAll();
    if (!tasks.find((t) => t.title === task.title)) {
      await taskService.create({
        ...task,
        status: task.status as 'pending' | 'in_progress' | 'completed',
        priority: task.priority as 'low' | 'medium' | 'high',
      });
      console.log(`Seeded task: ${task.title}`);
    }
  }

  await app.close();
}

void bootstrap();
