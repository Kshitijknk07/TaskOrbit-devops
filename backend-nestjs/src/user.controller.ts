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
import { UserService } from './user.service';
import { User } from './user.entity';
import * as bcrypt from 'bcryptjs';
import { CreateUserDto, UpdateUserDto } from './user.dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async create(@Body() body: CreateUserDto): Promise<User> {
    const hash = await bcrypt.hash(body.password, 10);
    return this.userService.create({
      email: body.email,
      password: hash,
      name: body.name,
      role: body.role || 'user',
    });
  }

  @Get()
  async findAll(): Promise<User[]> {
    return this.userService.findAll();
  }

  @Get(':email')
  async findByEmail(@Param('email') email: string): Promise<User> {
    const user = await this.userService.findByEmail(email);
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  @Put(':email')
  async update(
    @Param('email') email: string,
    @Body() updates: UpdateUserDto,
  ): Promise<User> {
    const user = await this.userService.findByEmail(email);
    if (!user) throw new NotFoundException('User not found');
    let updated = { ...user, ...updates };
    if (updates.password) {
      updated.password = await bcrypt.hash(updates.password, 10);
    }
    await this.userService.create(updated);
    return updated;
  }

  @Delete(':email')
  async delete(@Param('email') email: string): Promise<{ deleted: boolean }> {
    const user = await this.userService.findByEmail(email);
    if (!user) throw new NotFoundException('User not found');
    await this.userService.delete(email);
    return { deleted: true };
  }
}
