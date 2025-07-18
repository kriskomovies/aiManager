import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEnum, IsOptional, IsBoolean } from 'class-validator';
import { PaymentMethodStatus } from '@repo/interfaces';

export class UpdateUserPaymentMethodDto {
  @ApiProperty({
    description: 'Display name for the payment method',
    example: 'Плащане по сметка',
    required: false,
  })
  @IsString()
  @IsOptional()
  displayName?: string;

  @ApiProperty({
    description: 'Payment method description',
    example: 'Банково плащане по сметка',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    description: 'Payment method status',
    enum: PaymentMethodStatus,
    example: PaymentMethodStatus.ACTIVE,
    required: false,
  })
  @IsOptional()
  @IsEnum(PaymentMethodStatus)
  status?: PaymentMethodStatus;

  @ApiProperty({
    description: 'Whether this is the default payment method',
    example: false,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  isDefault?: boolean;
} 