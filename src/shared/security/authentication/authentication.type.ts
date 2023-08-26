import UserDto from '../../../app/user/dtos/user.dto';

interface AuthenticationResponse {
  token: string;
  user?: UserDto;
  message?: string;
}

export default AuthenticationResponse;
