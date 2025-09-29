import {
  IsString,
  IsNumber,
  IsUUID,
  IsBoolean,
  IsOptional,
  IsDateString,
  IsEnum,
  Min,
} from 'class-validator';

export class UpdateRecurringExpensePaymentDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  amount?: number;

  @IsOptional()
  @IsUUID()
  userPaymentMethodId?: string;

  @IsOptional()
  @IsBoolean()
  connectPayment?: boolean;

  @IsOptional()
  @IsUUID()
  monthlyFeeId?: string;

  @IsOptional()
  @IsString()
  reason?: string;

  @IsOptional()
  @IsDateString()
  paymentDate?: string;

  @IsOptional()
  @IsBoolean()
  issueDocument?: boolean;

  @IsOptional()
  @IsEnum(['invoice', 'receipt'])
  documentType?: 'invoice' | 'receipt';
}
