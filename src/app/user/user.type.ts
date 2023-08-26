import Role from '../../enums/role.enum';

export default interface User {
  _id?: string;
  name: string;
  email: string;
  password: string;
  photo?: string;
  permission: Role;
}

export interface ReadonlyUser {
  readonly _id?: string;
  readonly name: string;
  readonly email: string;
  readonly photo?: string;
  readonly permission: Role;
}
