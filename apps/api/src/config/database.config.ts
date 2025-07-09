import { registerAs } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { BuildingEntity } from '../database/entities/building.entity';
import { ApartmentEntity } from '../database/entities/apartment.entity';
import { ResidentEntity } from '../database/entities/resident.entity';

export default registerAs(
  'database',
  (): TypeOrmModuleOptions => ({
    type: 'postgres',
    url: process.env.DATABASE_URL,
    entities: [BuildingEntity, ApartmentEntity, ResidentEntity],
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
