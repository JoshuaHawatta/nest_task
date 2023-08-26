import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { User as UserImpl } from '../../app/user/user.entity';
import User from '../../app/user/user.type';

type TaskDocument = HydratedDocument<Task>;

@Schema({ timestamps: true })
class Task {
  @Prop()
  name: string;

  @Prop([UserImpl])
  responsibles: User[];

  @Prop()
  createdBy: string;

  @Prop()
  deliverDate?: Date;
}

const TaskSchema = SchemaFactory.createForClass(Task);

export { Task, TaskDocument, TaskSchema };
