import { Injectable, NotFoundException } from '@nestjs/common';
import { UserPaymentMethodEntity } from '../../database/entities/user-payment-method.entity';
import { UserPaymentMethodRepository } from '../../database/repositories/user-payment-method.repository';
import { CreateUserPaymentMethodDto } from './dto/create-user-payment-method.dto';
import { UpdateUserPaymentMethodDto } from './dto/update-user-payment-method.dto';
import { UserPaymentMethodQueryDto } from './dto/user-payment-method-query.dto';
import { IPaginatedResult } from '../../common/abstracts/base-repository.abstract';

@Injectable()
export class UserPaymentMethodsService {
  constructor(
    private readonly userPaymentMethodRepository: UserPaymentMethodRepository,
  ) {}

  async createUserPaymentMethod(
    createUserPaymentMethodDto: CreateUserPaymentMethodDto,
  ): Promise<UserPaymentMethodEntity> {
    // Transform DTO to entity data with proper type conversions
    const userPaymentMethodData: Partial<UserPaymentMethodEntity> = {
      method: createUserPaymentMethodDto.method,
      displayName: createUserPaymentMethodDto.displayName,
      description: createUserPaymentMethodDto.description,
      status: createUserPaymentMethodDto.status,
      isDefault: createUserPaymentMethodDto.isDefault ?? false,
    };

    return await this.userPaymentMethodRepository.create(userPaymentMethodData);
  }

  async findById(id: string): Promise<UserPaymentMethodEntity> {
    const userPaymentMethod = await this.userPaymentMethodRepository.findById(id);
    if (!userPaymentMethod) {
      throw new NotFoundException(`User payment method with ID ${id} not found`);
    }
    return userPaymentMethod;
  }

  async findAllActive(): Promise<UserPaymentMethodEntity[]> {
    return await this.userPaymentMethodRepository.findAllActive();
  }

  async findAllUserPaymentMethods(
    queryDto: UserPaymentMethodQueryDto,
  ): Promise<IPaginatedResult<UserPaymentMethodEntity>> {
    return await this.userPaymentMethodRepository.findAllWithFilters(queryDto);
  }

  async updateUserPaymentMethod(
    id: string,
    updateUserPaymentMethodDto: UpdateUserPaymentMethodDto,
  ): Promise<UserPaymentMethodEntity> {
    // Check if entity exists
    await this.findById(id);

    // Transform DTO to entity data
    const updateData: Partial<UserPaymentMethodEntity> = {
      displayName: updateUserPaymentMethodDto.displayName,
      description: updateUserPaymentMethodDto.description,
      status: updateUserPaymentMethodDto.status,
      isDefault: updateUserPaymentMethodDto.isDefault,
    };

    const updated = await this.userPaymentMethodRepository.update(id, updateData);
    if (!updated) {
      throw new NotFoundException(`User payment method with ID ${id} not found`);
    }
    return updated;
  }

  async deleteUserPaymentMethod(id: string): Promise<void> {
    const exists = await this.userPaymentMethodRepository.exists(id);
    if (!exists) {
      throw new NotFoundException(`User payment method with ID ${id} not found`);
    }

    const deleted = await this.userPaymentMethodRepository.delete(id);
    if (!deleted) {
      throw new NotFoundException(
        `Failed to delete user payment method with ID ${id}`,
      );
    }
  }
} 