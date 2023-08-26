import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import Exception from '../../../enums/exception.enum';
import Role from '../../../enums/role.enum';

class SaveAccountDto {
  public _id?: string;

  @IsString({ message: Exception.INVALID_FIELD })
  @MinLength(8, { message: Exception.REQUIRED_FIELD })
  public password!: string;

  @IsString({ message: Exception.INVALID_FIELD })
  @IsNotEmpty({ message: Exception.REQUIRED_FIELD })
  public name!: string;

  @IsString({ message: Exception.INVALID_FIELD })
  @IsEmail()
  @IsNotEmpty({ message: Exception.REQUIRED_FIELD })
  public email!: string;

  @IsString({ message: Exception.INVALID_FIELD })
  @IsNotEmpty({ message: Exception.REQUIRED_FIELD })
  public permission!: Role;

  constructor(props: Omit<SaveAccountDto, 'id'>, _id?: string) {
    Object.assign(this, props);

    if (_id) this._id = _id;
  }
}

export default SaveAccountDto;
