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
  TaxGenerationPeriod,
  ICreateBuildingRequest,
} from '@repo/interfaces';

export class CreateBuildingDto implements ICreateBuildingRequest {
  @ApiProperty({
    description: 'Building name',
    example: 'Сграда Витоша',
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Building type',
    enum: BuildingType,
    example: BuildingType.RESIDENTIAL,
  })
  @IsEnum(BuildingType)
  type: BuildingType;

  // Address fields
  @ApiProperty({
    description: 'City',
    example: 'София',
  })
  @IsString()
  city: string;

  @ApiProperty({
    description: 'District',
    example: 'Център',
  })
  @IsString()
  district: string;

  @ApiProperty({
    description: 'Street',
    example: 'ул. Витоша',
  })
  @IsString()
  street: string;

  @ApiProperty({
    description: 'Building number',
    example: '15',
  })
  @IsString()
  number: string;

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
  })
  @IsString()
  postalCode: string;

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
  })
  @IsEnum(TaxGenerationPeriod)
  taxGenerationPeriod: TaxGenerationPeriod;

  @ApiProperty({
    description: 'Day of month for tax generation (1-31)',
    example: 15,
  })
  @IsNumber()
  @Min(1)
  @Max(31)
  taxGenerationDay: number;

  @ApiProperty({
    description: 'Homebook start date',
    example: '2024-01-01',
  })
  @IsDateString()
  homebookStartDate: string;

  // Features
  @ApiProperty({
    description: 'Whether invoice generation is enabled',
    example: false,
  })
  @IsBoolean()
  invoiceEnabled: boolean;

  @ApiProperty({
    description: 'Description of the building',
    example: 'Modern residential building with elevator',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

  // People with access - for now just store as array of IDs
  @ApiProperty({
    description: 'Array of user IDs who have access to this building',
    example: ['user1', 'user2'],
  })
  @IsArray()
  @IsString({ each: true })
  peopleWithAccess: string[];
}
