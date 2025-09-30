import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BuildingsModule } from './modules/buildings/buildings.module';
import { ApartmentsModule } from './modules/apartments/apartments.module';
import { InventoriesModule } from './modules/inventories/inventories.module';
import { UserPaymentMethodsModule } from './modules/user-payment-methods/user-payment-methods.module';
import { OneTimeExpensesModule } from './modules/one-time-expenses/one-time-expenses.module';
import { RecurringExpensesModule } from './modules/recurring-expenses/recurring-expenses.module';
import { RecurringExpensePaymentsModule } from './modules/recurring-expense-payments/recurring-expense-payments.module';
import { MonthlyFeesModule } from './modules/monthly-fees/monthly-fees.module';
import { CalendarEventsModule } from './modules/calendar-events/calendar-events.module';
import { UsersModule } from './modules/users/users.module';
import databaseConfig from './config/database.config';

@Module({
  imports: [
    // Configuration module
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig],
      envFilePath: ['.env.local', '.env'],
    }),

    // TypeORM module
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) =>
        configService.get('database')!,
    }),

    // Feature modules
    BuildingsModule,
    ApartmentsModule,
    InventoriesModule,
    UserPaymentMethodsModule,
    OneTimeExpensesModule,
    RecurringExpensesModule,
    RecurringExpensePaymentsModule,
    MonthlyFeesModule,
    CalendarEventsModule,
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
