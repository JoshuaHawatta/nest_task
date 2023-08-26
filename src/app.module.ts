import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './app/user/user.module';
import { DatabaseModule } from './shared/database/database.module';
import { AuthenticationModule } from './shared/security/authentication/authentication.module';
import { TaskModule } from './app/task/task.module';
import { CompanyModule } from './app/company/company.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    AuthenticationModule,
    UserModule,
    TaskModule,
    CompanyModule,
  ],
  controllers: [],
  providers: [],
  exports: [],
})
export class AppModule {}
