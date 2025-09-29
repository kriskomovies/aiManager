import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RecurringExpensePaymentEntity } from '../entities/recurring-expense-payment.entity';

@Injectable()
export class RecurringExpensePaymentRepository {
  constructor(
    @InjectRepository(RecurringExpensePaymentEntity)
    private readonly repository: Repository<RecurringExpensePaymentEntity>,
  ) {}

  async create(
    createData: Partial<RecurringExpensePaymentEntity>,
  ): Promise<RecurringExpensePaymentEntity> {
    const entity = this.repository.create(createData);
    const savedPayment = await this.repository.save(entity);

    // Return with relations loaded
    const paymentWithRelations = await this.repository.findOne({
      where: { id: savedPayment.id },
      relations: ['userPaymentMethod', 'monthlyFee'],
    });

    if (!paymentWithRelations) {
      throw new Error('Failed to create payment');
    }

    return paymentWithRelations;
  }

  async findById(id: string): Promise<RecurringExpensePaymentEntity | null> {
    return await this.repository.findOne({
      where: { id },
      relations: ['userPaymentMethod', 'monthlyFee', 'recurringExpense'],
    });
  }

  async findByRecurringExpenseId(
    recurringExpenseId: string,
  ): Promise<RecurringExpensePaymentEntity[]> {
    return await this.repository.find({
      where: { recurringExpenseId },
      relations: ['userPaymentMethod', 'monthlyFee'],
      order: { paymentDate: 'DESC', createdAt: 'DESC' },
    });
  }

  async findByRecurringExpenseIds(
    recurringExpenseIds: string[],
  ): Promise<RecurringExpensePaymentEntity[]> {
    if (recurringExpenseIds.length === 0) {
      return [];
    }

    return await this.repository
      .createQueryBuilder('payment')
      .leftJoinAndSelect('payment.userPaymentMethod', 'userPaymentMethod')
      .leftJoinAndSelect('payment.monthlyFee', 'monthlyFee')
      .where('payment.recurringExpenseId IN (:...ids)', {
        ids: recurringExpenseIds,
      })
      .orderBy('payment.paymentDate', 'DESC')
      .addOrderBy('payment.createdAt', 'DESC')
      .getMany();
  }

  async findAll(): Promise<RecurringExpensePaymentEntity[]> {
    return await this.repository.find({
      relations: ['userPaymentMethod', 'monthlyFee'],
      order: { paymentDate: 'DESC', createdAt: 'DESC' },
    });
  }

  async update(
    id: string,
    updateData: Partial<RecurringExpensePaymentEntity>,
  ): Promise<RecurringExpensePaymentEntity | null> {
    await this.repository.update(id, updateData);
    return await this.findById(id);
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.repository.delete(id);
    return result.affected ? result.affected > 0 : false;
  }

  async exists(id: string): Promise<boolean> {
    const count = await this.repository.count({
      where: { id },
    });
    return count > 0;
  }

  async count(): Promise<number> {
    return await this.repository.count();
  }
}
