import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import { BuildingEntity } from '../database/entities/building.entity';
import { ApartmentEntity } from '../database/entities/apartment.entity';
import { ResidentEntity } from '../database/entities/resident.entity';

config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  entities: [BuildingEntity, ApartmentEntity, ResidentEntity],
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
