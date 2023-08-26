import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import TaskDto from './dtos/task.dto';
import TaskService from './task.service';
import RequestBody from '../../shared/interfaces/request-body.interface';
import SaveTaskDto from './dtos/save-task.dto';
import CompanyRepository from '../company/repositories/company.repository';
import Task from './task.type';

@Controller('task')
@UseGuards(AuthGuard('jwt'))
class TaskController {
  constructor(
    private readonly service: TaskService,
    @Inject(CompanyRepository)
    private readonly companyRepository: CompanyRepository,
  ) {}

  @Post()
  public async save(
    @Req() { user }: RequestBody,
    @Body() data: SaveTaskDto,
  ): Promise<TaskDto> {
    const task = await this.service.save(user, data);

    await this.companyRepository.update({ tasks: [task as Task] });

    return task;
  }

  @Get()
  public async findAll(@Req() { user }: RequestBody): Promise<TaskDto[]> {
    return await this.service.findAll(user);
  }

  @Get('by-me')
  public async findAllByCreatedBy(
    @Req() { user }: RequestBody,
  ): Promise<TaskDto[]> {
    return await this.service.findAllByCreatedBy(user);
  }

  @Get('by-responsible')
  public async findAllByResponsible(
    @Req() { user }: RequestBody,
  ): Promise<TaskDto[]> {
    return await this.service.findAllByResponsible(user);
  }

  @Get(':id')
  public async findById(
    @Req() { user }: RequestBody,
    @Param() id: string,
  ): Promise<TaskDto> {
    return await this.service.findById(user, id);
  }

  @Patch(':id')
  public async update(
    @Req() { user }: RequestBody,
    @Param() id: string,
    @Body() data: SaveTaskDto,
  ): Promise<TaskDto> {
    return await this.service.update(user, id, data);
  }

  @Delete(':id')
  public async delete(
    @Req() { user }: RequestBody,
    @Param() id: string,
  ): Promise<{ message: string }> {
    await this.service.delete(user, id);

    return { message: 'Tarefa deletada com sucesso!' };
  }
}

export default TaskController;
