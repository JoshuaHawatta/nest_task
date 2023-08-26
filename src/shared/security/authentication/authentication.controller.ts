import { Body, Controller, Inject, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import AuthenticationService from './authentication.service';
import User from '../../../app/user/user.type';
import SaveAccountDto from '../../../app/user/dtos/save-account.dto';
import RequestBody from '../../interfaces/request-body.interface';
import AuthenticationResponse from './authentication.type';
import CompanyRepository from '../../../app/company/repositories/company.repository';

@Controller('authentication')
class AuthenticationController {
  constructor(
    private readonly authenticationService: AuthenticationService,
    @Inject(CompanyRepository)
    private readonly companyRepository: CompanyRepository,
  ) {}

  @UseGuards(AuthGuard('local'))
  @Post('login')
  public login(@Req() { user }: RequestBody): AuthenticationResponse {
    return { token: this.authenticationService.authenticate(user) };
  }

  @Post('register')
  public async register(
    @Body() data: SaveAccountDto,
  ): Promise<AuthenticationResponse> {
    const user = await this.authenticationService.save(data);

    await this.companyRepository.update({ users: [user as User] });

    return {
      message: `Olá, ${data.name}`,
      token: this.authenticationService.authenticate(user as User),
      user,
    };
  }
}

export default AuthenticationController;
