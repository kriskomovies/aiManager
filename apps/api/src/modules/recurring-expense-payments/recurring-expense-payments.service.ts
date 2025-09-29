import { Injectable, NotFoundException } from '@nestjs/common';
import { RecurringExpensePaymentRepository } from '../../database/repositories/recurring-expense-payment.repository';
import { RecurringExpenseRepository } from '../../database/repositories/recurring-expense.repository';
import { UserPaymentMethodRepository } from '../../database/repositories/user-payment-method.repository';
import { MonthlyFeeRepository } from '../../database/repositories/monthly-fee.repository';
import { CreateRecurringExpensePaymentDto } from './dto/create-recurring-expense-payment.dto';
import { UpdateRecurringExpensePaymentDto } from './dto/update-recurring-expense-payment.dto';
import { RecurringExpensePaymentEntity } from '../../database/entities/recurring-expense-payment.entity';

@Injectable()
export class RecurringExpensePaymentsService {
  constructor(
    private readonly recurringExpensePaymentRepository: RecurringExpensePaymentRepository,
    private readonly recurringExpenseRepository: RecurringExpenseRepository,
    private readonly userPaymentMethodRepository: UserPaymentMethodRepository,
    private readonly monthlyFeeRepository: MonthlyFeeRepository,
  ) {}

  async create(
    createDto: CreateRecurringExpensePaymentDto,
  ): Promise<RecurringExpensePaymentEntity> {
    // Validate that the recurring expense exists
    const recurringExpense = await this.recurringExpenseRepository.findById(
      createDto.recurringExpenseId,
    );
    if (!recurringExpense) {
      throw new NotFoundException('Recurring expense not found');
    }

    // Validate that the payment method exists
    const paymentMethod = await this.userPaymentMethodRepository.findById(
      createDto.userPaymentMethodId,
    );
    if (!paymentMethod) {
      throw new NotFoundException('Payment method not found');
    }

    // Validate monthly fee if provided
    if (createDto.monthlyFeeId) {
      const monthlyFee = await this.monthlyFeeRepository.findById(
        createDto.monthlyFeeId,
      );
      if (!monthlyFee) {
        throw new NotFoundException('Monthly fee not found');
      }
    }

    // Transform DTO to entity data
    const entityData: Partial<RecurringExpensePaymentEntity> = {
      name: createDto.name,
      amount: createDto.amount,
      recurringExpenseId: createDto.recurringExpenseId,
      userPaymentMethodId: createDto.userPaymentMethodId,
      connectPayment: createDto.connectPayment,
      monthlyFeeId: createDto.monthlyFeeId,
      reason: createDto.reason,
      paymentDate: new Date(createDto.paymentDate),
      issueDocument: createDto.issueDocument,
      documentType: createDto.documentType,
    };

    return this.recurringExpensePaymentRepository.create(entityData);
  }

  async findAll(): Promise<RecurringExpensePaymentEntity[]> {
    return this.recurringExpensePaymentRepository.findAll();
  }

  async findByRecurringExpense(
    recurringExpenseId: string,
  ): Promise<RecurringExpensePaymentEntity[]> {
    return this.recurringExpensePaymentRepository.findByRecurringExpenseId(
      recurringExpenseId,
    );
  }

  async findByRecurringExpenses(
    recurringExpenseIds: string[],
  ): Promise<RecurringExpensePaymentEntity[]> {
    return this.recurringExpensePaymentRepository.findByRecurringExpenseIds(
      recurringExpenseIds,
    );
  }

  async findOne(id: string): Promise<RecurringExpensePaymentEntity> {
    const payment = await this.recurringExpensePaymentRepository.findById(id);

    if (!payment) {
      throw new NotFoundException('Payment not found');
    }

    return payment;
  }

  async update(
    id: string,
    updateDto: UpdateRecurringExpensePaymentDto,
  ): Promise<RecurringExpensePaymentEntity> {
    // Validate payment method if being updated
    if (updateDto.userPaymentMethodId) {
      const paymentMethod = await this.userPaymentMethodRepository.findById(
        updateDto.userPaymentMethodId,
      );
      if (!paymentMethod) {
        throw new NotFoundException('Payment method not found');
      }
    }

    // Validate monthly fee if being updated
    if (updateDto.monthlyFeeId) {
      const monthlyFee = await this.monthlyFeeRepository.findById(
        updateDto.monthlyFeeId,
      );
      if (!monthlyFee) {
        throw new NotFoundException('Monthly fee not found');
      }
    }

    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    await this.recurringExpensePaymentRepository.delete(id);
  }
}
