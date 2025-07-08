import { Test, TestingModule } from '@nestjs/testing';
import { TaskService } from './task.service';
import {
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

const mockRedis = {
  hgetall: jest.fn(),
  hmset: jest.fn(),
  smembers: jest.fn(),
  sadd: jest.fn(),
  srem: jest.fn(),
  del: jest.fn(),
};

jest.mock('@nestjs-modules/ioredis', () => ({
  InjectRedis: () => () => {},
}));

describe('TaskService', () => {
  let service: TaskService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TaskService, { provide: 'IORedis', useValue: mockRedis }],
    }).compile();
    service = module.get<TaskService>(TaskService);
    // @ts-ignore
    service.redis = mockRedis;
    jest.clearAllMocks();
  });

  it('should throw InternalServerErrorException on redis.hmset error', async () => {
    mockRedis.hmset.mockRejectedValueOnce(new Error('fail'));
    await expect(service.create({ title: 'a' })).rejects.toThrow(
      InternalServerErrorException,
    );
  });

  it('should throw InternalServerErrorException on redis.sadd error', async () => {
    mockRedis.hmset.mockResolvedValueOnce(undefined);
    mockRedis.sadd.mockRejectedValueOnce(new Error('fail'));
    await expect(service.create({ title: 'a' })).rejects.toThrow(
      InternalServerErrorException,
    );
  });

  it('should throw InternalServerErrorException on redis.smembers error', async () => {
    mockRedis.smembers.mockRejectedValueOnce(new Error('fail'));
    await expect(service.findAll()).rejects.toThrow(
      InternalServerErrorException,
    );
  });

  it('should throw InternalServerErrorException on redis.hgetall error in findAll', async () => {
    mockRedis.smembers.mockResolvedValueOnce(['1']);
    mockRedis.hgetall.mockRejectedValueOnce(new Error('fail'));
    await expect(service.findAll()).rejects.toThrow(
      InternalServerErrorException,
    );
  });

  it('should throw NotFoundException if task not found', async () => {
    mockRedis.hgetall.mockResolvedValueOnce({});
    await expect(service.findById('1')).rejects.toThrow(NotFoundException);
  });

  it('should throw InternalServerErrorException on redis.hgetall error in findById', async () => {
    mockRedis.hgetall.mockRejectedValueOnce(new Error('fail'));
    await expect(service.findById('1')).rejects.toThrow(
      InternalServerErrorException,
    );
  });

  it('should throw InternalServerErrorException on redis.hmset error in update', async () => {
    mockRedis.hgetall.mockResolvedValueOnce({ id: '1', title: 'a' });
    mockRedis.hmset.mockRejectedValueOnce(new Error('fail'));
    await expect(service.update('1', { title: 'b' })).rejects.toThrow(
      InternalServerErrorException,
    );
  });

  it('should throw InternalServerErrorException on redis.del error in delete', async () => {
    mockRedis.del.mockRejectedValueOnce(new Error('fail'));
    await expect(service.delete('1')).rejects.toThrow(
      InternalServerErrorException,
    );
  });

  it('should throw InternalServerErrorException on redis.srem error in delete', async () => {
    mockRedis.del.mockResolvedValueOnce(undefined);
    mockRedis.srem.mockRejectedValueOnce(new Error('fail'));
    await expect(service.delete('1')).rejects.toThrow(
      InternalServerErrorException,
    );
  });

  it('should handle non-Error thrown values', async () => {
    mockRedis.hmset.mockRejectedValueOnce('string error');
    await expect(service.create({ title: 'a' })).rejects.toThrow(
      InternalServerErrorException,
    );
  });
});
