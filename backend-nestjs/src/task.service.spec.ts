import { Test, TestingModule } from '@nestjs/testing';
import { TaskService } from './task.service';
import {
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

class MockRedis {
  hgetall = jest.fn();
  hmset = jest.fn();
  smembers = jest.fn();
  sadd = jest.fn();
  srem = jest.fn();
  del = jest.fn();
}

describe('TaskService', () => {
  let service: TaskService;
  let redisMock: MockRedis;

  beforeEach(async () => {
    redisMock = new MockRedis();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TaskService,
        {
          provide: 'default_IORedisModuleConnectionToken',
          useValue: redisMock,
        },
      ],
    }).compile();

    service = module.get<TaskService>(TaskService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create()', () => {
    it('should throw InternalServerErrorException on redis.hmset error', async () => {
      redisMock.hmset.mockRejectedValueOnce(new Error('fail'));
      await expect(service.create({ title: 'a' })).rejects.toThrow(
        InternalServerErrorException,
      );
    });

    it('should throw InternalServerErrorException on redis.sadd error', async () => {
      redisMock.hmset.mockResolvedValueOnce(undefined);
      redisMock.sadd.mockRejectedValueOnce(new Error('fail'));
      await expect(service.create({ title: 'a' })).rejects.toThrow(
        InternalServerErrorException,
      );
    });

    it('should handle non-Error thrown values', async () => {
      redisMock.hmset.mockRejectedValueOnce('string error');
      await expect(service.create({ title: 'a' })).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('findAll()', () => {
    it('should throw InternalServerErrorException on redis.smembers error', async () => {
      redisMock.smembers.mockRejectedValueOnce(new Error('fail'));
      await expect(service.findAll()).rejects.toThrow(
        InternalServerErrorException,
      );
    });

    it('should throw InternalServerErrorException on redis.hgetall error', async () => {
      redisMock.smembers.mockResolvedValueOnce(['1']);
      redisMock.hgetall.mockRejectedValueOnce(new Error('fail'));
      await expect(service.findAll()).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('findById()', () => {
    it('should throw NotFoundException if task not found', async () => {
      redisMock.hgetall.mockResolvedValueOnce({});
      await expect(service.findById('1')).rejects.toThrow(NotFoundException);
    });

    it('should throw InternalServerErrorException on redis.hgetall error', async () => {
      redisMock.hgetall.mockRejectedValueOnce(new Error('fail'));
      await expect(service.findById('1')).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('update()', () => {
    it('should throw InternalServerErrorException on redis.hmset error', async () => {
      redisMock.hgetall.mockResolvedValueOnce({ id: '1', title: 'a' });
      redisMock.hmset.mockRejectedValueOnce(new Error('fail'));
      await expect(service.update('1', { title: 'b' })).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('delete()', () => {
    it('should throw InternalServerErrorException on redis.del error', async () => {
      redisMock.del.mockRejectedValueOnce(new Error('fail'));
      await expect(service.delete('1')).rejects.toThrow(
        InternalServerErrorException,
      );
    });

    it('should throw InternalServerErrorException on redis.srem error', async () => {
      redisMock.del.mockResolvedValueOnce(undefined);
      redisMock.srem.mockRejectedValueOnce(new Error('fail'));
      await expect(service.delete('1')).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });
});
