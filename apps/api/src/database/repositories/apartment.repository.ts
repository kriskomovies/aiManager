import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ApartmentEntity } from '../entities/apartment.entity';
import { ApartmentQueryDto } from '../../modules/apartments/dto/apartment-query.dto';
import { IPaginatedResult } from '../../common/abstracts/base-repository.abstract';

@Injectable()
export class ApartmentRepository {
  constructor(
    @InjectRepository(ApartmentEntity)
    private readonly repository: Repository<ApartmentEntity>,
  ) {}

  async create(createData: Partial<ApartmentEntity>): Promise<ApartmentEntity> {
    const apartment = this.repository.create(createData);
    return await this.repository.save(apartment);
  }

  async findById(id: string): Promise<ApartmentEntity | null> {
    return await this.repository.findOne({
      where: { id },
      relations: ['building', 'residents'],
    });
  }

  async findByBuildingId(buildingId: string): Promise<ApartmentEntity[]> {
    return await this.repository.find({
      where: { buildingId },
      relations: ['residents'],
      order: { floor: 'ASC', number: 'ASC' },
    });
  }

  async findAll(): Promise<ApartmentEntity[]> {
    return await this.repository.find({
      relations: ['building'],
      order: { createdAt: 'DESC' },
    });
  }

  async findAllWithFilters(
    queryDto: ApartmentQueryDto,
  ): Promise<IPaginatedResult<ApartmentEntity>> {
    const queryBuilder = this.repository.createQueryBuilder('apartment');

    // Join with building for filtering and data
    queryBuilder.leftJoinAndSelect('apartment.building', 'building');
    queryBuilder.leftJoinAndSelect('apartment.residents', 'residents');

    // Apply search filters
    if (queryDto.search) {
      queryBuilder.andWhere(
        '(apartment.number ILIKE :search OR building.name ILIKE :search OR apartment.cashierNote ILIKE :search)',
        { search: `%${queryDto.search}%` },
      );
    }

    // Apply building filter
    if (queryDto.buildingId) {
      queryBuilder.andWhere('apartment.buildingId = :buildingId', {
        buildingId: queryDto.buildingId,
      });
    }

    // Apply type filter
    if (queryDto.type) {
      queryBuilder.andWhere('apartment.type = :type', { type: queryDto.type });
    }

    // Apply status filter
    if (queryDto.status) {
      queryBuilder.andWhere('apartment.status = :status', {
        status: queryDto.status,
      });
    }

    // Apply floor filter
    if (queryDto.floor !== undefined) {
      queryBuilder.andWhere('apartment.floor = :floor', {
        floor: queryDto.floor,
      });
    }

    // Apply debt filter
    if (queryDto.hasDebt !== undefined) {
      if (queryDto.hasDebt) {
        queryBuilder.andWhere('apartment.debt > 0');
      } else {
        queryBuilder.andWhere('(apartment.debt IS NULL OR apartment.debt = 0)');
      }
    }

    // Apply quadrature filters
    if (queryDto.minQuadrature !== undefined) {
      queryBuilder.andWhere('apartment.quadrature >= :minQuadrature', {
        minQuadrature: queryDto.minQuadrature,
      });
    }

    if (queryDto.maxQuadrature !== undefined) {
      queryBuilder.andWhere('apartment.quadrature <= :maxQuadrature', {
        maxQuadrature: queryDto.maxQuadrature,
      });
    }

    // Apply sorting
    const sortBy = queryDto.sortBy || 'createdAt';
    const sortOrder = queryDto.sortOrder || 'DESC';

    // Handle nested sorting for building name
    if (sortBy === 'buildingName') {
      queryBuilder.orderBy('building.name', sortOrder);
    } else {
      queryBuilder.orderBy(`apartment.${sortBy}`, sortOrder);
    }

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
    updateData: Partial<ApartmentEntity>,
  ): Promise<ApartmentEntity | null> {
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

  async existsByNumberAndBuilding(
    number: string,
    buildingId: string,
    excludeId?: string,
  ): Promise<boolean> {
    const queryBuilder = this.repository.createQueryBuilder('apartment');
    queryBuilder.where('apartment.number = :number', { number });
    queryBuilder.andWhere('apartment.buildingId = :buildingId', { buildingId });

    if (excludeId) {
      queryBuilder.andWhere('apartment.id != :excludeId', { excludeId });
    }

    const count = await queryBuilder.getCount();
    return count > 0;
  }

  async count(): Promise<number> {
    return await this.repository.count();
  }

  async countByBuilding(buildingId: string): Promise<number> {
    return await this.repository.count({ where: { buildingId } });
  }

  async countByStatus(buildingId?: string): Promise<Record<string, number>> {
    const queryBuilder = this.repository.createQueryBuilder('apartment');

    if (buildingId) {
      queryBuilder.where('apartment.buildingId = :buildingId', { buildingId });
    }

    queryBuilder
      .select('apartment.status', 'status')
      .addSelect('COUNT(*)', 'count')
      .groupBy('apartment.status');

    const results = await queryBuilder.getRawMany<{
      status: string;
      count: string;
    }>();

    return results.reduce(
      (acc, result) => {
        acc[result.status] = parseInt(result.count, 10);
        return acc;
      },
      {} as Record<string, number>,
    );
  }

  async getTotalDebt(buildingId?: string): Promise<number> {
    const queryBuilder = this.repository.createQueryBuilder('apartment');

    if (buildingId) {
      queryBuilder.where('apartment.buildingId = :buildingId', { buildingId });
    }

    queryBuilder.select('SUM(apartment.debt)', 'totalDebt');

    const result = await queryBuilder.getRawOne<{ totalDebt: string | null }>();
    return result?.totalDebt ? parseFloat(result.totalDebt) : 0;
  }

  async getTotalRevenue(buildingId?: string): Promise<number> {
    const queryBuilder = this.repository.createQueryBuilder('apartment');

    if (buildingId) {
      queryBuilder.where('apartment.buildingId = :buildingId', { buildingId });
    }

    queryBuilder
      .select('SUM(apartment.monthlyRent)', 'totalRent')
      .addSelect('SUM(apartment.maintenanceFee)', 'totalMaintenance');

    const result = await queryBuilder.getRawOne<{
      totalRent: string | null;
      totalMaintenance: string | null;
    }>();
    const totalRent = result?.totalRent ? parseFloat(result.totalRent) : 0;
    const totalMaintenance = result?.totalMaintenance
      ? parseFloat(result.totalMaintenance)
      : 0;

    return totalRent + totalMaintenance;
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
