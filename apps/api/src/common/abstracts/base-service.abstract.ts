import { NotFoundException, ConflictException } from '@nestjs/common';
import { BaseEntity } from './base-entity.abstract';
import {
  BaseRepository,
  IPaginationOptions,
  IPaginatedResult,
} from './base-repository.abstract';

export abstract class BaseService<T extends BaseEntity> {
  constructor(protected readonly repository: BaseRepository<T>) {}

  async create(createDto: Partial<T>): Promise<T> {
    return await this.repository.create(createDto);
  }

  async findById(id: string): Promise<T> {
    const entity = await this.repository.findById(id);
    if (!entity) {
      throw new NotFoundException(`Entity with ID ${id} not found`);
    }
    return entity;
  }

  async findAll(options?: IPaginationOptions): Promise<IPaginatedResult<T>> {
    return await this.repository.findAll(options);
  }

  async update(id: string, updateDto: Partial<T>): Promise<T> {
    const exists = await this.repository.exists(id);
    if (!exists) {
      throw new NotFoundException(`Entity with ID ${id} not found`);
    }

    const updated = await this.repository.update(id, updateDto);
    if (!updated) {
      throw new NotFoundException(`Entity with ID ${id} not found`);
    }

    return updated;
  }

  async delete(id: string): Promise<void> {
    const exists = await this.repository.exists(id);
    if (!exists) {
      throw new NotFoundException(`Entity with ID ${id} not found`);
    }

    const deleted = await this.repository.delete(id);
    if (!deleted) {
      throw new ConflictException(`Failed to delete entity with ID ${id}`);
    }
  }

  async exists(id: string): Promise<boolean> {
    return await this.repository.exists(id);
  }
}
