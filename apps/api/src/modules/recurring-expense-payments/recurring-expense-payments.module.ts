import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RecurringExpensePaymentsService } from './recurring-expense-payments.service';
import { RecurringExpensePaymentsController } from './recurring-expense-payments.controller';
import { RecurringExpensePaymentEntity } from '../../database/entities/recurring-expense-payment.entity';
import { RecurringExpensePaymentRepository } from '../../database/repositories/recurring-expense-payment.repository';
import { RecurringExpenseRepository } from '../../database/repositories/recurring-expense.repository';
import { UserPaymentMethodRepository } from '../../database/repositories/user-payment-method.repository';
import { MonthlyFeeRepository } from '../../database/repositories/monthly-fee.repository';
import { RecurringExpenseEntity } from '../../database/entities/recurring-expense.entity';
import { UserPaymentMethodEntity } from '../../database/entities/user-payment-method.entity';
import { MonthlyFeeEntity } from '../../database/entities/monthly-fee.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      RecurringExpensePaymentEntity,
      RecurringExpenseEntity,
      UserPaymentMethodEntity,
      MonthlyFeeEntity,
    ]),
  ],
  controllers: [RecurringExpensePaymentsController],
  providers: [
    RecurringExpensePaymentsService,
    RecurringExpensePaymentRepository,
    RecurringExpenseRepository,
    UserPaymentMethodRepository,
    MonthlyFeeRepository,
  ],
  exports: [RecurringExpensePaymentsService, RecurringExpensePaymentRepository],
})
export class RecurringExpensePaymentsModule {}
