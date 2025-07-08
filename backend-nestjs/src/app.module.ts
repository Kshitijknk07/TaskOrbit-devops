import { Module } from '@nestjs/common';
import { UserModule } from './user.module';
import { AuthModule } from './auth.module';
import { RedisModule } from '@nestjs-modules/ioredis';
import { TaskModule } from './task.module';
import { AppController } from './app.controller';

@Module({
  imports: [
    RedisModule.forRoot({
      type: 'single',
      url: process.env.REDIS_URL || 'redis://localhost:6379',
    }),
    UserModule,
    AuthModule,
    TaskModule,
    // AuthModule will be added here
  ],
  controllers: [AppController],
})
export class AppModule {}
