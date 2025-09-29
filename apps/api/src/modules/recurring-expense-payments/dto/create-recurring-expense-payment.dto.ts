import {
  IsString,
  IsNumber,
  IsUUID,
  IsBoolean,
  IsOptional,
  IsDateString,
  IsEnum,
  IsNotEmpty,
  Min,
} from 'class-validator';

export class CreateRecurringExpensePaymentDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  amount: number;

  @IsUUID()
  recurringExpenseId: string;

  @IsUUID()
  userPaymentMethodId: string;

  @IsBoolean()
  connectPayment: boolean;

  @IsOptional()
  @IsUUID()
  monthlyFeeId?: string;

  @IsOptional()
  @IsString()
  reason?: string;

  @IsDateString()
  paymentDate: string;

  @IsBoolean()
  issueDocument: boolean;

  @IsOptional()
  @IsEnum(['invoice', 'receipt'])
  documentType?: 'invoice' | 'receipt';
}
