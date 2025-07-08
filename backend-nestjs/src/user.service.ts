import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRedis } from '@nestjs-modules/ioredis';
import type Redis from 'ioredis';
import { User } from './user.entity';
import { v4 as uuidv4 } from 'uuid';

function toRedisHash(obj: Record<string, any>): Record<string, string> {
  const hash: Record<string, string> = {};
  for (const key in obj) {
    if (obj[key] !== undefined && obj[key] !== null) {
      hash[key] = String(obj[key]);
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
      if (
        !data ||
        typeof data !== 'object' ||
        data instanceof Error ||
        !data.email
      )
        return undefined;
      const user: User = {
        id: data.id,
        email: data.email,
        password: data.password,
        name: data.name,
        role: data.role,
      };
      return user;
    } catch (err: unknown) {
      if (err instanceof Error) {
        throw new InternalServerErrorException(err.message);
      } else {
        throw new InternalServerErrorException('Unexpected error');
      }
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
        role: user.role || 'user',
      };
      await this.redis.hmset(`user:${newUser.email}`, toRedisHash(newUser));
      return newUser;
    } catch (err: unknown) {
      if (err instanceof Error) {
        throw new InternalServerErrorException(err.message);
      } else {
        throw new InternalServerErrorException('Unexpected error');
      }
    }
  }

  async findAll(): Promise<User[]> {
    try {
      const keys = await this.redis.keys('user:*');
      const users: User[] = [];
      for (const key of keys) {
        const data = await this.redis.hgetall(key);
        if (
          data &&
          typeof data === 'object' &&
          !(data instanceof Error) &&
          data.email
        ) {
          const user: User = {
            id: data.id,
            email: data.email,
            password: data.password,
            name: data.name,
            role: data.role,
          };
          users.push(user);
        }
      }
      return users;
    } catch (err: unknown) {
      if (err instanceof Error) {
        throw new InternalServerErrorException(err.message);
      } else {
        throw new InternalServerErrorException('Unexpected error');
      }
    }
  }

  async delete(email: string): Promise<void> {
    try {
      await this.redis.del(`user:${email}`);
    } catch (err: unknown) {
      if (err instanceof Error) {
        throw new InternalServerErrorException(err.message);
      } else {
        throw new InternalServerErrorException('Unexpected error');
      }
    }
  }
}
