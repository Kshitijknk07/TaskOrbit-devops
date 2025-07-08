import { IsString, IsOptional, IsIn, IsDateString } from 'class-validator';

export class CreateTaskDto {
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsIn(['pending', 'in_progress', 'completed'])
  status?: string;

  @IsOptional()
  @IsIn(['low', 'medium', 'high'])
  priority?: string;

  @IsOptional()
  @IsDateString()
  dueDate?: string;

  @IsOptional()
  @IsString()
  assignedTo?: string;
}

export class UpdateTaskDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsIn(['pending', 'in_progress', 'completed'])
  status?: string;

  @IsOptional()
  @IsIn(['low', 'medium', 'high'])
  priority?: string;

  @IsOptional()
  @IsDateString()
  dueDate?: string;

  @IsOptional()
  @IsString()
  assignedTo?: string;
}
