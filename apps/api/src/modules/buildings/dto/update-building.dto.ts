import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsEnum,
  IsNumber,
  IsOptional,
  IsBoolean,
  IsArray,
  Min,
  Max,
  IsDateString,
} from 'class-validator';
import {
  BuildingType,
  BuildingStatus,
  TaxGenerationPeriod,
} from '@repo/interfaces';

export class UpdateBuildingDto {
  @ApiProperty({
    description: 'Building name',
    example: 'Сграда Витоша',
    required: false,
  })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({
    description: 'Building type',
    enum: BuildingType,
    example: BuildingType.RESIDENTIAL,
    required: false,
  })
  @IsEnum(BuildingType)
  @IsOptional()
  type?: BuildingType;

  @ApiProperty({
    description: 'Building status',
    enum: BuildingStatus,
    example: BuildingStatus.ACTIVE,
    required: false,
  })
  @IsEnum(BuildingStatus)
  @IsOptional()
  status?: BuildingStatus;

  // Address fields
  @ApiProperty({
    description: 'City',
    example: 'София',
    required: false,
  })
  @IsString()
  @IsOptional()
  city?: string;

  @ApiProperty({
    description: 'District',
    example: 'Център',
    required: false,
  })
  @IsString()
  @IsOptional()
  district?: string;

  @ApiProperty({
    description: 'Street',
    example: 'ул. Витоша',
    required: false,
  })
  @IsString()
  @IsOptional()
  street?: string;

  @ApiProperty({
    description: 'Building number',
    example: '15',
    required: false,
  })
  @IsString()
  @IsOptional()
  number?: string;

  @ApiProperty({
    description: 'Entrance',
    example: 'А',
    required: false,
  })
  @IsString()
  @IsOptional()
  entrance?: string;

  @ApiProperty({
    description: 'Postal code',
    example: '1000',
    required: false,
  })
  @IsString()
  @IsOptional()
  postalCode?: string;

  // Physical properties
  @ApiProperty({
    description: 'Common parts area in square meters',
    example: 150.5,
    required: false,
  })
  @IsNumber()
  @Min(0)
  @IsOptional()
  commonPartsArea?: number;

  @ApiProperty({
    description: 'Total building area in square meters',
    example: 2500,
    required: false,
  })
  @IsNumber()
  @Min(0)
  @IsOptional()
  quadrature?: number;

  @ApiProperty({
    description: 'Number of parking slots',
    example: 24,
    required: false,
  })
  @IsNumber()
  @Min(0)
  @IsOptional()
  parkingSlots?: number;

  @ApiProperty({
    description: 'Number of basements',
    example: 1,
    required: false,
  })
  @IsNumber()
  @Min(0)
  @IsOptional()
  basements?: number;

  // Tax settings
  @ApiProperty({
    description: 'Tax generation period',
    enum: TaxGenerationPeriod,
    example: TaxGenerationPeriod.MONTHLY,
    required: false,
  })
  @IsEnum(TaxGenerationPeriod)
  @IsOptional()
  taxGenerationPeriod?: TaxGenerationPeriod;

  @ApiProperty({
    description: 'Day of month for tax generation (1-31)',
    example: 15,
    required: false,
  })
  @IsNumber()
  @Min(1)
  @Max(31)
  @IsOptional()
  taxGenerationDay?: number;

  @ApiProperty({
    description: 'Homebook start date',
    example: '2024-01-01',
    required: false,
  })
  @IsDateString()
  @IsOptional()
  homebookStartDate?: string;

  // Features
  @ApiProperty({
    description: 'Whether invoice generation is enabled',
    example: false,
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  invoiceEnabled?: boolean;

  @ApiProperty({
    description: 'Description of the building',
    example: 'Modern residential building with elevator',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

  // People with access
  @ApiProperty({
    description: 'Array of user IDs who have access to this building',
    example: ['user1', 'user2'],
    required: false,
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  peopleWithAccess?: string[];
}
