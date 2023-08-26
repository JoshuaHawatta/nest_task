import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import TaskRepository from './task.repository';
import { Task, TaskDocument } from '../task.entity';
import SaveTaskDto from '../dtos/save-task.dto';
import convertStringToId from '../../../shared/helpers/convert-string-to-id.helper';
import User from '../../../app/user/user.type';
import { Injectable } from '@nestjs/common';

@Injectable()
class TaskRepositoryImpl extends TaskRepository {
  constructor(@InjectModel(Task.name) private task: Model<TaskDocument>) {
    super();
  }

  public async findAll(): Promise<Task[]> {
    return await this.task.find();
  }

  public async findAllByCreatedBy(user: User): Promise<Task[]> {
    return await this.task.find({ createdBy: { $eq: user._id } });
  }

  public async findAllByResponsible(user: User): Promise<Task[]> {
    return await this.task.find({ 'responsibles._id': user._id });
  }

  public async findById(id: string): Promise<Task> | null {
    const task = await this.task.findById(convertStringToId(id).at(0));

    return task ? task : null;
  }

  public async save(data: SaveTaskDto): Promise<Task> {
    return await this.task.create(data);
  }

  public async update(data: SaveTaskDto): Promise<Task> {
    return await this.task.findByIdAndUpdate(data._id, data, { new: true });
  }

  public async delete(id: string): Promise<void> {
    await this.task.findByIdAndDelete(convertStringToId(id).at(0));
  }
}

export default TaskRepositoryImpl;
