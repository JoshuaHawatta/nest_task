import Task from '../../task/task.type';
import User from '../../user/user.type';

class UpdateCompanyDto {
  public _id?: string;
  public users?: User[];
  public tasks?: Task[];
}

export default UpdateCompanyDto;
