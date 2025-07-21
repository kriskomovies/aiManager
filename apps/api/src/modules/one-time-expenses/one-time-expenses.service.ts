import { Injectable, NotFoundException } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { OneTimeExpenseEntity } from '../../database/entities/one-time-expense.entity';
import { OneTimeExpenseRepository } from '../../database/repositories/one-time-expense.repository';
import { InventoryEntity } from '../../database/entities/inventory.entity';
import { InventoryTransactionEntity } from '../../database/entities/inventory-transaction.entity';
import { CreateOneTimeExpenseDto } from './dto/create-one-time-expense.dto';
import { UpdateOneTimeExpenseDto } from './dto/update-one-time-expense.dto';
import { TransactionType } from '@repo/interfaces';
// import { OneTimeExpenseQueryDto } from './dto/one-time-expense-query.dto';
// import { IPaginatedResult } from '../../common/abstracts/base-repository.abstract';

@Injectable()
export class OneTimeExpensesService {
  constructor(
    private readonly oneTimeExpenseRepository: OneTimeExpenseRepository,
    private readonly dataSource: DataSource,
  ) {}

  async createOneTimeExpense(
    createDto: CreateOneTimeExpenseDto,
  ): Promise<OneTimeExpenseEntity> {
    // Perform the one-time expense creation and inventory deduction in a transaction
    return await this.dataSource.transaction(async (manager) => {
      // 1. Create the one-time expense record
      const entityData: Partial<OneTimeExpenseEntity> = {
        ...createDto,
        expenseDate: new Date(createDto.expenseDate),
      };
      const expense = manager.create(OneTimeExpenseEntity, entityData);
      const savedExpense = await manager.save(expense);

      // 2. Deduct amount from inventory (allow negative balance)
      const inventory = await manager.findOne(InventoryEntity, {
        where: { id: createDto.inventoryId },
      });

      if (!inventory) {
        throw new NotFoundException(
          `Inventory with ID ${createDto.inventoryId} not found`,
        );
      }

      const newAmount = Number(inventory.amount) - createDto.amount;
      await manager.update(InventoryEntity, createDto.inventoryId, {
        amount: newAmount,
      });

      // 3. Create inventory transaction record
      const transactionData: Partial<InventoryTransactionEntity> = {
        fromInventoryId: createDto.inventoryId,
        toInventoryId: undefined, // No target inventory for expenses
        userPaymentMethodId: createDto.userPaymentMethodId,
        type: TransactionType.EXPENSE_PAID,
        amount: createDto.amount,
        description: createDto.note || `One-time expense: ${createDto.name}`,
        referenceId: `one_time_expense_${savedExpense.id}`,
      };

      const transaction = manager.create(
        InventoryTransactionEntity,
        transactionData,
      );
      await manager.save(transaction);

      return savedExpense;
    });
  }

  async findById(id: string): Promise<OneTimeExpenseEntity> {
    const expense = await this.oneTimeExpenseRepository.findById(id);
    if (!expense) {
      throw new NotFoundException(`One-time expense with ID ${id} not found`);
    }
    return expense;
  }

  async findAllOneTimeExpenses(/*queryDto: OneTimeExpenseQueryDto*/): Promise<
    OneTimeExpenseEntity[]
  > {
    // return await this.oneTimeExpenseRepository.findAllWithFilters(queryDto);
    return await this.oneTimeExpenseRepository.findAll();
  }

  async updateOneTimeExpense(
    id: string,
    updateDto: UpdateOneTimeExpenseDto,
  ): Promise<OneTimeExpenseEntity> {
    // Build updateData field by field to ensure correct types
    const updateData: Partial<OneTimeExpenseEntity> = {};
    if (updateDto.name !== undefined) updateData.name = updateDto.name;
    if (updateDto.contragentId !== undefined)
      updateData.contragentId = updateDto.contragentId;
    if (updateDto.expenseDate !== undefined)
      updateData.expenseDate = new Date(updateDto.expenseDate);
    if (updateDto.amount !== undefined) updateData.amount = updateDto.amount;
    if (updateDto.inventoryId !== undefined)
      updateData.inventoryId = updateDto.inventoryId;
    if (updateDto.userPaymentMethodId !== undefined)
      updateData.userPaymentMethodId = updateDto.userPaymentMethodId;
    if (updateDto.note !== undefined) updateData.note = updateDto.note;
    await this.findById(id);
    const updated = await this.oneTimeExpenseRepository.update(id, updateData);
    if (!updated) {
      throw new NotFoundException(`One-time expense with ID ${id} not found`);
    }
    return updated;
  }

  async deleteOneTimeExpense(id: string): Promise<void> {
    const exists = await this.oneTimeExpenseRepository.exists(id);
    if (!exists) {
      throw new NotFoundException(`One-time expense with ID ${id} not found`);
    }
    const deleted = await this.oneTimeExpenseRepository.delete(id);
    if (!deleted) {
      throw new NotFoundException(
        `Failed to delete one-time expense with ID ${id}`,
      );
    }
  }
}
