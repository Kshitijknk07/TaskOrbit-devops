import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Param,
  Body,
  NotFoundException,
} from '@nestjs/common';
import { TaskService } from './task.service';
import { Task } from './task.entity';
import { UserService } from './user.service';
import { TaskGateway } from './task.gateway';
import { CreateTaskDto, UpdateTaskDto } from './task.dto';

@Controller('tasks')
export class TaskController {
  constructor(
    private readonly taskService: TaskService,
    private readonly userService: UserService,
    private readonly taskGateway: TaskGateway,
  ) {}

  @Post()
  async create(@Body() body: CreateTaskDto): Promise<Task> {
    return this.taskService.create({
      ...body,
      status: body.status as
        | 'pending'
        | 'in_progress'
        | 'completed'
        | undefined,
      priority: body.priority as 'low' | 'medium' | 'high' | undefined,
    });
  }

  @Get()
  async findAll(): Promise<Task[]> {
    return this.taskService.findAll();
  }

  @Get(':id')
  async findById(@Param('id') id: string): Promise<any> {
    const task = await this.taskService.findById(id);
    let assignedUser = null;
    if (task.assignedTo) {
      assignedUser = await this.userService.findByEmail(task.assignedTo);
    }
    return { ...task, assignedUser };
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updates: UpdateTaskDto,
  ): Promise<Task> {
    const oldTask = await this.taskService.findById(id);
    const updated = await this.taskService.update(id, {
      ...updates,
      status: updates.status as
        | 'pending'
        | 'in_progress'
        | 'completed'
        | undefined,
      priority: updates.priority as 'low' | 'medium' | 'high' | undefined,
    });
    if (updates.status && updates.status !== oldTask.status) {
      this.taskGateway.emitTaskStatusChanged(updated);
    }
    return updated;
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<{ deleted: boolean }> {
    await this.taskService.delete(id);
    return { deleted: true };
  }

  @Put(':id/assign/:userId')
  async assign(
    @Param('id') id: string,
    @Param('userId') userId: string,
  ): Promise<Task> {
    const task = await this.taskService.findById(id);
    if (!task) throw new NotFoundException('Task not found');
    const updated = await this.taskService.update(id, { assignedTo: userId });
    this.taskGateway.emitTaskStatusChanged(updated);
    return updated;
  }
}
