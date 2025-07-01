import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BuildingEntity } from '../entities/building.entity';
import { BuildingQueryDto } from '../../modules/buildings/dto/building-query.dto';
import { IPaginatedResult } from '../../common/abstracts/base-repository.abstract';

@Injectable()
export class BuildingRepository {
  constructor(
    @InjectRepository(BuildingEntity)
    private readonly repository: Repository<BuildingEntity>,
  ) {}

  async create(createData: Partial<BuildingEntity>): Promise<BuildingEntity> {
    const building = this.repository.create(createData);
    return await this.repository.save(building);
  }

  async findById(id: string): Promise<BuildingEntity | null> {
    return await this.repository.findOne({ where: { id } });
  }

  async findAll(): Promise<BuildingEntity[]> {
    return await this.repository.find({
      order: { createdAt: 'DESC' },
    });
  }

  async findAllWithFilters(
    queryDto: BuildingQueryDto,
  ): Promise<IPaginatedResult<BuildingEntity>> {
    const queryBuilder = this.repository.createQueryBuilder('building');

    // Apply search filter
    if (queryDto.search) {
      queryBuilder.andWhere(
        '(building.name ILIKE :search OR building.address ILIKE :search)',
        { search: `%${queryDto.search}%` },
      );
    }

    // Apply type filter
    if (queryDto.type) {
      queryBuilder.andWhere('building.type = :type', { type: queryDto.type });
    }

    // Apply status filter
    if (queryDto.status) {
      queryBuilder.andWhere('building.status = :status', {
        status: queryDto.status,
      });
    }

    // Apply occupancy rate filters
    if (
      queryDto.minOccupancyRate !== undefined ||
      queryDto.maxOccupancyRate !== undefined
    ) {
      const minRate = queryDto.minOccupancyRate ?? 0;
      const maxRate = queryDto.maxOccupancyRate ?? 100;

      queryBuilder.andWhere(
        '(building.occupiedUnits::float / NULLIF(building.totalUnits, 0) * 100) BETWEEN :minRate AND :maxRate',
        { minRate, maxRate },
      );
    }

    // Apply sorting
    const sortBy = queryDto.sortBy || 'createdAt';
    const sortOrder = queryDto.sortOrder || 'DESC';
    queryBuilder.orderBy(`building.${sortBy}`, sortOrder);

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
    updateData: Partial<BuildingEntity>,
  ): Promise<BuildingEntity | null> {
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

  private createPaginatedResult<T>(
    data: T[],
    total: number,
    page: number,
    limit: number,
  ): IPaginatedResult<T> {
    const totalPages = Math.ceil(total / limit);
    const hasNext = page < totalPages;
    const hasPrev = page > 1;

    return {
      data,
      total,
      page,
      limit,
      totalPages,
      hasNext,
      hasPrev,
    };
  }
}
