import { Test, TestingModule } from '@nestjs/testing';
import TaskService from './task.service';
import TaskController from './task.controller';
import TaskDto from './dtos/task.dto';
import SaveTaskDto from './dtos/save-task.dto';
import Role from '../../enums/role.enum';
import Exception from '../../enums/exception.enum';
import CompanyRepository from '../company/repositories/company.repository';

const fakeUser = {
  _id: '12345678',
  name: 'fake123',
  email: 'fake@email.com',
  password: 'f4k_3',
  permission: Role.ADMIN,
} as const;

const fakeMemberUser = {
  ...fakeUser,
  permission: Role.MEMBER,
} as const;

const fakeRequestBody = { user: fakeUser } as const;

const fakeTask = {
  _id: '1234',
  name: 'Tarefa 1',
  responsibles: [fakeUser],
  createdBy: '12345678',
};

const fakeTaskList = [
  new TaskDto(fakeTask, fakeTask._id),
  new TaskDto({ id: '123456', name: 'tarefa 2', ...fakeTask }, '123456'),
  new TaskDto(
    { id: '123457', name: 'tarefa 3', ...fakeTask, responsibles: [] },
    '1234567',
  ),
] as const;

describe('AuthenticationController', () => {
  let taskController: TaskController;
  let taskService: TaskService;
  let companyRepository: CompanyRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TaskController],
      providers: [
        {
          provide: TaskService,
          useValue: {
            save: jest
              .fn()
              .mockResolvedValue(new SaveTaskDto(fakeTask, fakeTask._id)),
            findAll: jest.fn().mockResolvedValue(fakeTaskList),
            findAllByCreatedBy: jest.fn().mockResolvedValue(fakeTaskList),
            findAllByResponsible: jest.fn().mockResolvedValue(fakeTaskList),
            findById: jest
              .fn()
              .mockResolvedValue(new TaskDto(fakeTask, fakeTask._id)),
            update: jest
              .fn()
              .mockResolvedValue(
                new TaskDto({ ...fakeTask, name: 'tarefa 42' }, fakeTask._id),
              ),
            delete: jest.fn().mockResolvedValue(undefined),
          },
        },
        {
          provide: CompanyRepository,
          useValue: {
            ensureCompanyExists: jest.fn(),
            update: jest.fn(),
          },
        },
      ],
    }).compile();

    taskController = module.get<TaskController>(TaskController);
    taskService = module.get<TaskService>(TaskService);
    companyRepository = module.get<CompanyRepository>(CompanyRepository);
  });

  it('task controller, task service and company repository should be defined', () => {
    expect(taskController).toBeDefined();
    expect(taskService).toBeDefined();
    expect(companyRepository).toBeDefined();
  });

  describe('POST /task', () => {
    it('should create a new task when it succeeds', async () => {
      const result = await taskController.save(
        fakeRequestBody,
        new SaveTaskDto(fakeTask),
      );

      expect(result).toEqual(new TaskDto(fakeTask, fakeTask._id));
      expect(taskService.save).toBeCalledTimes(1);
      expect(companyRepository.update).toBeCalledTimes(1);
    });

    it('should throw an exception when it fails', async () => {
      jest.spyOn(taskService, 'save').mockRejectedValueOnce(new Error());

      expect(
        taskController.save(fakeRequestBody, fakeTask),
      ).rejects.toThrowError();

      expect(taskService.save).toBeCalledTimes(1);
    });
  });

  describe('GET /task', () => {
    it('should return a list of task DTOs when it succeeds', async () => {
      const result = await taskController.findAll(fakeRequestBody);

      expect(result).toEqual(fakeTaskList);
      expect(taskService.findAll).toBeCalledTimes(1);
    });

    it("should return an empty list when there's no registers and the user is an admin", async () => {
      jest.spyOn(taskService, 'findAll').mockResolvedValueOnce([]);

      const result = await taskController.findAll(fakeRequestBody);

      expect(result).toEqual([]);
      expect(taskService.findAll).toBeCalledTimes(1);
    });

    it('should throw an exception when the task list is empty list and the user is not an admin', async () => {
      jest.spyOn(taskService, 'findAll').mockImplementationOnce(async () => {
        if (fakeMemberUser.permission === Role.MEMBER)
          throw new Error(Exception.PERMISSION_DENIED);

        return await Promise.all([]);
      });

      try {
        await taskController.findAll({ user: { ...fakeMemberUser } });
      } catch (error) {
        expect(error.message).toBe(Exception.PERMISSION_DENIED);
        expect(taskService.findAll).toBeCalledTimes(1);
      }
    });
  });

  describe('GET /task/by-me', () => {
    it('should return a list of task DTOs that the user created when it succeeds', async () => {
      const result = await taskController.findAllByCreatedBy(fakeRequestBody);

      expect(result).toEqual(fakeTaskList);
      expect(taskService.findAllByCreatedBy).toBeCalledTimes(1);
    });

    it("should return an empty list when there's no registers and the user is an admin", async () => {
      jest.spyOn(taskService, 'findAllByCreatedBy').mockResolvedValueOnce([]);

      const result = await taskController.findAllByCreatedBy(fakeRequestBody);

      expect(result).toEqual([]);
      expect(taskService.findAllByCreatedBy).toBeCalledTimes(1);
    });

    it('should throw an exception when the task list is empty list and the user is not an admin', async () => {
      jest
        .spyOn(taskService, 'findAllByCreatedBy')
        .mockImplementationOnce(async () => {
          if (fakeMemberUser.permission === Role.MEMBER)
            throw new Error(Exception.PERMISSION_DENIED);

          return await Promise.all([]);
        });

      try {
        await taskController.findAllByCreatedBy({
          user: { ...fakeMemberUser },
        });
      } catch (error) {
        expect(error.message).toBe(Exception.PERMISSION_DENIED);
        expect(taskService.findAllByCreatedBy).toBeCalledTimes(1);
      }
    });
  });

  describe('GET /task/by-responsible', () => {
    it('should return a list of task DTOs that the user is in the responsible array when it succeeds', async () => {
      const result = await taskController.findAllByResponsible(fakeRequestBody);

      expect(result).toEqual(fakeTaskList);
      expect(taskService.findAllByResponsible).toBeCalledTimes(1);
    });

    it('should return an empty list when the user is not responsible and is an admin', async () => {
      jest.spyOn(taskService, 'findAllByResponsible').mockResolvedValueOnce([]);

      const result = await taskController.findAllByResponsible(fakeRequestBody);

      expect(result).toEqual([]);
      expect(taskService.findAllByResponsible).toBeCalledTimes(1);
    });

    it('should throw an exception when the the user is not responsible and is not an admin', async () => {
      jest
        .spyOn(taskService, 'findAllByResponsible')
        .mockImplementationOnce(async () => {
          if (fakeMemberUser.permission === Role.MEMBER)
            throw new Error(Exception.PERMISSION_DENIED);

          return await Promise.all([]);
        });

      try {
        await taskController.findAllByResponsible({
          user: { ...fakeMemberUser },
        });
      } catch (error) {
        expect(error.message).toBe(Exception.PERMISSION_DENIED);
        expect(taskService.findAllByResponsible).toBeCalledTimes(1);
      }
    });
  });

  describe('GET /task/{:id}', () => {
    it('should return a task DTO when it succeeds', async () => {
      const result = await taskController.findById(
        fakeRequestBody,
        fakeTask._id,
      );

      expect(result).toEqual(new TaskDto(fakeTask, fakeTask._id));
      expect(taskService.findById).toBeCalledTimes(1);
    });

    it('should throw an exception when it fails', async () => {
      jest.spyOn(taskService, 'findById').mockRejectedValueOnce(new Error());

      expect(
        taskController.findById(fakeRequestBody, fakeTask._id),
      ).rejects.toThrowError();

      expect(taskService.findById).toBeCalledTimes(1);
    });
  });

  describe('PATCH /task/{:id}', () => {
    it("should update a task and return it's DTO when it succeeds", async () => {
      const result = await taskController.update(
        fakeRequestBody,
        fakeTask._id,
        new SaveTaskDto(fakeTask, fakeTask._id),
      );

      expect(result).toEqual(
        new TaskDto({ ...fakeTask, name: 'tarefa 42' }, fakeTask._id),
      );

      expect(taskService.update).toBeCalledTimes(1);
    });

    it('should throw an exception when it fails', async () => {
      jest.spyOn(taskService, 'update').mockRejectedValueOnce(new Error());

      expect(
        taskController.update(
          fakeRequestBody,
          fakeTask._id,
          new SaveTaskDto(fakeTask),
        ),
      ).rejects.toThrowError();

      expect(taskService.update).toBeCalledTimes(1);
    });
  });

  describe('DELETE /task/{:id}', () => {
    it('should delete a task when it succeeds', async () => {
      const result = await taskController.delete(fakeRequestBody, fakeTask._id);

      expect(result).toEqual({ message: 'Tarefa deletada com sucesso!' });

      expect(taskService.delete).toBeCalledTimes(1);
    });

    it('should throw an exception when it fails', async () => {
      jest.spyOn(taskService, 'delete').mockRejectedValueOnce(new Error());

      expect(
        taskController.delete(fakeRequestBody, fakeTask._id),
      ).rejects.toThrowError();

      expect(taskService.delete).toBeCalledTimes(1);
    });
  });
});
