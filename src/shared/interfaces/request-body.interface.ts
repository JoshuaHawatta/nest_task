import User from '../../app/user/user.type';

interface RequestBody {
  user?: User;
  body?: {
    permission?: string;
  };
}

export default RequestBody;
