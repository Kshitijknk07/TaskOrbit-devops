import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { InjectRedis } from '@nestjs-modules/ioredis';
import Redis from 'ioredis';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    @InjectRedis() private readonly redis: Redis,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('health')
  async health() {
    try {
      await this.redis.ping();
      return { status: 'ok', redis: 'ok' };
    } catch {
      return { status: 'error', redis: 'unreachable' };
    }
  }
}
