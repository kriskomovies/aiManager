import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RecurringExpensesController } from './recurring-expenses.controller';
import { RecurringExpensesService } from './recurring-expenses.service';
import { RecurringExpenseRepository } from '../../database/repositories/recurring-expense.repository';
import { MonthlyFeeRepository } from '../../database/repositories/monthly-fee.repository';
import { RecurringExpenseEntity } from '../../database/entities/recurring-expense.entity';
import { MonthlyFeeEntity } from '../../database/entities/monthly-fee.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([RecurringExpenseEntity, MonthlyFeeEntity]),
  ],
  controllers: [RecurringExpensesController],
  providers: [
    RecurringExpensesService,
    RecurringExpenseRepository,
    MonthlyFeeRepository,
  ],
  exports: [RecurringExpensesService, RecurringExpenseRepository],
})
export class RecurringExpensesModule {}
