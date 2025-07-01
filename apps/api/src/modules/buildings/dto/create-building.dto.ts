import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsEnum,
  IsNumber,
  IsOptional,
  IsEmail,
  IsPhoneNumber,
  Min,
  Max,
  IsDateString,
} from 'class-validator';
import {
  BuildingType,
  BuildingStatus,
  TaxGenerationPeriod,
} from '@repo/interfaces';

export class CreateBuildingDto {
  @ApiProperty({
    description: 'Building name',
    example: 'Sunset Apartments',
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Building address',
    example: '123 Main Street, City, State 12345',
  })
  @IsString()
  address: string;

  @ApiProperty({
    description: 'Type of building',
    enum: BuildingType,
    example: BuildingType.RESIDENTIAL,
  })
  @IsEnum(BuildingType)
  type: BuildingType;

  @ApiProperty({
    description: 'Current status of the building',
    enum: BuildingStatus,
    example: BuildingStatus.ACTIVE,
    required: false,
  })
  @IsEnum(BuildingStatus)
  @IsOptional()
  status?: BuildingStatus = BuildingStatus.ACTIVE;

  @ApiProperty({
    description: 'Total number of units/apartments',
    example: 24,
    minimum: 1,
    maximum: 10000,
  })
  @IsNumber()
  @Min(1)
  @Max(10000)
  totalUnits: number;

  @ApiProperty({
    description: 'Number of occupied units',
    example: 20,
    minimum: 0,
  })
  @IsNumber()
  @Min(0)
  occupiedUnits: number;

  @ApiProperty({
    description: 'Monthly rental income in cents',
    example: 48000,
    minimum: 0,
  })
  @IsNumber()
  @Min(0)
  monthlyRental: number;

  @ApiProperty({
    description: 'Tax generation period',
    enum: TaxGenerationPeriod,
    example: TaxGenerationPeriod.MONTHLY,
  })
  @IsEnum(TaxGenerationPeriod)
  taxGenerationPeriod: TaxGenerationPeriod;

  @ApiProperty({
    description: 'Date when next tax is due',
    example: '2024-02-01T00:00:00Z',
  })
  @IsDateString()
  nextTaxDate: string;

  @ApiProperty({
    description: 'Building manager name',
    example: 'John Smith',
    required: false,
  })
  @IsString()
  @IsOptional()
  managerName?: string;

  @ApiProperty({
    description: 'Manager contact phone',
    example: '+1234567890',
    required: false,
  })
  @IsPhoneNumber()
  @IsOptional()
  managerPhone?: string;

  @ApiProperty({
    description: 'Manager email address',
    example: 'manager@example.com',
    required: false,
  })
  @IsEmail()
  @IsOptional()
  managerEmail?: string;

  @ApiProperty({
    description: 'Additional notes about the building',
    example: 'Recently renovated lobby',
    required: false,
  })
  @IsString()
  @IsOptional()
  notes?: string;
}
