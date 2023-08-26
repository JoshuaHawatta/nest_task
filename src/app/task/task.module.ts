import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import TaskController from './task.controller';
import TaskService from './task.service';
import TaskRepository from './repositories/task.repository';
import TaskRepositoryImpl from './repositories/task.repository.impl';
import { Task, TaskSchema } from './task.entity';
import { UserModule } from '../../app/user/user.module';
import { CompanyModule } from '../company/company.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Task.name, schema: TaskSchema }]),
    UserModule,
    CompanyModule,
  ],
  controllers: [TaskController],
  providers: [
    TaskService,
    {
      provide: TaskRepository,
      useClass: TaskRepositoryImpl,
    },
  ],
  exports: [],
})
export class TaskModule {}
