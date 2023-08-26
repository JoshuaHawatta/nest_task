import UserDto from '../../../app/user/dtos/user.dto';
import Task from '../task.type';

class TaskDto {
  public readonly _id?: string;
  public readonly name!: string;
  public readonly responsibles!: UserDto[];
  public readonly createdBy!: string;
  public readonly deliverDate?: Date;

  constructor(data: Task, _id?: string) {
    this.name = data.name;
    this.responsibles = data.responsibles;
    this.deliverDate = data.deliverDate;
    this.createdBy = data.createdBy;

    if (_id) this._id = _id;
  }
}

export default TaskDto;
