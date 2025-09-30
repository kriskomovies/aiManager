import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserRoleEntity } from '../entities/user-role.entity';
import { IPaginatedResult } from '../../common/abstracts/base-repository.abstract';

@Injectable()
export class UserRoleRepository {
  constructor(
    @InjectRepository(UserRoleEntity)
    private readonly repository: Repository<UserRoleEntity>,
  ) {}

  async create(createData: Partial<UserRoleEntity>): Promise<UserRoleEntity> {
    const userRole = this.repository.create(createData);
    return await this.repository.save(userRole);
  }

  async findById(id: string): Promise<UserRoleEntity | null> {
    return await this.repository.findOne({ where: { id } });
  }

  async findAll(): Promise<UserRoleEntity[]> {
    return await this.repository.find({
      order: { name: 'ASC' },
    });
  }

  async update(
    id: string,
    updateData: Partial<UserRoleEntity>,
  ): Promise<UserRoleEntity | null> {
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

  // Custom methods specific to UserRole
  async findByName(name: string): Promise<UserRoleEntity | null> {
    return this.repository.findOne({
      where: { name },
      relations: ['users'],
    });
  }

  async findActiveRoles(): Promise<UserRoleEntity[]> {
    return this.repository.find({
      where: { isActive: true },
      order: { name: 'ASC' },
    });
  }

  async findSystemRoles(): Promise<UserRoleEntity[]> {
    return this.repository.find({
      where: { isSystem: true },
      order: { name: 'ASC' },
    });
  }

  async getRoleWithUserCount(
    id: string,
  ): Promise<(UserRoleEntity & { userCount: number }) | null> {
    const role = await this.repository
      .createQueryBuilder('role')
      .leftJoinAndSelect('role.users', 'users')
      .loadRelationCountAndMap('role.userCount', 'role.users')
      .where('role.id = :id', { id })
      .getOne();

    return role as UserRoleEntity & { userCount: number };
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
