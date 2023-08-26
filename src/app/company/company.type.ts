import { Task } from '../task/task.entity';
import { User } from '../user/user.entity';

interface Company {
  name?: string;
  users: User[];
  tasks: Task[];
}

export default Company;
