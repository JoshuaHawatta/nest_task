import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import User from '../../app/user/user.type';
import TaskRepository from './repositories/task.repository';
import SaveTaskDto from './dtos/save-task.dto';
import UserRepository from '../../app/user/repositories/user.repository';
import TaskDto from './dtos/task.dto';
import UserDto from '../../app/user/dtos/user.dto';
import Exception from '../../enums/exception.enum';
import Role from '../../enums/role.enum';
import convertStringToId from '../../shared/helpers/convert-string-to-id.helper';

@Injectable()
class TaskService {
  constructor(
    private readonly repository: TaskRepository,
    private readonly userRepository: UserRepository,
  ) {}

  public async save(loggedUser: User, data: SaveTaskDto): Promise<TaskDto> {
    if (loggedUser.permission === Role.MEMBER)
      throw new HttpException(
        Exception.PERMISSION_DENIED,
        HttpStatus.UNAUTHORIZED,
      );

    const responsibles = await Promise.all(
      convertStringToId(...(data.responsibles as string[])).map((id) =>
        this.userRepository.findById(id),
      ),
    );

    if (responsibles.every((user) => user === null))
      throw new HttpException(
        'Informe ao menos um responsável',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );

    const newTask = await this.repository.save({
      ...data,
      createdBy: loggedUser._id,
      responsibles: responsibles
        .filter((user) => user !== null)
        .map((user) => new UserDto(user) as User),
    });

    return new TaskDto(newTask, newTask.id);
  }

  public async findAll(loggedUser: User): Promise<TaskDto[]> {
    const userTasks = await this.repository.findAll();

    const readableTasks =
      loggedUser.permission === Role.ADMIN
        ? userTasks
        : userTasks.filter(({ responsibles }) =>
            responsibles.some(({ _id }) =>
              convertStringToId(_id).at(0).equals(loggedUser._id),
            ),
          );

    if (!readableTasks.length && loggedUser.permission === Role.MEMBER)
      throw new HttpException(
        Exception.PERMISSION_DENIED,
        HttpStatus.UNAUTHORIZED,
      );

    return readableTasks.map(
      ({ responsibles, name, deliverDate, id, createdBy }) =>
        new TaskDto(
          {
            name,
            deliverDate,
            createdBy,
            responsibles: responsibles.map(
              (user) => new UserDto(user),
            ) as User[],
          },
          id,
        ),
    );
  }

  public async findAllByCreatedBy(loggedUser: User): Promise<TaskDto[]> {
    const userTasks = await this.repository.findAllByCreatedBy(loggedUser);

    if (!userTasks.length && loggedUser.permission === Role.MEMBER)
      throw new HttpException(
        Exception.PERMISSION_DENIED,
        HttpStatus.UNAUTHORIZED,
      );

    return userTasks.map(
      ({ responsibles, name, deliverDate, id, createdBy }) =>
        new TaskDto(
          {
            name,
            deliverDate,
            createdBy,
            responsibles: responsibles.map(
              (user) => new UserDto(user),
            ) as User[],
          },
          id,
        ),
    );
  }

  public async findAllByResponsible(loggedUser: User): Promise<TaskDto[]> {
    const userTasks = await this.repository.findAllByResponsible(loggedUser);

    if (!userTasks.length && loggedUser.permission === Role.MEMBER)
      throw new HttpException(
        Exception.PERMISSION_DENIED,
        HttpStatus.UNAUTHORIZED,
      );

    return userTasks.map(
      ({ responsibles, name, deliverDate, id, createdBy }) =>
        new TaskDto(
          {
            name,
            deliverDate,
            createdBy,
            responsibles: responsibles.map(
              (user) => new UserDto(user),
            ) as User[],
          },
          id,
        ),
    );
  }

  public async findById(loggedUser: User, id: string): Promise<TaskDto> {
    const task = await this.repository.findById(id);

    if (!task)
      throw new HttpException(Exception.NOT_FOUND, HttpStatus.NOT_FOUND);
    else if (
      loggedUser.permission === Role.MEMBER &&
      !task.responsibles.some(({ _id }) =>
        convertStringToId(_id).at(0).equals(loggedUser._id),
      )
    )
      throw new HttpException(
        Exception.PERMISSION_DENIED,
        HttpStatus.UNAUTHORIZED,
      );

    return new TaskDto(
      {
        name: task.name,
        createdBy: task.createdBy,
        responsibles: task.responsibles.map(
          (user) => new UserDto(user),
        ) as User[],
        deliverDate: task.deliverDate,
      },
      task.id,
    );
  }

  public async update(
    loggedUser: User,
    id: string,
    data: SaveTaskDto,
  ): Promise<TaskDto> {
    const task = await this.repository.findById(id);
    const users = await Promise.all(
      (data.responsibles as string[]).map((id) =>
        this.userRepository.findById(id),
      ),
    );

    if (!task || task.deliverDate)
      throw new HttpException(Exception.NOT_FOUND, HttpStatus.NOT_FOUND);
    else if (
      loggedUser.permission === Role.MEMBER &&
      !task.responsibles.some(({ _id }) =>
        convertStringToId(_id).at(0).equals(loggedUser._id),
      )
    )
      throw new HttpException(
        Exception.PERMISSION_DENIED,
        HttpStatus.UNAUTHORIZED,
      );

    const updatedTask = {
      _id: task.id,
      name: data.name,
      createdBy: task.createdBy,
      responsibles: users
        .filter((user) => user !== null)
        .map((user) => new UserDto(user)) as User[],
      deliverDate: data.deliverDate,
    } as const;

    await this.repository.update(updatedTask);

    return new TaskDto(updatedTask, updatedTask._id);
  }

  public async delete(loggedUser: User, id: string): Promise<void> {
    const task = await this.repository.findById(id);

    if (!task)
      throw new HttpException(Exception.NOT_FOUND, HttpStatus.NOT_FOUND);
    else if (
      loggedUser.permission === Role.MEMBER &&
      !task.responsibles.some(({ _id }) =>
        convertStringToId(_id).at(0).equals(loggedUser._id),
      )
    )
      throw new HttpException(
        Exception.PERMISSION_DENIED,
        HttpStatus.UNAUTHORIZED,
      );

    await this.repository.delete(task.id);
  }
}

export default TaskService;
