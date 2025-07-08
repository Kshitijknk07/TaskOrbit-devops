import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { InternalServerErrorException } from '@nestjs/common';

const mockRedis = {
  hgetall: jest.fn(),
  hmset: jest.fn(),
  keys: jest.fn(),
  del: jest.fn(),
};

jest.mock('@nestjs-modules/ioredis', () => ({
  InjectRedis: () => () => {},
}));

describe('UserService', () => {
  let service: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserService, { provide: 'IORedis', useValue: mockRedis }],
    }).compile();
    service = module.get<UserService>(UserService);
    // @ts-ignore
    service.redis = mockRedis;
    jest.clearAllMocks();
  });

  it('should throw InternalServerErrorException on redis.hgetall error', async () => {
    mockRedis.hgetall.mockRejectedValueOnce(new Error('fail'));
    await expect(service.findByEmail('test@example.com')).rejects.toThrow(
      InternalServerErrorException,
    );
  });

  it('should throw InternalServerErrorException on redis.hmset error', async () => {
    mockRedis.hmset.mockRejectedValueOnce(new Error('fail'));
    await expect(
      service.create({ email: 'a', password: 'b', name: 'c' }),
    ).rejects.toThrow(InternalServerErrorException);
  });

  it('should throw InternalServerErrorException on redis.keys error', async () => {
    mockRedis.keys.mockRejectedValueOnce(new Error('fail'));
    await expect(service.findAll()).rejects.toThrow(
      InternalServerErrorException,
    );
  });

  it('should throw InternalServerErrorException on redis.del error', async () => {
    mockRedis.del.mockRejectedValueOnce(new Error('fail'));
    await expect(service.delete('test@example.com')).rejects.toThrow(
      InternalServerErrorException,
    );
  });

  it('should handle non-Error thrown values', async () => {
    mockRedis.hgetall.mockRejectedValueOnce('string error');
    await expect(service.findByEmail('test@example.com')).rejects.toThrow(
      InternalServerErrorException,
    );
  });
});
