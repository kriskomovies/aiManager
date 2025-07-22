import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsEnum,
  IsNumber,
  IsOptional,
  IsBoolean,
  IsArray,
  ValidateNested,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';
import {
  FeePaymentBasis,
  FeeApplicationMode,
  ICreateMonthlyFeeRequest,
} from '@repo/interfaces';

class MonthlyFeeApartmentDto {
  @ApiProperty({
    description: 'Apartment ID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsString()
  apartmentId: string;

  @ApiProperty({
    description: 'Coefficient for this apartment',
    example: 1.5,
  })
  @IsNumber()
  @Min(0)
  coefficient: number;

  @ApiProperty({
    description: 'Description for this apartment fee',
    example: 'Higher fee due to larger apartment',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    description: 'Whether this apartment is selected for fee application',
    example: true,
  })
  @IsBoolean()
  isSelected: boolean;
}

export class CreateMonthlyFeeDto implements ICreateMonthlyFeeRequest {
  @ApiProperty({
    description: 'Building ID this fee belongs to',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsString()
  buildingId: string;

  @ApiProperty({
    description: 'Fee name',
    example: 'Elevator Maintenance',
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Payment basis for the fee',
    enum: FeePaymentBasis,
    example: FeePaymentBasis.APARTMENT,
  })
  @IsEnum(FeePaymentBasis)
  paymentBasis: FeePaymentBasis;

  @ApiProperty({
    description: 'Application mode - monthly fee or total amount',
    enum: FeeApplicationMode,
    example: FeeApplicationMode.MONTHLY_FEE,
  })
  @IsEnum(FeeApplicationMode)
  applicationMode: FeeApplicationMode;

  @ApiProperty({
    description: 'Base amount for calculation',
    example: 25.5,
  })
  @IsNumber()
  @Min(0.01)
  baseAmount: number;

  @ApiProperty({
    description: 'Whether fee is distributed evenly among apartments',
    example: true,
  })
  @IsBoolean()
  isDistributedEvenly: boolean;

  @ApiProperty({
    description: 'Month this fee applies to (YYYY-MM format)',
    example: '2024-01',
    required: false,
  })
  @IsOptional()
  @IsString()
  targetMonth?: string;

  @ApiProperty({
    description: 'Apartment configurations for this fee',
    type: [MonthlyFeeApartmentDto],
    example: [
      {
        apartmentId: '550e8400-e29b-41d4-a716-446655440000',
        coefficient: 1.0,
        description: 'Standard apartment',
        isSelected: true,
      },
    ],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MonthlyFeeApartmentDto)
  apartments: MonthlyFeeApartmentDto[];
}
