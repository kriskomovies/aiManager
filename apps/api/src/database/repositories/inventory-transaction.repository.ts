import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InventoryTransactionEntity } from '../entities/inventory-transaction.entity';
import { TransactionType } from '@repo/interfaces';
import { IPaginatedResult } from '../../common/abstracts/base-repository.abstract';

export interface InventoryTransactionQueryDto {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
  inventoryId?: string;
  type?: TransactionType;
  fromDate?: string;
  toDate?: string;
}

@Injectable()
export class InventoryTransactionRepository {
  constructor(
    @InjectRepository(InventoryTransactionEntity)
    private readonly repository: Repository<InventoryTransactionEntity>,
  ) {}

  async create(
    createData: Partial<InventoryTransactionEntity>,
  ): Promise<InventoryTransactionEntity> {
    const transaction = this.repository.create(createData);
    return await this.repository.save(transaction);
  }

  async findById(id: string): Promise<InventoryTransactionEntity | null> {
    return await this.repository.findOne({
      where: { id },
      relations: ['fromInventory', 'toInventory'],
    });
  }

  async findByInventoryId(
    inventoryId: string,
    queryDto: InventoryTransactionQueryDto,
  ): Promise<IPaginatedResult<InventoryTransactionEntity>> {
    const queryBuilder = this.repository.createQueryBuilder('transaction');

    // Add inventory relations
    queryBuilder.leftJoinAndSelect(
      'transaction.fromInventory',
      'fromInventory',
    );
    queryBuilder.leftJoinAndSelect('transaction.toInventory', 'toInventory');

    // Filter by inventory (either from or to)
    queryBuilder.andWhere(
      '(transaction.fromInventoryId = :inventoryId OR transaction.toInventoryId = :inventoryId)',
      { inventoryId },
    );

    // Apply type filter
    if (queryDto.type) {
      queryBuilder.andWhere('transaction.type = :type', {
        type: queryDto.type,
      });
    }

    // Apply date range filters
    if (queryDto.fromDate) {
      queryBuilder.andWhere('transaction.createdAt >= :fromDate', {
        fromDate: queryDto.fromDate,
      });
    }

    if (queryDto.toDate) {
      queryBuilder.andWhere('transaction.createdAt <= :toDate', {
        toDate: queryDto.toDate,
      });
    }

    // Apply sorting
    const sortBy = queryDto.sortBy || 'createdAt';
    const sortOrder = queryDto.sortOrder || 'DESC';
    queryBuilder.orderBy(`transaction.${sortBy}`, sortOrder);

    // Apply pagination
    const page = queryDto.page || 1;
    const limit = queryDto.limit || 10;
    const skip = (page - 1) * limit;

    queryBuilder.skip(skip).take(limit);

    const [data, total] = await queryBuilder.getManyAndCount();

    return this.createPaginatedResult(data, total, page, limit);
  }

  async findAllWithFilters(
    queryDto: InventoryTransactionQueryDto,
  ): Promise<IPaginatedResult<InventoryTransactionEntity>> {
    const queryBuilder = this.repository.createQueryBuilder('transaction');

    // Add inventory relations
    queryBuilder.leftJoinAndSelect(
      'transaction.fromInventory',
      'fromInventory',
    );
    queryBuilder.leftJoinAndSelect('transaction.toInventory', 'toInventory');

    // Apply filters
    if (queryDto.inventoryId) {
      queryBuilder.andWhere(
        '(transaction.fromInventoryId = :inventoryId OR transaction.toInventoryId = :inventoryId)',
        { inventoryId: queryDto.inventoryId },
      );
    }

    if (queryDto.type) {
      queryBuilder.andWhere('transaction.type = :type', {
        type: queryDto.type,
      });
    }

    if (queryDto.fromDate) {
      queryBuilder.andWhere('transaction.createdAt >= :fromDate', {
        fromDate: queryDto.fromDate,
      });
    }

    if (queryDto.toDate) {
      queryBuilder.andWhere('transaction.createdAt <= :toDate', {
        toDate: queryDto.toDate,
      });
    }

    // Apply sorting
    const sortBy = queryDto.sortBy || 'createdAt';
    const sortOrder = queryDto.sortOrder || 'DESC';
    queryBuilder.orderBy(`transaction.${sortBy}`, sortOrder);

    // Apply pagination
    const page = queryDto.page || 1;
    const limit = queryDto.limit || 10;
    const skip = (page - 1) * limit;

    queryBuilder.skip(skip).take(limit);

    const [data, total] = await queryBuilder.getManyAndCount();

    return this.createPaginatedResult(data, total, page, limit);
  }

  async getTransactionStats(inventoryId?: string): Promise<{
    totalTransactions: number;
    totalIncoming: number;
    totalOutgoing: number;
    lastTransactionDate?: Date;
  }> {
    const queryBuilder = this.repository.createQueryBuilder('transaction');

    if (inventoryId) {
      queryBuilder.where(
        '(transaction.fromInventoryId = :inventoryId OR transaction.toInventoryId = :inventoryId)',
        { inventoryId },
      );
    }

    const result = await queryBuilder
      .select([
        'COUNT(*) as totalTransactions',
        'SUM(CASE WHEN transaction.toInventoryId = :inventoryId THEN transaction.amount ELSE 0 END) as totalIncoming',
        'SUM(CASE WHEN transaction.fromInventoryId = :inventoryId THEN transaction.amount ELSE 0 END) as totalOutgoing',
        'MAX(transaction.createdAt) as lastTransactionDate',
      ])
      .setParameter('inventoryId', inventoryId)
      .getRawOne();

    return {
      totalTransactions: parseInt(result?.totalTransactions || '0', 10),
      totalIncoming: parseFloat(result?.totalIncoming || '0'),
      totalOutgoing: parseFloat(result?.totalOutgoing || '0'),
      lastTransactionDate: result?.lastTransactionDate || undefined,
    };
  }

  async findRecentTransactions(
    inventoryId: string,
    limit: number = 5,
  ): Promise<InventoryTransactionEntity[]> {
    return await this.repository.find({
      where: [{ fromInventoryId: inventoryId }, { toInventoryId: inventoryId }],
      relations: ['fromInventory', 'toInventory'],
      order: { createdAt: 'DESC' },
      take: limit,
    });
  }

  protected createPaginatedResult<U>(
    data: U[],
    total: number,
    page: number,
    limit: number,
  ): IPaginatedResult<U> {
    const totalPages = Math.ceil(total / limit);
    return {
      data,
      total,
      page,
      limit,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1,
    };
  }
}
