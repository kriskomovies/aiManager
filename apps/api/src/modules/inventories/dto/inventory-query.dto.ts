import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsOptional,
  IsString,
  IsBoolean,
  IsNumber,
  IsUUID,
  Min,
  Max,
} from 'class-validator';
import { IBackendQueryParams } from '@repo/interfaces';

export class InventoryQueryDto implements IBackendQueryParams {
  @ApiPropertyOptional({
    description: 'Page number for pagination',
    example: 1,
    minimum: 1,
  })
  @IsOptional()
  @Transform(({ value }) => parseInt(String(value)))
  @IsNumber()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({
    description: 'Number of items per page',
    example: 10,
    minimum: 1,
    maximum: 100,
  })
  @IsOptional()
  @Transform(({ value }) => parseInt(String(value)))
  @IsNumber()
  @Min(1)
  @Max(100)
  limit?: number = 10;

  @ApiPropertyOptional({
    description: 'Field to sort by',
    example: 'name',
  })
  @IsOptional()
  @IsString()
  sortBy?: string = 'createdAt';

  @ApiPropertyOptional({
    description: 'Sort order',
    enum: ['ASC', 'DESC'],
    example: 'DESC',
  })
  @IsOptional()
  @IsString()
  sortOrder?: 'ASC' | 'DESC' = 'DESC';

  @ApiPropertyOptional({
    description: 'Search term for inventory name, title, or description',
    example: 'repair',
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({
    description: 'Filter by building ID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsOptional()
  @IsUUID()
  buildingId?: string;

  @ApiPropertyOptional({
    description: 'Filter by main inventory status',
    example: false,
  })
  @IsOptional()
  @Transform(({ value }) => value === 'true')
  @IsBoolean()
  isMain?: boolean;

  @ApiPropertyOptional({
    description: 'Filter by visibility in app',
    example: true,
  })
  @IsOptional()
  @Transform(({ value }) => value === 'true')
  @IsBoolean()
  visibleInApp?: boolean;

  @ApiPropertyOptional({
    description: 'Transaction type filter',
    example: 'TRANSFER',
  })
  @IsOptional()
  @IsString()
  type?: string;

  @ApiPropertyOptional({
    description: 'Filter transactions from date',
    example: '2024-01-01',
  })
  @IsOptional()
  @IsString()
  fromDate?: string;

  @ApiPropertyOptional({
    description: 'Filter transactions to date',
    example: '2024-12-31',
  })
  @IsOptional()
  @IsString()
  toDate?: string;
}
