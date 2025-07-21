import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsNumber,
  IsUUID,
  IsDateString,
  Min,
} from 'class-validator';

export class CreateOneTimeExpenseDto {
  @ApiProperty({ description: 'Expense name', example: 'Repair fee' })
  @IsString()
  name: string;

  @ApiPropertyOptional({
    description: 'Contragent ID',
    example: 'contragent-uuid',
  })
  @IsOptional()
  @IsUUID()
  contragentId?: string | null;

  @ApiProperty({
    description: 'Expense date',
    example: '2024-07-18T17:27:44.895Z',
  })
  @IsDateString()
  expenseDate: string;

  @ApiProperty({ description: 'Amount', example: 100.5 })
  @IsNumber()
  @Min(0)
  amount: number;

  @ApiProperty({ description: 'Inventory ID', example: 'inventory-uuid' })
  @IsUUID()
  inventoryId: string;

  @ApiProperty({
    description: 'User payment method ID',
    example: 'user-payment-method-uuid',
  })
  @IsUUID()
  userPaymentMethodId: string;

  @ApiPropertyOptional({
    description: 'Note',
    example: 'Paid for urgent repair',
  })
  @IsOptional()
  @IsString()
  note?: string;
}
