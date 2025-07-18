import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InventoryEntity } from '../entities/inventory.entity';
import { IPaginatedResult } from '../../common/abstracts/base-repository.abstract';

export interface InventoryQueryDto {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
  search?: string;
  buildingId?: string;
  isMain?: boolean;
  visibleInApp?: boolean;
}

@Injectable()
export class InventoryRepository {
  constructor(
    @InjectRepository(InventoryEntity)
    private readonly repository: Repository<InventoryEntity>,
  ) {}

  async create(createData: Partial<InventoryEntity>): Promise<InventoryEntity> {
    const inventory = this.repository.create(createData);
    return await this.repository.save(inventory);
  }

  async findById(id: string): Promise<InventoryEntity | null> {
    return await this.repository.findOne({
      where: { id },
      relations: ['building'],
    });
  }

  async findByBuildingId(buildingId: string): Promise<InventoryEntity[]> {
    return await this.repository.find({
      where: { buildingId, isActive: true },
      order: { isMain: 'DESC', createdAt: 'ASC' },
    });
  }

  async findMainInventoryByBuildingId(
    buildingId: string,
  ): Promise<InventoryEntity | null> {
    return await this.repository.findOne({
      where: { buildingId, isMain: true, isActive: true },
    });
  }

  async findAllWithFilters(
    queryDto: InventoryQueryDto,
  ): Promise<IPaginatedResult<InventoryEntity>> {
    const queryBuilder = this.repository.createQueryBuilder('inventory');

    // Add building relation
    queryBuilder.leftJoinAndSelect('inventory.building', 'building');

    // Apply building filter
    if (queryDto.buildingId) {
      queryBuilder.andWhere('inventory.buildingId = :buildingId', {
        buildingId: queryDto.buildingId,
      });
    }

    // Apply search filter
    if (queryDto.search) {
      queryBuilder.andWhere(
        '(inventory.name ILIKE :search OR inventory.title ILIKE :search OR inventory.description ILIKE :search)',
        { search: `%${queryDto.search}%` },
      );
    }

    // Apply isMain filter
    if (queryDto.isMain !== undefined) {
      queryBuilder.andWhere('inventory.isMain = :isMain', {
        isMain: queryDto.isMain,
      });
    }

    // Apply visibleInApp filter
    if (queryDto.visibleInApp !== undefined) {
      queryBuilder.andWhere('inventory.visibleInApp = :visibleInApp', {
        visibleInApp: queryDto.visibleInApp,
      });
    }

    // Only active inventories
    queryBuilder.andWhere('inventory.isActive = :isActive', {
      isActive: true,
    });

    // Apply sorting
    const sortBy = queryDto.sortBy || 'createdAt';
    const sortOrder = queryDto.sortOrder || 'DESC';

    // Default sort: main inventories first, then by creation date
    queryBuilder.orderBy('inventory.isMain', 'DESC');
    queryBuilder.addOrderBy(`inventory.${sortBy}`, sortOrder);

    // Apply pagination
    const page = queryDto.page || 1;
    const limit = queryDto.limit || 10;
    const skip = (page - 1) * limit;

    queryBuilder.skip(skip).take(limit);

    const [data, total] = await queryBuilder.getManyAndCount();

    return this.createPaginatedResult(data, total, page, limit);
  }

  async update(
    id: string,
    updateData: Partial<InventoryEntity>,
  ): Promise<InventoryEntity | null> {
    await this.repository.update(id, updateData);
    return await this.findById(id);
  }

  async delete(id: string): Promise<boolean> {
    // Soft delete by setting isActive to false
    const result = await this.repository.update(id, { isActive: false });
    return result.affected ? result.affected > 0 : false;
  }

  async exists(id: string): Promise<boolean> {
    const count = await this.repository.count({
      where: { id, isActive: true },
    });
    return count > 0;
  }

  async updateAmount(
    id: string,
    newAmount: number,
  ): Promise<InventoryEntity | null> {
    await this.repository.update(id, { amount: newAmount });
    return await this.findById(id);
  }

  async getTotalAmountByBuilding(buildingId: string): Promise<number> {
    const result = await this.repository
      .createQueryBuilder('inventory')
      .select('SUM(inventory.amount)', 'total')
      .where('inventory.buildingId = :buildingId', { buildingId })
      .andWhere('inventory.isActive = :isActive', { isActive: true })
      .getRawOne();

    return parseFloat(result?.total || '0');
  }

  async getInventoryStats(buildingId: string): Promise<{
    totalAmount: number;
    mainCashAmount: number;
    customInventoriesTotal: number;
    inventoryCount: number;
  }> {
    const result = await this.repository
      .createQueryBuilder('inventory')
      .select([
        'SUM(inventory.amount) as totalAmount',
        'SUM(CASE WHEN inventory.isMain = true THEN inventory.amount ELSE 0 END) as mainCashAmount',
        'SUM(CASE WHEN inventory.isMain = false THEN inventory.amount ELSE 0 END) as customInventoriesTotal',
        'COUNT(*) as inventoryCount',
      ])
      .where('inventory.buildingId = :buildingId', { buildingId })
      .andWhere('inventory.isActive = :isActive', { isActive: true })
      .getRawOne();

    return {
      totalAmount: parseFloat(result?.totalAmount || '0'),
      mainCashAmount: parseFloat(result?.mainCashAmount || '0'),
      customInventoriesTotal: parseFloat(result?.customInventoriesTotal || '0'),
      inventoryCount: parseInt(result?.inventoryCount || '0', 10),
    };
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
