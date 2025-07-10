import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaskService } from './task.service';
import { TaskController } from './task.controller';
import { TaskGateway } from './task.gateway';
import { UserModule } from './user.module';
import { Task } from './task.entity';

@Module({
  imports: [UserModule, TypeOrmModule.forFeature([Task])],
  providers: [TaskService, TaskGateway],
  controllers: [TaskController],
})
export class TaskModule {}
