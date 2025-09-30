import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IPaginatedResult } from '../../common/abstracts/base-repository.abstract';
import { UserEntity } from '../entities/user.entity';
import { IUserQueryParams } from '@repo/interfaces';

@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(UserEntity)
    private readonly repository: Repository<UserEntity>,
  ) {}

  async create(createData: Partial<UserEntity>): Promise<UserEntity> {
    const user = this.repository.create(createData);
    return await this.repository.save(user);
  }

  async findById(id: string, options?: any): Promise<UserEntity | null> {
    return await this.repository.findOne({
      where: { id },
      ...options,
    });
  }

  async findAll(): Promise<UserEntity[]> {
    return await this.repository.find({
      relations: ['role', 'resident'],
      order: { createdAt: 'DESC' },
    });
  }

  async update(
    id: string,
    updateData: Partial<UserEntity>,
  ): Promise<UserEntity | null> {
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

  // Custom methods specific to User

  async findByEmail(email: string): Promise<UserEntity | null> {
    return this.repository.findOne({
      where: { email },
      relations: ['role', 'resident'],
    });
  }

  async findAllWithFilters(
    queryParams: IUserQueryParams,
  ): Promise<IPaginatedResult<UserEntity>> {
    const {
      page = 1,
      limit = 10,
      search,
      roleId,
      status,
      buildingId,
      isResident,
      isUsingMobileApp,
    } = queryParams;

    const queryBuilder = this.repository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.role', 'role')
      .leftJoinAndSelect('user.resident', 'resident')
      .leftJoinAndSelect('resident.apartment', 'apartment');

    // Search filter
    if (search) {
      queryBuilder.andWhere(
        '(user.name ILIKE :search OR user.surname ILIKE :search OR user.email ILIKE :search)',
        { search: `%${search}%` },
      );
    }

    // Role filter
    if (roleId) {
      queryBuilder.andWhere('user.roleId = :roleId', { roleId });
    }

    // Status filter
    if (status) {
      queryBuilder.andWhere('user.status = :status', { status });
    }

    // Building access filter
    if (buildingId) {
      queryBuilder.andWhere(
        '(user.buildingAccess @> :buildingAccess OR apartment.buildingId = :buildingId OR role.name = :adminRole)',
        {
          buildingAccess: JSON.stringify([buildingId]),
          buildingId,
          adminRole: 'admin',
        },
      );
    }

    // Resident filter
    if (isResident !== undefined) {
      if (isResident) {
        queryBuilder.andWhere('user.residentId IS NOT NULL');
      } else {
        queryBuilder.andWhere('user.residentId IS NULL');
      }
    }

    // Mobile app usage filter
    if (isUsingMobileApp !== undefined) {
      queryBuilder.andWhere('user.isUsingMobileApp = :isUsingMobileApp', {
        isUsingMobileApp,
      });
    }

    // Default ordering
    queryBuilder.orderBy('user.createdAt', 'DESC');

    // Apply pagination
    const skip = (page - 1) * limit;
    queryBuilder.skip(skip).take(limit);

    const [data, total] = await queryBuilder.getManyAndCount();

    return this.createPaginatedResult(data, total, page, limit);
  }

  async findUsersByBuilding(buildingId: string): Promise<UserEntity[]> {
    return this.repository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.role', 'role')
      .leftJoinAndSelect('user.resident', 'resident')
      .leftJoinAndSelect('resident.apartment', 'apartment')
      .where(
        'user.buildingAccess @> :buildingAccess OR apartment.buildingId = :buildingId OR role.name = :adminRole',
        {
          buildingAccess: JSON.stringify([buildingId]),
          buildingId,
          adminRole: 'admin',
        },
      )
      .andWhere('user.status = :status', { status: 'active' })
      .getMany();
  }

  async findUsersByRole(roleName: string): Promise<UserEntity[]> {
    return this.repository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.role', 'role')
      .leftJoinAndSelect('user.resident', 'resident')
      .where('role.name = :roleName', { roleName })
      .andWhere('user.status = :status', { status: 'active' })
      .getMany();
  }

  async updateLastLogin(id: string): Promise<void> {
    await this.repository.update(id, {
      lastLoginAt: new Date(),
    });
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
