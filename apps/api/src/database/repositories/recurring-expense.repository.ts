import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RecurringExpenseEntity } from '../entities/recurring-expense.entity';

@Injectable()
export class RecurringExpenseRepository {
  constructor(
    @InjectRepository(RecurringExpenseEntity)
    private readonly repository: Repository<RecurringExpenseEntity>,
  ) {}

  async create(
    createData: Partial<RecurringExpenseEntity>,
  ): Promise<RecurringExpenseEntity> {
    const entity = this.repository.create(createData);
    return await this.repository.save(entity);
  }

  async findById(id: string): Promise<RecurringExpenseEntity | null> {
    return await this.repository.findOne({
      where: { id },
      relations: ['building', 'monthlyFee', 'userPaymentMethod'],
    });
  }

  async findByBuildingId(
    buildingId: string,
  ): Promise<RecurringExpenseEntity[]> {
    return await this.repository.find({
      where: { buildingId, isActive: true },
      relations: ['building', 'monthlyFee', 'userPaymentMethod'],
      order: { createdAt: 'DESC' },
    });
  }

  async findAll(): Promise<RecurringExpenseEntity[]> {
    return await this.repository.find({
      where: { isActive: true },
      relations: ['building', 'monthlyFee', 'userPaymentMethod'],
      order: { createdAt: 'DESC' },
    });
  }

  async update(
    id: string,
    updateData: Partial<RecurringExpenseEntity>,
  ): Promise<RecurringExpenseEntity | null> {
    await this.repository.update(id, updateData);
    return await this.findById(id);
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.repository.update(id, { isActive: false });
    return result.affected ? result.affected > 0 : false;
  }

  async exists(id: string): Promise<boolean> {
    const count = await this.repository.count({
      where: { id, isActive: true },
    });
    return count > 0;
  }

  async count(): Promise<number> {
    return await this.repository.count({ where: { isActive: true } });
  }
}
