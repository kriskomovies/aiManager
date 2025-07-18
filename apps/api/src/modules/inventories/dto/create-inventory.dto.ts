import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNumber,
  IsOptional,
  IsBoolean,
  IsUUID,
  Min,
} from 'class-validator';
import { ICreateInventoryRequest } from '@repo/interfaces';

export class CreateInventoryDto implements ICreateInventoryRequest {
  @ApiProperty({
    description: 'Building ID this inventory belongs to',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsUUID()
  buildingId: string;

  @ApiProperty({
    description: 'Inventory name',
    example: 'Каса за Ремонти',
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Inventory title',
    example: 'Каса за Ремонти и Поддръжка',
    required: false,
  })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiProperty({
    description: 'Inventory description',
    example: 'Специализирана каса за ремонтни дейности и поддръжка на сградата',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: 'Whether inventory is visible in the application',
    example: true,
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  visibleInApp?: boolean = true;

  @ApiProperty({
    description: 'Initial amount for the inventory',
    example: 0,
    required: false,
  })
  @IsNumber()
  @Min(0)
  @IsOptional()
  initialAmount?: number = 0;
}
