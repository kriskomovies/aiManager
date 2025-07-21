import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { DataSource } from 'typeorm';
import { InventoryEntity } from '../../database/entities/inventory.entity';
import { InventoryTransactionEntity } from '../../database/entities/inventory-transaction.entity';
import { InventoryRepository } from '../../database/repositories/inventory.repository';
import { InventoryTransactionRepository } from '../../database/repositories/inventory-transaction.repository';
import { CreateInventoryDto } from './dto/create-inventory.dto';
import { UpdateInventoryDto } from './dto/update-inventory.dto';
import { InventoryTransferDto } from './dto/inventory-transfer.dto';
import { InventoryQueryDto } from './dto/inventory-query.dto';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { TransactionType, IInventoryStats } from '@repo/interfaces';
import { IPaginatedResult } from '../../common/abstracts/base-repository.abstract';

@Injectable()
export class InventoriesService {
  constructor(
    private readonly inventoryRepository: InventoryRepository,
    private readonly inventoryTransactionRepository: InventoryTransactionRepository,
    private readonly dataSource: DataSource,
  ) {}

  async createInventory(
    createInventoryDto: CreateInventoryDto,
  ): Promise<InventoryEntity> {
    // Validate building exists (you might want to inject BuildingRepository for this)
    // For now, we'll trust the building ID is valid

    // Check if trying to create a main inventory when one already exists
    const existingMainInventory =
      await this.inventoryRepository.findMainInventoryByBuildingId(
        createInventoryDto.buildingId,
      );

    if (existingMainInventory) {
      // Custom inventories only - cannot create another main inventory
      const inventoryData: Partial<InventoryEntity> = {
        buildingId: createInventoryDto.buildingId,
        name: createInventoryDto.name,
        title: createInventoryDto.title,
        description: createInventoryDto.description,
        amount: createInventoryDto.initialAmount || 0,
        isMain: false, // Custom inventories are never main
        visibleInApp: createInventoryDto.visibleInApp ?? true,
        isActive: true,
      };

      const inventory = await this.inventoryRepository.create(inventoryData);

      // Create initial transaction if there's an initial amount
      if (
        createInventoryDto.initialAmount &&
        createInventoryDto.initialAmount > 0
      ) {
        await this.inventoryTransactionRepository.create({
          toInventoryId: inventory.id,
          type: TransactionType.DEPOSIT,
          amount: createInventoryDto.initialAmount,
          description: `Initial deposit for ${inventory.name}`,
        });
      }

      return inventory;
    } else {
      throw new BadRequestException(
        'Cannot create custom inventory - main inventory not found for this building',
      );
    }
  }

  async createMainInventoryForBuilding(
    buildingId: string,
  ): Promise<InventoryEntity> {
    // Check if main inventory already exists
    const existingMainInventory =
      await this.inventoryRepository.findMainInventoryByBuildingId(buildingId);

    if (existingMainInventory) {
      return existingMainInventory;
    }

    // Create main inventory
    const mainInventoryData: Partial<InventoryEntity> = {
      buildingId,
      name: 'Основна Каса',
      title: 'Основна Каса за Сграда',
      description: 'Основна каса за всички общи разходи и приходи на сградата',
      amount: 0,
      isMain: true,
      visibleInApp: true,
      isActive: true,
    };

    return await this.inventoryRepository.create(mainInventoryData);
  }

  async getInventoriesByBuilding(
    buildingId: string,
  ): Promise<InventoryEntity[]> {
    return await this.inventoryRepository.findByBuildingId(buildingId);
  }

  async getInventoryById(id: string): Promise<InventoryEntity> {
    const inventory = await this.inventoryRepository.findById(id);

    if (!inventory) {
      throw new NotFoundException(`Inventory with ID ${id} not found`);
    }

    return inventory;
  }

  async updateInventory(
    id: string,
    updateInventoryDto: UpdateInventoryDto,
  ): Promise<InventoryEntity> {
    const inventory = await this.getInventoryById(id);

    // Prevent updating main inventory name/title
    if (
      inventory.isMain &&
      (updateInventoryDto.name || updateInventoryDto.title)
    ) {
      throw new BadRequestException(
        'Cannot update name or title of main inventory',
      );
    }

    const updated = await this.inventoryRepository.update(
      id,
      updateInventoryDto,
    );

    if (!updated) {
      throw new NotFoundException(`Inventory with ID ${id} not found`);
    }

    return updated;
  }

  async deleteInventory(id: string): Promise<void> {
    const inventory = await this.getInventoryById(id);

    // Prevent deleting main inventory
    if (inventory.isMain) {
      throw new BadRequestException('Cannot delete main inventory');
    }

    // Note: Allow deletion of inventory with remaining balance
    // The frontend handles transfer logic if user chooses to preserve funds

    const deleted = await this.inventoryRepository.delete(id);

    if (!deleted) {
      throw new NotFoundException(`Inventory with ID ${id} not found`);
    }
  }

  async transferMoney(
    transferDto: InventoryTransferDto,
  ): Promise<InventoryTransactionEntity> {
    // Validate inventories exist and get current amounts
    const fromInventory = await this.getInventoryById(
      transferDto.fromInventoryId,
    );
    const toInventory = await this.getInventoryById(transferDto.toInventoryId);

    // Validate transfer
    if (transferDto.fromInventoryId === transferDto.toInventoryId) {
      throw new BadRequestException(
        'Cannot transfer money to the same inventory',
      );
    }

    if (fromInventory.amount < transferDto.amount) {
      throw new BadRequestException('Insufficient funds in source inventory');
    }

    if (transferDto.amount <= 0) {
      throw new BadRequestException('Transfer amount must be greater than 0');
    }

    // Ensure both inventories belong to the same building
    if (fromInventory.buildingId !== toInventory.buildingId) {
      throw new BadRequestException(
        'Cannot transfer money between inventories of different buildings',
      );
    }

    // Perform transfer in transaction
    return await this.dataSource.transaction(async (manager) => {
      // Update inventory amounts
      const newFromAmount = Number(fromInventory.amount) - transferDto.amount;
      const newToAmount = Number(toInventory.amount) + transferDto.amount;

      await manager.update(InventoryEntity, transferDto.fromInventoryId, {
        amount: newFromAmount,
      });

      await manager.update(InventoryEntity, transferDto.toInventoryId, {
        amount: newToAmount,
      });

      // Create transaction record
      const transactionData: Partial<InventoryTransactionEntity> = {
        fromInventoryId: transferDto.fromInventoryId,
        toInventoryId: transferDto.toInventoryId,
        type: TransactionType.TRANSFER,
        amount: transferDto.amount,
        description:
          transferDto.description ||
          `Transfer from ${fromInventory.name} to ${toInventory.name}`,
      };

      const transaction = manager.create(
        InventoryTransactionEntity,
        transactionData,
      );
      return await manager.save(transaction);
    });
  }

  async getInventoryStats(buildingId: string): Promise<IInventoryStats> {
    const stats = await this.inventoryRepository.getInventoryStats(buildingId);
    const transactionStats =
      await this.inventoryTransactionRepository.getTransactionStats();

    return {
      totalAmount: stats.totalAmount,
      mainCashAmount: stats.mainCashAmount,
      customInventoriesTotal: stats.customInventoriesTotal,
      inventoryCount: stats.inventoryCount,
      transactionCount: transactionStats.totalTransactions,
      lastTransactionDate: transactionStats.lastTransactionDate?.toISOString(),
    };
  }

  async getAllInventories(
    queryDto: InventoryQueryDto,
  ): Promise<IPaginatedResult<InventoryEntity>> {
    return await this.inventoryRepository.findAllWithFilters(queryDto);
  }

  async getInventoryTransactions(
    inventoryId: string,
    queryDto: any, // TODO: Create proper DTO type
  ): Promise<IPaginatedResult<InventoryTransactionEntity>> {
    // Validate inventory exists
    await this.getInventoryById(inventoryId);

    return await this.inventoryTransactionRepository.findByInventoryId(
      inventoryId,
      queryDto,
    );
  }

  async createExpense(
    createExpenseDto: CreateExpenseDto,
  ): Promise<InventoryTransactionEntity> {
    // Validate source inventory exists and get current amount
    const sourceInventory = await this.getInventoryById(
      createExpenseDto.sourceInventoryId,
    );

    // Validate sufficient funds
    if (sourceInventory.amount < createExpenseDto.amount) {
      throw new BadRequestException(
        `Insufficient funds in ${sourceInventory.name}. Available: ${sourceInventory.amount.toFixed(2)}, Required: ${createExpenseDto.amount.toFixed(2)}`,
      );
    }

    if (createExpenseDto.amount <= 0) {
      throw new BadRequestException('Expense amount must be greater than 0');
    }

    // Perform expense transaction
    return await this.dataSource.transaction(async (manager) => {
      // Update inventory amount (deduct expense)
      const newAmount =
        Number(sourceInventory.amount) - createExpenseDto.amount;

      await manager.update(
        InventoryEntity,
        createExpenseDto.sourceInventoryId,
        {
          amount: newAmount,
        },
      );

      // Create transaction record
      const transactionData: Partial<InventoryTransactionEntity> = {
        fromInventoryId: createExpenseDto.sourceInventoryId,
        toInventoryId: undefined, // No target inventory for expenses
        userPaymentMethodId: createExpenseDto.userPaymentMethodId,
        type: TransactionType.EXPENSE_PAID,
        amount: createExpenseDto.amount,
        description: createExpenseDto.description || 'One-time expense',
      };

      const transaction = manager.create(
        InventoryTransactionEntity,
        transactionData,
      );
      return await manager.save(transaction);
    });
  }
}
