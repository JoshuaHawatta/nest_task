import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import UserRepository from './user.repository';
import { User, UserDocument } from '../user.entity';
import SaveAccountDto from '../dtos/save-account.dto';
import convertStringToId from '../../../shared/helpers/convert-string-to-id.helper';

@Injectable()
class UserRepositoryImpl extends UserRepository {
  constructor(@InjectModel(User.name) private user: Model<UserDocument>) {
    super();
  }

  public async findAll(): Promise<User[]> {
    return await this.user.find();
  }

  public async findById(id: string): Promise<User> | null {
    const user = await this.user.findById(convertStringToId(id).at(0));

    return user ? user : null;
  }

  public async save(data: SaveAccountDto): Promise<User> {
    return await this.user.create(data);
  }

  public async update(data: SaveAccountDto): Promise<User> {
    return await this.user.findOneAndUpdate(
      { _id: convertStringToId(data._id).at(0) },
      data,
      { new: true },
    );
  }

  public async delete(id: string): Promise<void> {
    await this.user.findByIdAndDelete(convertStringToId(id).at(0));
  }

  public findByEmail(email: string): Promise<User> {
    return this.user.findOne({ email });
  }
}

export default UserRepositoryImpl;
