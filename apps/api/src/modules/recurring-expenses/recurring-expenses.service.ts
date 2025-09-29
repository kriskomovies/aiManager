import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { DataSource } from 'typeorm';
import { RecurringExpenseEntity } from '../../database/entities/recurring-expense.entity';
import { MonthlyFeeEntity } from '../../database/entities/monthly-fee.entity';
import { RecurringExpenseRepository } from '../../database/repositories/recurring-expense.repository';
import { MonthlyFeeRepository } from '../../database/repositories/monthly-fee.repository';
import { CreateRecurringExpenseDto } from './dto/create-recurring-expense.dto';
import { UpdateRecurringExpenseDto } from './dto/update-recurring-expense.dto';
import { FeePaymentBasis, FeeApplicationMode } from '@repo/interfaces';

@Injectable()
export class RecurringExpensesService {
  constructor(
    private readonly recurringExpenseRepository: RecurringExpenseRepository,
    private readonly monthlyFeeRepository: MonthlyFeeRepository,
    private readonly dataSource: DataSource,
  ) {}

  async createRecurringExpense(
    createDto: CreateRecurringExpenseDto,
  ): Promise<RecurringExpenseEntity> {
    // Validate business logic
    if (createDto.addToMonthlyFees && createDto.monthlyFeeId) {
      throw new BadRequestException(
        'Cannot both add to monthly fees and link to existing monthly fee',
      );
    }

    // Monthly fee connection is now optional - recurring expense can exist independently
    // Validation removed as per new requirements

    // If linking to existing monthly fee, verify it exists and belongs to the building
    if (createDto.monthlyFeeId && !createDto.addToMonthlyFees) {
      const monthlyFee = await this.monthlyFeeRepository.findById(
        createDto.monthlyFeeId,
      );
      if (!monthlyFee) {
        throw new NotFoundException(
          `Monthly fee with ID ${createDto.monthlyFeeId} not found`,
        );
      }
      if (monthlyFee.buildingId !== createDto.buildingId) {
        throw new BadRequestException(
          'Monthly fee does not belong to the specified building',
        );
      }
    }

    return await this.dataSource.transaction(async (manager) => {
      let monthlyFeeId = createDto.monthlyFeeId;

      // If addToMonthlyFees is true, create a new monthly fee
      if (createDto.addToMonthlyFees) {
        const monthlyFeeData: Partial<MonthlyFeeEntity> = {
          buildingId: createDto.buildingId,
          name: createDto.name,
          paymentBasis: FeePaymentBasis.APARTMENT, // Default to apartment basis
          applicationMode: FeeApplicationMode.MONTHLY_FEE,
          baseAmount: createDto.monthlyAmount,
          isDistributedEvenly: true,
          isActive: true,
        };

        const monthlyFee = manager.create(MonthlyFeeEntity, monthlyFeeData);
        const savedMonthlyFee = await manager.save(monthlyFee);
        monthlyFeeId = savedMonthlyFee.id;
      }

      // Create the recurring expense record
      const entityData: Partial<RecurringExpenseEntity> = {
        buildingId: createDto.buildingId,
        name: createDto.name,
        monthlyAmount: createDto.monthlyAmount,
        userPaymentMethodId: createDto.userPaymentMethodId,
        addToMonthlyFees: createDto.addToMonthlyFees,
        monthlyFeeId: monthlyFeeId, // Now optional, can be undefined
        contractor: createDto.contractor,
        paymentDate: createDto.paymentDate
          ? new Date(createDto.paymentDate)
          : undefined,
        reason: createDto.reason,
        isActive: true,
      };

      const recurringExpense = manager.create(
        RecurringExpenseEntity,
        entityData,
      );
      return await manager.save(recurringExpense);
    });
  }

  async findById(id: string): Promise<RecurringExpenseEntity> {
    const expense = await this.recurringExpenseRepository.findById(id);
    if (!expense) {
      throw new NotFoundException(`Recurring expense with ID ${id} not found`);
    }
    return expense;
  }

  async findByBuildingId(
    buildingId: string,
  ): Promise<RecurringExpenseEntity[]> {
    return this.recurringExpenseRepository.findByBuildingId(buildingId);
  }

  async findAll(): Promise<RecurringExpenseEntity[]> {
    return this.recurringExpenseRepository.findAll();
  }

  async update(
    id: string,
    updateDto: UpdateRecurringExpenseDto,
  ): Promise<RecurringExpenseEntity> {
    const existingExpense = await this.findById(id);

    // Apply similar validation logic as create if changing critical fields
    if (
      updateDto.addToMonthlyFees !== undefined ||
      updateDto.monthlyFeeId !== undefined
    ) {
      const addToMonthlyFees =
        updateDto.addToMonthlyFees ?? existingExpense.addToMonthlyFees;
      const monthlyFeeId =
        updateDto.monthlyFeeId ?? existingExpense.monthlyFeeId;

      if (
        addToMonthlyFees &&
        monthlyFeeId &&
        monthlyFeeId !== existingExpense.monthlyFeeId
      ) {
        throw new BadRequestException(
          'Cannot both add to monthly fees and link to existing monthly fee',
        );
      }
    }

    // Transform string dates to Date objects
    const transformedDto = {
      ...updateDto,
      paymentDate: updateDto.paymentDate
        ? new Date(updateDto.paymentDate)
        : undefined,
    };

    const updated = await this.recurringExpenseRepository.update(
      id,
      transformedDto,
    );
    if (!updated) {
      throw new NotFoundException(`Recurring expense with ID ${id} not found`);
    }
    return updated;
  }

  async remove(id: string): Promise<void> {
    const success = await this.recurringExpenseRepository.delete(id);
    if (!success) {
      throw new NotFoundException(`Recurring expense with ID ${id} not found`);
    }
  }
}
