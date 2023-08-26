import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import AuthenticationController from './authentication.controller';
import AuthenticationService from './authentication.service';
import AuthenticationStrategy from './strategies/authentication.strategy';
import JwtStrategy from './strategies/jwt.strategy';
import { UserModule } from '../../../app/user/user.module';
import { CompanyModule } from 'src/app/company/company.module';

@Module({
  imports: [
    ConfigModule,
    PassportModule,
    JwtModule.register({
      privateKey: process.env.JWT_SECRET,
      signOptions: { expiresIn: '8h' },
    }),
    UserModule,
    CompanyModule,
  ],
  providers: [AuthenticationService, AuthenticationStrategy, JwtStrategy],
  controllers: [AuthenticationController],
})
export class AuthenticationModule {}
