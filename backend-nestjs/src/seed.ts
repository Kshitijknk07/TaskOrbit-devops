import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { UserService } from './user.service';
import * as bcrypt from 'bcryptjs';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const userService = app.get(UserService);

  const demoUsers = [
    {
      email: 'admin@taskorbit.com',
      password: 'admin123',
      name: 'Admin User',
      role: 'admin',
    },
    {
      email: 'john@example.com',
      password: 'john123',
      name: 'John Doe',
      role: 'user',
    },
    {
      email: 'jane@example.com',
      password: 'jane123',
      name: 'Jane Smith',
      role: 'user',
    },
  ];

  for (const user of demoUsers) {
    const exists = await userService.findByEmail(user.email);
    if (!exists) {
      const hash = await bcrypt.hash(user.password, 10);
      await userService.create({ ...user, password: hash });
      console.log(`Seeded user: ${user.email}`);
    }
  }
  await app.close();
}

bootstrap();
