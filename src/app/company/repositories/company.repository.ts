import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Company, CompanyDocument } from '../company.entity';
import { Injectable } from '@nestjs/common';
import UpdateCompanyDto from '../dtos/update-comapny.dto';

@Injectable()
class CompanyRepository {
  constructor(
    @InjectModel(Company.name) private company: Model<CompanyDocument>,
  ) {}

  public async ensureCompanyExists(): Promise<Company> {
    const company = await this.company.findOne({ name: 'Workmize' });

    if (company) return company;

    return await this.company.create({
      name: 'Workmize',
      users: [],
      tasks: [],
    });
  }

  public async update(data: UpdateCompanyDto): Promise<Company> {
    const { _id, users, tasks } = await this.company.findOne({
      name: 'Workmize',
    });

    return await this.company.findByIdAndUpdate(
      _id,
      { users: [...users, ...data.users], tasks: [...tasks, ...data.tasks] },
      { new: true },
    );
  }
}

export default CompanyRepository;
