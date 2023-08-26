import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import UserRepository from './repositories/user.repository';
import UserRepositoryImpl from './repositories/user.repository.impl';
import { User, UserSchema } from './user.entity';
import UserController from './user.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [UserController],
  providers: [{ provide: UserRepository, useClass: UserRepositoryImpl }],
  exports: [{ provide: UserRepository, useClass: UserRepositoryImpl }],
})
export class UserModule {}
