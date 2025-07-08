import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRedis } from '@nestjs-modules/ioredis';
import type Redis from 'ioredis';
import { v4 as uuidv4 } from 'uuid';
import { Task } from './task.entity';

function toRedisHash(obj: Record<string, unknown>): Record<string, string> {
  const hash: Record<string, string> = {};
  for (const key in obj) {
    const value = obj[key];
    if (value !== undefined && value !== null) {
      if (typeof value === 'object') {
        try {
          hash[key] = JSON.stringify(value);
        } catch {
          hash[key] = '';
        }
      } else if (
        typeof value === 'string' ||
        typeof value === 'number' ||
        typeof value === 'boolean' ||
        typeof value === 'bigint'
      ) {
        hash[key] = String(value);
      } else {
        hash[key] = '';
      }
    }
  }
  return hash;
}

@Injectable()
export class TaskService {
  constructor(@InjectRedis() private readonly redis: Redis) {}

  async create(task: Partial<Task>): Promise<Task> {
    try {
      const id = uuidv4();
      const newTask: Task = {
        id,
        title: task.title!,
        description: task.description ?? '',
        status: task.status ?? 'pending',
        priority: task.priority ?? 'medium',
        dueDate: task.dueDate ?? '',
        assignedTo: task.assignedTo ?? '',
      };

      await this.redis.hmset(`task:${id}`, toRedisHash(newTask));
      await this.redis.sadd('tasks', id);

      return newTask;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      throw new InternalServerErrorException(message);
    }
  }

  async findAll(): Promise<Task[]> {
    try {
      const ids = await this.redis.smembers('tasks');
      const tasks: Task[] = [];

      for (const id of ids) {
        const data = await this.redis.hgetall(`task:${id}`);
        if (data?.id) {
          tasks.push({
            id: data.id,
            title: data.title,
            description: data.description,
            status: data.status as Task['status'],
            priority: data.priority as Task['priority'],
            dueDate: data.dueDate,
            assignedTo: data.assignedTo,
          });
        }
      }

      return tasks;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      throw new InternalServerErrorException(message);
    }
  }

  async findById(id: string): Promise<Task> {
    try {
      const data = await this.redis.hgetall(`task:${id}`);
      if (!data?.id) {
        throw new NotFoundException('Task not found');
      }

      return {
        id: data.id,
        title: data.title,
        description: data.description,
        status: data.status as Task['status'],
        priority: data.priority as Task['priority'],
        dueDate: data.dueDate,
        assignedTo: data.assignedTo,
      };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      throw new InternalServerErrorException(message);
    }
  }

  async update(id: string, updates: Partial<Task>): Promise<Task> {
    try {
      const existingTask = await this.findById(id);
      const updatedTask: Task = { ...existingTask, ...updates };

      await this.redis.hmset(`task:${id}`, toRedisHash(updatedTask));
      return updatedTask;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      throw new InternalServerErrorException(message);
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await this.redis.del(`task:${id}`);
      await this.redis.srem('tasks', id);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      throw new InternalServerErrorException(message);
    }
  }
}
