import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OneTimeExpenseEntity } from '../entities/one-time-expense.entity';
// import { OneTimeExpenseQueryDto } from '../../modules/one-time-expenses/dto/one-time-expense-query.dto';

@Injectable()
export class OneTimeExpenseRepository {
  constructor(
    @InjectRepository(OneTimeExpenseEntity)
    private readonly repository: Repository<OneTimeExpenseEntity>,
  ) {}

  async create(
    createData: Partial<OneTimeExpenseEntity>,
  ): Promise<OneTimeExpenseEntity> {
    const entity = this.repository.create(createData);
    return await this.repository.save(entity);
  }

  async findById(id: string): Promise<OneTimeExpenseEntity | null> {
    return await this.repository.findOne({ where: { id } });
  }

  async findAll(): Promise<OneTimeExpenseEntity[]> {
    return await this.repository.find({ order: { createdAt: 'DESC' } });
  }

  // Uncomment and implement filtering when DTO is ready
  // async findAllWithFilters(queryDto: OneTimeExpenseQueryDto): Promise<IPaginatedResult<OneTimeExpenseEntity>> {
  //   // Filtering logic here
  // }

  async update(
    id: string,
    updateData: Partial<OneTimeExpenseEntity>,
  ): Promise<OneTimeExpenseEntity | null> {
    await this.repository.update(id, updateData);
    return await this.findById(id);
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.repository.delete(id);
    return result.affected ? result.affected > 0 : false;
  }

  async exists(id: string): Promise<boolean> {
    const count = await this.repository.count({ where: { id } });
    return count > 0;
  }

  async count(): Promise<number> {
    return await this.repository.count();
  }

  // Add more methods as needed
}
