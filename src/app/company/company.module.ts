import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Company, CompanySchema } from './company.entity';
import CompanyRepository from './repositories/company.repository';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Company.name, schema: CompanySchema }]),
  ],
  providers: [CompanyRepository],
  exports: [CompanyRepository],
})
export class CompanyModule {}
