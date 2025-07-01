import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsOptional,
  IsString,
  IsEnum,
  IsNumber,
  Min,
  Max,
} from 'class-validator';
import { BuildingType, BuildingStatus } from '@repo/interfaces';

export class BuildingQueryDto {
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
  @IsEnum(['ASC', 'DESC'])
  sortOrder?: 'ASC' | 'DESC' = 'DESC';

  @ApiPropertyOptional({
    description: 'Search term for building name or address',
    example: 'sunset',
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({
    description: 'Filter by building type',
    enum: BuildingType,
    example: BuildingType.RESIDENTIAL,
  })
  @IsOptional()
  @IsEnum(BuildingType)
  type?: BuildingType;

  @ApiPropertyOptional({
    description: 'Filter by building status',
    enum: BuildingStatus,
    example: BuildingStatus.ACTIVE,
  })
  @IsOptional()
  @IsEnum(BuildingStatus)
  status?: BuildingStatus;

  @ApiPropertyOptional({
    description: 'Filter by minimum occupancy rate',
    example: 80,
    minimum: 0,
    maximum: 100,
  })
  @IsOptional()
  @Transform(({ value }) => parseInt(String(value)))
  @IsNumber()
  @Min(0)
  @Max(100)
  minOccupancyRate?: number;

  @ApiPropertyOptional({
    description: 'Filter by maximum occupancy rate',
    example: 100,
    minimum: 0,
    maximum: 100,
  })
  @IsOptional()
  @Transform(({ value }) => parseInt(String(value)))
  @IsNumber()
  @Min(0)
  @Max(100)
  maxOccupancyRate?: number;
}
