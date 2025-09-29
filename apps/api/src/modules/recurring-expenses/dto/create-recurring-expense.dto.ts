import {
  IsString,
  IsNumber,
  IsBoolean,
  IsUUID,
  IsOptional,
  IsDateString,
  Min,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateRecurringExpenseDto {
  @ApiProperty({
    description: 'Building ID this recurring expense belongs to',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsUUID()
  buildingId: string;

  @ApiProperty({ description: 'Expense name', example: 'Elevator Maintenance' })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Monthly amount for this recurring expense',
    example: 585.0,
  })
  @IsNumber()
  @Min(0.01)
  monthlyAmount: number;

  @ApiProperty({
    description: 'User payment method ID used for this expense',
    example: 'user-payment-method-uuid',
  })
  @IsUUID()
  userPaymentMethodId: string;

  @ApiProperty({
    description:
      'Whether this recurring expense should be added as a new monthly fee',
    example: false,
  })
  @IsBoolean()
  addToMonthlyFees: boolean;

  @ApiProperty({
    description:
      'Linked monthly fee ID if this expense is linked to an existing monthly fee',
    example: '550e8400-e29b-41d4-a716-446655440000',
    required: false,
  })
  @IsOptional()
  @IsUUID()
  monthlyFeeId?: string;

  @ApiProperty({
    description: 'Contractor name',
    example: 'ABC Maintenance Ltd.',
    required: false,
  })
  @IsOptional()
  @IsString()
  contractor?: string;

  @ApiProperty({
    description: 'Payment date',
    example: '2024-01-15',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  paymentDate?: string;

  @ApiProperty({
    description: 'Reason/purpose for the expense',
    example: 'Monthly elevator maintenance',
    required: false,
  })
  @IsOptional()
  @IsString()
  reason?: string;
}
