import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compareSync, hashSync } from 'bcrypt';
import UserRepository from '../../../app/user/repositories/user.repository';
import UserDto from '../../../app/user/dtos/user.dto';
import User from '../../../app/user/user.type';
import SaveAccountDto from '../../../app/user/dtos/save-account.dto';
import Role from '../../../enums/role.enum';
import Exception from '../../../enums/exception.enum';

@Injectable()
class AuthenticationService {
  constructor(
    @Inject(UserRepository) private readonly userRepository: UserRepository,
    private readonly jwt: JwtService,
  ) {}

  public authenticate({ _id, email, permission }: User): string {
    return this.jwt.sign({ _id, email, permission } as const);
  }

  public async save(data: SaveAccountDto): Promise<UserDto> {
    const existingEmail = await this.userRepository.findByEmail(data.email);

    if (existingEmail)
      throw new HttpException(
        Exception.EXISTING_EMAIL,
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    else if (![Role.MEMBER, Role.ADMIN].includes(data.permission))
      throw new HttpException(
        Exception.INVALID_FIELD,
        HttpStatus.UNPROCESSABLE_ENTITY,
      );

    const newUser = await this.userRepository.save({
      ...data,
      password: hashSync(data.password, 12),
    });

    return new UserDto(newUser);
  }

  public async login(
    email: string,
    password: string,
    permission: string,
  ): Promise<UserDto> {
    const user = await this.userRepository.findByEmail(email);

    if (!user || user.permission !== permission) return null;

    const validPassword = compareSync(password, user.password);

    if (!validPassword) return null;

    return new UserDto(user);
  }
}

export default AuthenticationService;
