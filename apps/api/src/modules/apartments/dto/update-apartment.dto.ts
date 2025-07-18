import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsEnum,
  IsNumber,
  IsBoolean,
  IsOptional,
  IsArray,
  ValidateNested,
  IsUUID,
  Min,
  IsEmail,
} from 'class-validator';
import { Type } from 'class-transformer';
import {
  ApartmentType,
  ApartmentStatus,
  ResidentRole,
  IUpdateApartmentRequest,
} from '@repo/interfaces';

export class UpdateResidentDto {
  @ApiProperty({
    description: 'Resident ID (optional - omit for new residents)',
    example: '550e8400-e29b-41d4-a716-446655440000',
    required: false,
  })
  @IsOptional()
  @IsUUID()
  id?: string;

  @ApiProperty({ description: 'Resident first name', example: 'John' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'Resident surname', example: 'Doe' })
  @IsString()
  surname: string;

  @ApiProperty({
    description: 'Resident phone number',
    example: '+359888123456',
  })
  @IsString()
  phone: string;

  @ApiProperty({
    description: 'Resident email address',
    example: 'john.doe@example.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Resident role',
    enum: ResidentRole,
    example: ResidentRole.OWNER,
  })
  @IsEnum(ResidentRole)
  role: ResidentRole;

  @ApiProperty({
    description: 'Whether this resident is the main contact',
    example: true,
  })
  @IsBoolean()
  isMainContact: boolean;
}

export class UpdateApartmentDto implements IUpdateApartmentRequest {
  @ApiProperty({
    description: 'Apartment type',
    enum: ApartmentType,
    example: ApartmentType.APARTMENT,
    required: false,
  })
  @IsOptional()
  @IsEnum(ApartmentType)
  type?: ApartmentType;

  @ApiProperty({
    description: 'Apartment number',
    example: '12A',
    required: false,
  })
  @IsOptional()
  @IsString()
  number?: string;

  @ApiProperty({
    description: 'Floor number',
    example: 3,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  floor?: number;

  @ApiProperty({
    description: 'Apartment quadrature in square meters',
    example: 85.5,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  quadrature?: number;

  @ApiProperty({
    description: 'Common parts area in square meters',
    example: 12.5,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  commonParts?: number;

  @ApiProperty({
    description: 'Ideal parts area in square meters',
    example: 8.3,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  idealParts?: number;

  @ApiProperty({
    description: 'Number of residents',
    example: 3,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  residentsCount?: number;

  @ApiProperty({
    description: 'Number of pets',
    example: 1,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  pets?: number;

  @ApiProperty({
    description: 'Apartment status',
    enum: ApartmentStatus,
    example: ApartmentStatus.OCCUPIED,
    required: false,
  })
  @IsOptional()
  @IsEnum(ApartmentStatus)
  status?: ApartmentStatus;

  @ApiProperty({
    description: 'Whether invoice generation is enabled',
    example: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  invoiceEnabled?: boolean;

  @ApiProperty({
    description: 'Whether apartment is blocked for payment',
    example: false,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  blockForPayment?: boolean;

  @ApiProperty({
    description: 'Note visible to cashier',
    example: 'Special payment arrangement',
    required: false,
  })
  @IsOptional()
  @IsString()
  cashierNote?: string;

  @ApiProperty({
    description: 'Monthly rent amount',
    example: 800,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  monthlyRent?: number;

  @ApiProperty({
    description: 'Monthly maintenance fee',
    example: 50,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  maintenanceFee?: number;

  @ApiProperty({
    description: 'Current debt amount',
    example: 150,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  debt?: number;

  @ApiProperty({
    description:
      'Residents data - include ID for existing residents, omit for new ones',
    type: [UpdateResidentDto],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateResidentDto)
  residents?: UpdateResidentDto[];
}
