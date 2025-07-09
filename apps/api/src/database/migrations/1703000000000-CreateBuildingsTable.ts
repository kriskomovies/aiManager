import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm';

export class CreateBuildingsTable1703000000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Enable UUID extension
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);

    // Create enum types first
    await queryRunner.query(`
CREATE TYPE "building_type_enum" AS ENUM ('residential', 'commercial', 'office', 'mixed');
    `);

    await queryRunner.query(`
CREATE TYPE "building_status_enum" AS ENUM ('active', 'inactive', 'maintenance');
    `);

    await queryRunner.query(`
CREATE TYPE "tax_generation_period_enum" AS ENUM ('monthly', 'quarterly', 'yearly');
    `);

    // Create the buildings table
    await queryRunner.createTable(
      new Table({
        name: 'buildings',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'name',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'type',
            type: 'enum',
            enum: ['residential', 'commercial', 'office', 'mixed'],
            enumName: 'building_type_enum',
            isNullable: false,
          },
          {
            name: 'status',
            type: 'enum',
            enum: ['active', 'inactive', 'maintenance'],
            enumName: 'building_status_enum',
            isNullable: true,
          },
          {
            name: 'city',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'district',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'street',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'number',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'entrance',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'postal_code',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'common_parts_area',
            type: 'numeric',
            isNullable: true,
          },
          {
            name: 'quadrature',
            type: 'numeric',
            isNullable: true,
          },
          {
            name: 'parking_slots',
            type: 'integer',
            isNullable: true,
          },
          {
            name: 'basements',
            type: 'integer',
            isNullable: true,
          },
          {
            name: 'apartment_count',
            type: 'integer',
            isNullable: true,
          },
          {
            name: 'balance',
            type: 'numeric',
            isNullable: true,
          },
          {
            name: 'monthly_fee',
            type: 'numeric',
            isNullable: true,
          },
          {
            name: 'debt',
            type: 'numeric',
            isNullable: true,
          },
          {
            name: 'tax_generation_period',
            type: 'enum',
            enum: ['monthly', 'quarterly', 'yearly'],
            enumName: 'tax_generation_period_enum',
            isNullable: true,
          },
          {
            name: 'tax_generation_day',
            type: 'integer',
            isNullable: true,
          },
          {
            name: 'homebook_start_date',
            type: 'date',
            isNullable: false,
          },
          {
            name: 'next_tax_date',
            type: 'date',
            isNullable: true,
          },
          {
            name: 'invoice_enabled',
            type: 'boolean',
            isNullable: true,
          },
          {
            name: 'total_units',
            type: 'integer',
            isNullable: true,
          },
          {
            name: 'occupied_units',
            type: 'integer',
            isNullable: true,
          },
          {
            name: 'irregularities',
            type: 'integer',
            isNullable: true,
          },
          {
            name: 'occupancy_rate',
            type: 'numeric',
            isNullable: true,
          },
          {
            name: 'monthly_revenue',
            type: 'numeric',
            isNullable: true,
          },
          {
            name: 'annual_revenue',
            type: 'numeric',
            isNullable: true,
          },
          {
            name: 'description',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'NOW()',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'NOW()',
          },
          {
            name: 'created_by',
            type: 'uuid',
            isNullable: true,
          },
          {
            name: 'updated_by',
            type: 'uuid',
            isNullable: true,
          },
        ],
      }),
      true,
    );

    // Create indexes for performance
    await queryRunner.createIndex(
      'buildings',
      new TableIndex({
        name: 'IDX_BUILDINGS_NAME',
        columnNames: ['name'],
      }),
    );

    await queryRunner.createIndex(
      'buildings',
      new TableIndex({
        name: 'IDX_BUILDINGS_TYPE',
        columnNames: ['type'],
      }),
    );

    await queryRunner.createIndex(
      'buildings',
      new TableIndex({
        name: 'IDX_BUILDINGS_STATUS',
        columnNames: ['status'],
      }),
    );

    await queryRunner.createIndex(
      'buildings',
      new TableIndex({
        name: 'IDX_BUILDINGS_CITY',
        columnNames: ['city'],
      }),
    );

    await queryRunner.createIndex(
      'buildings',
      new TableIndex({
        name: 'IDX_BUILDINGS_DISTRICT',
        columnNames: ['district'],
      }),
    );

    await queryRunner.createIndex(
      'buildings',
      new TableIndex({
        name: 'IDX_BUILDINGS_CREATED_AT',
        columnNames: ['created_at'],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('buildings');
    await queryRunner.query(`DROP TYPE IF EXISTS "building_type_enum"`);
    await queryRunner.query(`DROP TYPE IF EXISTS "building_status_enum"`);
    await queryRunner.query(`DROP TYPE IF EXISTS "tax_generation_period_enum"`);
  }
}
