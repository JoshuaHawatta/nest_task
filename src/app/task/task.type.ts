import User from '../../app/user/user.type';

export default interface Task {
  id?: string;
  name: string;
  responsibles: User[];
  createdBy: string;
  deliverDate?: Date;
}
