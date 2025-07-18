import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsBoolean } from 'class-validator';
import { IUpdateInventoryRequest } from '@repo/interfaces';

export class UpdateInventoryDto implements IUpdateInventoryRequest {
  @ApiProperty({
    description: 'Inventory name',
    example: 'Каса за Ремонти',
    required: false,
  })
  @IsString()
  @IsOptional()
  name?: string;

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
  visibleInApp?: boolean;
}
