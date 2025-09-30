import { registerAs } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { BuildingEntity } from '../database/entities/building.entity';
import { ApartmentEntity } from '../database/entities/apartment.entity';
import { ResidentEntity } from '../database/entities/resident.entity';
import { InventoryEntity } from '../database/entities/inventory.entity';
import { InventoryTransactionEntity } from '../database/entities/inventory-transaction.entity';
import { TenantPaymentMethodEntity } from '../database/entities/tenant-payment-method.entity';
import { UserPaymentMethodEntity } from '../database/entities/user-payment-method.entity';
import { OneTimeExpenseEntity } from '../database/entities/one-time-expense.entity';
import { RecurringExpenseEntity } from '../database/entities/recurring-expense.entity';
import { RecurringExpensePaymentEntity } from '../database/entities/recurring-expense-payment.entity';
import { MonthlyFeeEntity } from '../database/entities/monthly-fee.entity';
import { MonthlyFeeApartmentEntity } from '../database/entities/monthly-fee-apartment.entity';
import { ApartmentMonthlyPaymentEntity } from '../database/entities/apartment-monthly-payment.entity';
import { CalendarEventEntity } from '../database/entities/calendar-event.entity';
import { UserEntity } from '../database/entities/user.entity';
import { UserRoleEntity } from '../database/entities/user-role.entity';

export default registerAs(
  'database',
  (): TypeOrmModuleOptions => ({
    type: 'postgres',
    url: process.env.DATABASE_URL,
    entities: [
      UserEntity,
      UserRoleEntity,
      BuildingEntity,
      ApartmentEntity,
      ResidentEntity,
      InventoryEntity,
      InventoryTransactionEntity,
      TenantPaymentMethodEntity,
      UserPaymentMethodEntity,
      OneTimeExpenseEntity,
      RecurringExpenseEntity,
      RecurringExpensePaymentEntity,
      MonthlyFeeEntity,
      MonthlyFeeApartmentEntity,
      ApartmentMonthlyPaymentEntity,
      CalendarEventEntity,
    ],
    migrations: ['dist/database/migrations/*.js'], // Use compiled JS for runtime
    migrationsTableName: 'migrations',
    synchronize: false, // NEVER use true in production
    logging: process.env.NODE_ENV === 'development',
    ssl: false, // Local PostgreSQL doesn't need SSL
    extra: {
      connectionLimit: 10,
      acquireTimeout: 60000,
      timeout: 60000,
    },
    retryAttempts: 3,
    retryDelay: 3000,
  }),
);
