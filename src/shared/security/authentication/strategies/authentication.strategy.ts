import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import AuthenticationService from '../authentication.service';
import UserDto from '../../../../app/user/dtos/user.dto';
import RequestBody from '../../../interfaces/request-body.interface';

@Injectable()
class AuthenticationStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authenticationService: AuthenticationService) {
    super({
      usernameField: 'email',
      passwordField: 'password',
      passReqToCallback: true,
    });
  }

  public async validate(
    { body }: RequestBody,
    email: string,
    password: string,
  ): Promise<UserDto> {
    const user = await this.authenticationService.login(
      email,
      password,
      body.permission,
    );

    if (!user)
      throw new HttpException(
        'E-mail ou senha inválidos, tente novamente.',
        HttpStatus.UNAUTHORIZED,
      );

    return new UserDto(user);
  }
}

export default AuthenticationStrategy;
