import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { UserEntity } from '../../database/entities/user.entity';
import { UserRepository } from '../../database/repositories/user.repository';
import { UserRoleRepository } from '../../database/repositories/user-role.repository';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserQueryDto } from './dto/user-query.dto';
import { IPaginatedResult } from '../../common/abstracts/base-repository.abstract';
// Local UserStatus enum since import is not resolving
enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  SUSPENDED = 'suspended',
}
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly userRoleRepository: UserRoleRepository,
  ) {}

  async create(createDto: CreateUserDto): Promise<UserEntity> {
    // Check if email already exists
    const existingUser = await this.userRepository.findByEmail(createDto.email);
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    // Validate role exists
    const role = await this.userRoleRepository.findById(createDto.roleId);
    if (!role) {
      throw new NotFoundException(`Role with ID ${createDto.roleId} not found`);
    }

    // Hash password
    const passwordHash: string = await bcrypt.hash(createDto.password, 12);

    const userData: Partial<UserEntity> = {
      ...createDto,
      passwordHash,
      status: UserStatus.ACTIVE,
    };

    return await this.userRepository.create(userData);
  }

  async findById(id: string): Promise<UserEntity> {
    const user = await this.userRepository.findById(id, {
      relations: ['role', 'resident', 'resident.apartment'],
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return user;
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    return this.userRepository.findByEmail(email);
  }

  async update(id: string, updateDto: UpdateUserDto): Promise<UserEntity> {
    const user = await this.findById(id);

    // Check if email is being changed and doesn't conflict
    if (updateDto.email && updateDto.email !== user.email) {
      const existingUser = await this.userRepository.findByEmail(
        updateDto.email,
      );
      if (existingUser) {
        throw new ConflictException('User with this email already exists');
      }
    }

    // Validate role if being changed
    if (updateDto.roleId) {
      const role = await this.userRoleRepository.findById(updateDto.roleId);
      if (!role) {
        throw new NotFoundException(
          `Role with ID ${updateDto.roleId} not found`,
        );
      }
    }

    const updated = await this.userRepository.update(id, updateDto);
    if (!updated) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return updated;
  }

  async delete(id: string): Promise<void> {
    const user = await this.findById(id);

    // Prevent deletion of admin users (optional business rule)
    if (user.role.name === 'admin') {
      throw new BadRequestException('Cannot delete admin users');
    }

    await this.userRepository.delete(id);
  }

  async findAll(queryDto: UserQueryDto): Promise<IPaginatedResult<UserEntity>> {
    return this.userRepository.findAllWithFilters(queryDto);
  }

  async findUsersByBuilding(buildingId: string): Promise<UserEntity[]> {
    return this.userRepository.findUsersByBuilding(buildingId);
  }

  async findUsersByRole(roleName: string): Promise<UserEntity[]> {
    return this.userRepository.findUsersByRole(roleName);
  }

  async getAllRoles(): Promise<any[]> {
    return this.userRoleRepository.findActiveRoles();
  }

  async changePassword(
    id: string,
    currentPassword: string,
    newPassword: string,
  ): Promise<void> {
    const user = await this.userRepository.findById(id, {
      select: ['id', 'passwordHash'],
    });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    // Verify current password
    const isCurrentPasswordValid: boolean = await bcrypt.compare(
      currentPassword,
      user.passwordHash,
    );
    if (!isCurrentPasswordValid) {
      throw new BadRequestException('Current password is incorrect');
    }

    // Hash new password
    const newPasswordHash: string = await bcrypt.hash(newPassword, 12);

    await this.userRepository.update(id, {
      passwordHash: newPasswordHash,
    } as Partial<UserEntity>);
  }

  async updateLastLogin(id: string): Promise<void> {
    await this.userRepository.updateLastLogin(id);
  }
}
