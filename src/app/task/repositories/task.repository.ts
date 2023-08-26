import CrudRepository from '../../../shared/repositories/Crud.repository';
import Task from '../task.type';
import User from '../../../app/user/user.type';
import { Injectable } from '@nestjs/common';

@Injectable()
abstract class TaskRepository extends CrudRepository<Task> {
  public abstract findAllByCreatedBy(user: User): Promise<Task[]>;
  public abstract findAllByResponsible(user: User): Promise<Task[]>;
}

export default TaskRepository;
