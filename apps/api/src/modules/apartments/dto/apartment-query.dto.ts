import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsOptional,
  IsString,
  IsEnum,
  IsNumber,
  IsUUID,
  IsBoolean,
  Min,
  Max,
} from 'class-validator';
import {
  ApartmentType,
  ApartmentStatus,
  IBackendApartmentQueryParams,
} from '@repo/interfaces';

export class ApartmentQueryDto implements IBackendApartmentQueryParams {
  @ApiPropertyOptional({
    description: 'Page number',
    example: 1,
    minimum: 1,
  })
  @IsOptional()
  @Transform(({ value }) => parseInt(String(value)))
  @IsNumber()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({
    description: 'Items per page',
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
    example: 'number',
  })
  @IsOptional()
  @IsString()
  sortBy?: string = 'createdAt';

  @ApiPropertyOptional({
    description: 'Sort order',
    enum: ['ASC', 'DESC'],
  })
  @IsOptional()
  @IsEnum(['ASC', 'DESC'])
  sortOrder?: 'ASC' | 'DESC' = 'DESC';

  @ApiPropertyOptional({
    description: 'Search term for apartment number, building name, or notes',
    example: 'apartment 12',
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
    description: 'Filter by apartment type',
    enum: ApartmentType,
    example: ApartmentType.APARTMENT,
  })
  @IsOptional()
  @IsEnum(ApartmentType)
  type?: ApartmentType;

  @ApiPropertyOptional({
    description: 'Filter by apartment status',
    enum: ApartmentStatus,
    example: ApartmentStatus.OCCUPIED,
  })
  @IsOptional()
  @IsEnum(ApartmentStatus)
  status?: ApartmentStatus;

  @ApiPropertyOptional({
    description: 'Filter by floor number',
    example: 3,
  })
  @IsOptional()
  @Transform(({ value }) => parseInt(String(value)))
  @IsNumber()
  @Min(0)
  floor?: number;

  @ApiPropertyOptional({
    description: 'Filter apartments with debt',
    example: true,
  })
  @IsOptional()
  @Transform(({ value }) => value === 'true')
  @IsBoolean()
  hasDebt?: boolean;

  @ApiPropertyOptional({
    description: 'Minimum quadrature filter',
    example: 50,
  })
  @IsOptional()
  @Transform(({ value }) => parseFloat(String(value)))
  @IsNumber()
  @Min(0)
  minQuadrature?: number;

  @ApiPropertyOptional({
    description: 'Maximum quadrature filter',
    example: 150,
  })
  @IsOptional()
  @Transform(({ value }) => parseFloat(String(value)))
  @IsNumber()
  @Min(0)
  maxQuadrature?: number;
}
