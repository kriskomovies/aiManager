import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional, IsUUID, Min } from 'class-validator';
import { IInventoryTransferRequest } from '@repo/interfaces';

export class InventoryTransferDto implements IInventoryTransferRequest {
  @ApiProperty({
    description: 'Source inventory ID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsUUID()
  fromInventoryId: string;

  @ApiProperty({
    description: 'Target inventory ID',
    example: '550e8400-e29b-41d4-a716-446655440001',
  })
  @IsUUID()
  toInventoryId: string;

  @ApiProperty({
    description: 'Amount to transfer',
    example: 250.0,
  })
  @IsNumber()
  @Min(0.01)
  amount: number;

  @ApiProperty({
    description: 'Transfer description',
    example: 'Transfer for repair fund',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;
}
