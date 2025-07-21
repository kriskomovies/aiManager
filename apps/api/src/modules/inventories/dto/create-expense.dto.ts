import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional, IsUUID, Min } from 'class-validator';

export class CreateExpenseDto {
  @ApiProperty({
    description: 'Source inventory ID to deduct money from',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsUUID()
  sourceInventoryId: string;

  @ApiProperty({
    description: 'User payment method ID',
    example: '550e8400-e29b-41d4-a716-446655440001',
  })
  @IsUUID()
  userPaymentMethodId: string;

  @ApiProperty({
    description: 'Expense amount',
    example: 250.0,
  })
  @IsNumber()
  @Min(0.01)
  amount: number;

  @ApiProperty({
    description: 'Expense description/note',
    example: 'Office supplies purchase',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;
}
