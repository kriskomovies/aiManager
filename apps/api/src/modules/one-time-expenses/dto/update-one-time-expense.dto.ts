import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsNumber,
  IsUUID,
  IsDateString,
  Min,
} from 'class-validator';

export class UpdateOneTimeExpenseDto {
  @ApiPropertyOptional({ description: 'Expense name', example: 'Repair fee' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({
    description: 'Contragent ID',
    example: 'contragent-uuid',
  })
  @IsOptional()
  @IsUUID()
  contragentId?: string | null;

  @ApiPropertyOptional({
    description: 'Expense date',
    example: '2024-07-18T17:27:44.895Z',
  })
  @IsOptional()
  @IsDateString()
  expenseDate?: string;

  @ApiPropertyOptional({ description: 'Amount', example: 100.5 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  amount?: number;

  @ApiPropertyOptional({
    description: 'Inventory ID',
    example: 'inventory-uuid',
  })
  @IsOptional()
  @IsUUID()
  inventoryId?: string;

  @ApiPropertyOptional({
    description: 'User payment method ID',
    example: 'user-payment-method-uuid',
  })
  @IsOptional()
  @IsUUID()
  userPaymentMethodId?: string;

  @ApiPropertyOptional({
    description: 'Note',
    example: 'Paid for urgent repair',
  })
  @IsOptional()
  @IsString()
  note?: string;
}
