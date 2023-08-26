import {
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import Exception from '../../../enums/exception.enum';
import User from '../../../app/user/user.type';

class SaveTaskDto {
  public _id?: string;

  @IsString({ message: Exception.INVALID_FIELD })
  @IsNotEmpty({ message: Exception.REQUIRED_FIELD })
  public name!: string;

  @IsNotEmpty({ message: 'Informe os responsáveis para essa tarefa.' })
  public responsibles!: User[] | string[];

  @IsOptional({ message: Exception.INVALID_FIELD })
  @IsDateString()
  public deliverDate?: Date;

  constructor(props: Omit<SaveTaskDto, '_id'>, _id?: string) {
    Object.assign(this, props);

    if (_id) this._id = _id;
  }
}

export default SaveTaskDto;
