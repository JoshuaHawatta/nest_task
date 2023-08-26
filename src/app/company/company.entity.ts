import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { User as UserImpl } from '../user/user.entity';
import User from '../user/user.type';
import Task from '../task/task.type';
import { Task as TaskImpl } from '../task/task.entity';

type CompanyDocument = HydratedDocument<Company>;

@Schema({ timestamps: true })
class Company {
  @Prop()
  name: string;

  @Prop([UserImpl])
  users: User[];

  @Prop([TaskImpl])
  tasks: Task[];
}

const CompanySchema = SchemaFactory.createForClass(Company);

export { Company, CompanyDocument, CompanySchema };
