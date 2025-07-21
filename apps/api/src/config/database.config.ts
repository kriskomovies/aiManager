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

export default registerAs(
  'database',
  (): TypeOrmModuleOptions => ({
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
