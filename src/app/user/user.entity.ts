import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import Role from '../../enums/role.enum';

type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
class User {
  @Prop()
  name: string;

  @Prop()
  email: string;

  @Prop()
  password: string;

  @Prop()
  permission: Role;

  @Prop()
  photo: string;
}

const UserSchema = SchemaFactory.createForClass(User);

export { User, UserDocument, UserSchema };
