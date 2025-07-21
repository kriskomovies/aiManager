import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OneTimeExpensesController } from './one-time-expenses.controller';
import { OneTimeExpensesService } from './one-time-expenses.service';
import { OneTimeExpenseRepository } from '../../database/repositories/one-time-expense.repository';
import { OneTimeExpenseEntity } from '../../database/entities/one-time-expense.entity';

@Module({
  imports: [TypeOrmModule.forFeature([OneTimeExpenseEntity])],
  controllers: [OneTimeExpensesController],
  providers: [OneTimeExpensesService, OneTimeExpenseRepository],
  exports: [OneTimeExpensesService, OneTimeExpenseRepository],
})
export class OneTimeExpensesModule {}
