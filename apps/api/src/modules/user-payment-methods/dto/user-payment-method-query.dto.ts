import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsOptional, IsString, IsEnum, IsNumber, Min, Max, IsBoolean } from 'class-validator';
import { UserPaymentMethod, PaymentMethodStatus } from '@repo/interfaces';

export class UserPaymentMethodQueryDto {
  @ApiPropertyOptional({ description: 'Page number', example: 1, minimum: 1 })
  @IsOptional()
  @Transform(({ value }) => parseInt(String(value)))
  @IsNumber()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({ description: 'Items per page', example: 10, minimum: 1, maximum: 100 })
  @IsOptional()
  @Transform(({ value }) => parseInt(String(value)))
  @IsNumber()
  @Min(1)
  @Max(100)
  limit?: number = 10;

  @ApiPropertyOptional({ description: 'Field to sort by', example: 'displayName' })
  @IsOptional()
  @IsString()
  sortBy?: string = 'createdAt';

  @ApiPropertyOptional({ description: 'Sort order', enum: ['ASC', 'DESC'] })
  @IsOptional()
  @IsEnum(['ASC', 'DESC'])
  sortOrder?: 'ASC' | 'DESC' = 'DESC';

  @ApiPropertyOptional({ description: 'Search term', example: 'банка' })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ description: 'Filter by status', enum: PaymentMethodStatus })
  @IsOptional()
  @IsEnum(PaymentMethodStatus)
  status?: PaymentMethodStatus;

  @ApiPropertyOptional({ description: 'Filter by payment method', enum: UserPaymentMethod })
  @IsOptional()
  @IsEnum(UserPaymentMethod)
  method?: UserPaymentMethod;

  @ApiPropertyOptional({ description: 'Filter by default status', example: true })
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  isDefault?: boolean;
} 