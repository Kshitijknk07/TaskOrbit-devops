import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { InternalServerErrorException } from '@nestjs/common';

class MockRedis {
  hgetall = jest.fn();
  hmset = jest.fn();
  keys = jest.fn();
  del = jest.fn();
}

describe('UserService', () => {
  let service: UserService;
  let redisMock: MockRedis;

  beforeEach(async () => {
    redisMock = new MockRedis();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: 'default_IORedisModuleConnectionToken',
          useValue: redisMock,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findByEmail()', () => {
    it('should throw InternalServerErrorException on redis.hgetall error', async () => {
      redisMock.hgetall.mockRejectedValueOnce(new Error('fail'));
      await expect(service.findByEmail('test@example.com')).rejects.toThrow(
        InternalServerErrorException,
      );
    });

    it('should handle non-Error thrown values', async () => {
      redisMock.hgetall.mockRejectedValueOnce('string error');
      await expect(service.findByEmail('test@example.com')).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('create()', () => {
    it('should throw InternalServerErrorException on redis.hmset error', async () => {
      redisMock.hmset.mockRejectedValueOnce(new Error('fail'));
      await expect(
        service.create({ email: 'a', password: 'b', name: 'c' }),
      ).rejects.toThrow(InternalServerErrorException);
    });
  });

  describe('findAll()', () => {
    it('should throw InternalServerErrorException on redis.keys error', async () => {
      redisMock.keys.mockRejectedValueOnce(new Error('fail'));
      await expect(service.findAll()).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('delete()', () => {
    it('should throw InternalServerErrorException on redis.del error', async () => {
      redisMock.del.mockRejectedValueOnce(new Error('fail'));
      await expect(service.delete('test@example.com')).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });
});
