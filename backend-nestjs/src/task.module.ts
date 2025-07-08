import { Module } from '@nestjs/common';
import { TaskService } from './task.service';
import { TaskController } from './task.controller';
import { TaskGateway } from './task.gateway';

@Module({
  providers: [TaskService, TaskGateway],
  controllers: [TaskController],
})
export class TaskModule {}
