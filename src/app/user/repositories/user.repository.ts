import { Injectable } from '@nestjs/common';
import User from '../user.type';
import CrudRepository from '../../../shared/repositories/Crud.repository';

@Injectable()
abstract class UserRepository extends CrudRepository<User> {
  public abstract findByEmail(email: string): Promise<User>;
}

export default UserRepository;
