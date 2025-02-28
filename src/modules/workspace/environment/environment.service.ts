import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import { CreateDto } from './dto/create.dto';
import { UpdateDto } from './dto/update.dto';
import { QueryDto } from './dto/query.dto';
import { Environment } from '@/entities/environment.entity';

@Injectable()
export class EnvironmentService {
  constructor(
    @InjectRepository(Environment)
    private readonly repository: Repository<Environment>,
  ) {}

  async create(createDto: CreateDto) {
    return await this.repository.save(createDto);
  }

  async batchCreate(createDto: Array<CreateDto>) {
    return this.repository
      .createQueryBuilder()
      .insert()
      .into(Environment)
      .values(createDto)
      .execute();
  }

  async findAll(options: FindManyOptions<Environment>) {
    return await this.repository.find(options);
  }

  async findOne(options: FindOneOptions<Environment>): Promise<Environment> {
    return await this.repository.findOne(options);
  }

  async update(id: number, updateDto: UpdateDto) {
    return await this.repository.update(id, updateDto);
  }

  async remove(uuid: number, projectID: number) {
    return this.repository
      .createQueryBuilder()
      .delete()
      .from(Environment)
      .where('uuid = :uuid', { uuid })
      .andWhere('projectID = :projectID', { projectID })
      .execute();
  }
}
