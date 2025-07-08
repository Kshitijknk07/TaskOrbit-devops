import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRedis } from '@nestjs-modules/ioredis';
import Redis from 'ioredis';
import { Task } from './task.entity';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class TaskService {
  constructor(@InjectRedis() private readonly redis: Redis) {}

  async create(task: Partial<Task>): Promise<Task> {
    const id = uuidv4();
    const newTask: Task = {
      id,
      title: task.title!,
      description: task.description || '',
      status: task.status || 'pending',
      priority: task.priority || 'medium',
      dueDate: task.dueDate || '',
      assignedTo: task.assignedTo || '',
    };
    await this.redis.hmset(`task:${id}`, newTask);
    await this.redis.sadd('tasks', id);
    return newTask;
  }

  async findAll(): Promise<Task[]> {
    const ids = await this.redis.smembers('tasks');
    const tasks: Task[] = [];
    for (const id of ids) {
      const data = await this.redis.hgetall(`task:${id}`);
      if (data && data.id) {
        const task: Task = {
          id: data.id,
          title: data.title,
          description: data.description,
          status: data.status as Task['status'],
          priority: data.priority as Task['priority'],
          dueDate: data.dueDate,
          assignedTo: data.assignedTo,
        };
        tasks.push(task);
      }
    }
    return tasks;
  }

  async findById(id: string): Promise<Task> {
    const data = await this.redis.hgetall(`task:${id}`);
    if (!data || !data.id) throw new NotFoundException('Task not found');
    const task: Task = {
      id: data.id,
      title: data.title,
      description: data.description,
      status: data.status as Task['status'],
      priority: data.priority as Task['priority'],
      dueDate: data.dueDate,
      assignedTo: data.assignedTo,
    };
    return task;
  }

  async update(id: string, updates: Partial<Task>): Promise<Task> {
    const task = await this.findById(id);
    const updated: Task = { ...task, ...updates };
    await this.redis.hmset(`task:${id}`, updated);
    return updated;
  }

  async delete(id: string): Promise<void> {
    await this.redis.del(`task:${id}`);
    await this.redis.srem('tasks', id);
  }
}
