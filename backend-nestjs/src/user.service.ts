import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRedis } from '@nestjs-modules/ioredis';
import type Redis from 'ioredis';
import { v4 as uuidv4 } from 'uuid';
import { User } from './user.entity';

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
export class UserService {
  constructor(@InjectRedis() private readonly redis: Redis) {}

  async findByEmail(email: string): Promise<User | undefined> {
    try {
      const data = await this.redis.hgetall(`user:${email}`);
      if (!data || !data.email) return undefined;

      return {
        id: data.id,
        email: data.email,
        password: data.password,
        name: data.name,
        role: data.role,
      };
    } catch (err: unknown) {
      throw new InternalServerErrorException(
        err instanceof Error
          ? err.message
          : typeof err === 'string'
            ? err
            : JSON.stringify(err),
      );
    }
  }

  async create(user: Partial<User>): Promise<User> {
    try {
      const id = uuidv4();
      const newUser: User = {
        id,
        email: user.email!,
        password: user.password!,
        name: user.name!,
        role: user.role ?? 'user',
      };

      await this.redis.hmset(`user:${newUser.email}`, toRedisHash(newUser));
      return newUser;
    } catch (err: unknown) {
      throw new InternalServerErrorException(
        err instanceof Error
          ? err.message
          : typeof err === 'string'
            ? err
            : JSON.stringify(err),
      );
    }
  }

  async findAll(): Promise<User[]> {
    try {
      const keys = await this.redis.keys('user:*');
      const users: User[] = [];

      for (const key of keys) {
        const data = await this.redis.hgetall(key);
        if (data?.email) {
          users.push({
            id: data.id,
            email: data.email,
            password: data.password,
            name: data.name,
            role: data.role,
          });
        }
      }

      return users;
    } catch (err: unknown) {
      throw new InternalServerErrorException(
        err instanceof Error
          ? err.message
          : typeof err === 'string'
            ? err
            : JSON.stringify(err),
      );
    }
  }

  async delete(email: string): Promise<void> {
    try {
      await this.redis.del(`user:${email}`);
    } catch (err: unknown) {
      throw new InternalServerErrorException(
        err instanceof Error
          ? err.message
          : typeof err === 'string'
            ? err
            : JSON.stringify(err),
      );
    }
  }
}
