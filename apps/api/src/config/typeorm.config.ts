import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import { BuildingEntity } from '../database/entities/building.entity';
import { ApartmentEntity } from '../database/entities/apartment.entity';
import { ResidentEntity } from '../database/entities/resident.entity';
import { InventoryEntity } from '../database/entities/inventory.entity';
import { InventoryTransactionEntity } from '../database/entities/inventory-transaction.entity';
import { TenantPaymentMethodEntity } from '../database/entities/tenant-payment-method.entity';
import { UserPaymentMethodEntity } from '../database/entities/user-payment-method.entity';
import { OneTimeExpenseEntity } from '../database/entities/one-time-expense.entity';
import { MonthlyFeeEntity } from '../database/entities/monthly-fee.entity';
import { MonthlyFeeApartmentEntity } from '../database/entities/monthly-fee-apartment.entity';
import { ApartmentMonthlyPaymentEntity } from '../database/entities/apartment-monthly-payment.entity';

config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  entities: [
    BuildingEntity,
    ApartmentEntity,
    ResidentEntity,
    InventoryEntity,
    InventoryTransactionEntity,
    TenantPaymentMethodEntity,
    UserPaymentMethodEntity,
    OneTimeExpenseEntity,
    MonthlyFeeEntity,
    MonthlyFeeApartmentEntity,
    ApartmentMonthlyPaymentEntity,
  ],
  migrations: ['src/database/migrations/*.ts'],
  migrationsTableName: 'migrations',
  synchronize: false,
  logging: process.env.NODE_ENV === 'development',
  ssl: false,
  extra: {
    connectionLimit: 10,
    acquireTimeout: 60000,
    timeout: 60000,
  },
});
