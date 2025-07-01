import { BaseEntity } from './base-entity.abstract';

export interface IPaginationOptions {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
}

export interface IPaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export abstract class BaseRepository<T extends BaseEntity> {
  abstract create(entity: Partial<T>): Promise<T>;
  abstract findById(id: string): Promise<T | null>;
  abstract findAll(options?: IPaginationOptions): Promise<IPaginatedResult<T>>;
  abstract update(id: string, updates: Partial<T>): Promise<T | null>;
  abstract delete(id: string): Promise<boolean>;
  abstract exists(id: string): Promise<boolean>;

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
