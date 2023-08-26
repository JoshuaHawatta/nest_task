import Role from '../../../enums/role.enum';
import { ReadonlyUser } from '../user.type';

class UserDto {
  public readonly _id?: string;
  public readonly name!: string;
  public readonly email!: string;
  public readonly permission!: Role;
  public readonly photo?: string;

  constructor(data: ReadonlyUser) {
    this.name = data.name;
    this.email = data.email;
    this.permission = data.permission;
    this.photo = data.photo;

    if (data._id) this._id = data._id;
  }
}

export default UserDto;
