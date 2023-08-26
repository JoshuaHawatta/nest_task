import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { JwtExceptionFilter } from './exceptions/Jwt.exception';
import CompanyRepository from './app/company/repositories/company.repository';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const companyService = app.get(CompanyRepository);

  app.enableCors({ origin: '*' });
  app.useGlobalFilters(new JwtExceptionFilter());
  app.useGlobalPipes(new ValidationPipe({ errorHttpStatusCode: 422 }));

  await companyService.ensureCompanyExists();
  await app.listen(parseInt(process.env.PORT) || 3000);
}

bootstrap();
