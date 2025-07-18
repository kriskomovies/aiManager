import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserPaymentMethodEntity } from '../entities/user-payment-method.entity';
import { UserPaymentMethodQueryDto } from '../../modules/user-payment-methods/dto/user-payment-method-query.dto';
import { IPaginatedResult } from '../../common/abstracts/base-repository.abstract';
import { PaymentMethodStatus } from '@repo/interfaces';

@Injectable()
export class UserPaymentMethodRepository {
  constructor(
    @InjectRepository(UserPaymentMethodEntity)
    private readonly repository: Repository<UserPaymentMethodEntity>,
  ) {}

  async create(
    createData: Partial<UserPaymentMethodEntity>,
  ): Promise<UserPaymentMethodEntity> {
    const entity = this.repository.create(createData);
    return await this.repository.save(entity);
  }

  async findById(id: string): Promise<UserPaymentMethodEntity | null> {
    return await this.repository.findOne({ where: { id } });
  }

  async findAll(): Promise<UserPaymentMethodEntity[]> {
    return await this.repository.find({
      order: { createdAt: 'DESC' },
    });
  }

  async findAllActive(): Promise<UserPaymentMethodEntity[]> {
    return await this.repository.find({
      where: { status: PaymentMethodStatus.ACTIVE },
      order: { isDefault: 'DESC', displayName: 'ASC' },
    });
  }

  async findAllWithFilters(
    queryDto: UserPaymentMethodQueryDto,
  ): Promise<IPaginatedResult<UserPaymentMethodEntity>> {
    const queryBuilder =
      this.repository.createQueryBuilder('userPaymentMethod');

    // Apply search filters
    if (queryDto.search) {
      queryBuilder.andWhere(
        '(userPaymentMethod.displayName ILIKE :search OR userPaymentMethod.description ILIKE :search)',
        { search: `%${queryDto.search}%` },
      );
    }

    // Apply status filter
    if (queryDto.status) {
      queryBuilder.andWhere('userPaymentMethod.status = :status', {
        status: queryDto.status,
      });
    }

    // Apply method filter
    if (queryDto.method) {
      queryBuilder.andWhere('userPaymentMethod.method = :method', {
        method: queryDto.method,
      });
    }

    // Apply isDefault filter
    if (queryDto.isDefault !== undefined) {
      queryBuilder.andWhere('userPaymentMethod.isDefault = :isDefault', {
        isDefault: queryDto.isDefault,
      });
    }

    // Apply sorting
    const sortBy = queryDto.sortBy || 'createdAt';
    const sortOrder = queryDto.sortOrder || 'DESC';
    queryBuilder.orderBy(`userPaymentMethod.${sortBy}`, sortOrder);

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
    updateData: Partial<UserPaymentMethodEntity>,
  ): Promise<UserPaymentMethodEntity | null> {
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
