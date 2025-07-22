import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateMonthlyFeesTable1753200000000 implements MigrationInterface {
  name = 'CreateMonthlyFeesTable1753200000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create monthly_fees table
    await queryRunner.createTable(
      new Table({
        name: 'monthly_fees',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'building_id',
            type: 'uuid',
            isNullable: false,
          },
          {
            name: 'name',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'payment_basis',
            type: 'enum',
            enum: [
              'apartment',
              'resident',
              'pet',
              'common_parts',
              'quadrature',
            ],
            isNullable: false,
          },
          {
            name: 'application_mode',
            type: 'enum',
            enum: ['monthly_fee', 'total'],
            isNullable: false,
          },
          {
            name: 'base_amount',
            type: 'decimal',
            precision: 10,
            scale: 2,
            isNullable: false,
          },
          {
            name: 'is_distributed_evenly',
            type: 'boolean',
            default: true,
          },
          {
            name: 'target_month',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'is_active',
            type: 'boolean',
            default: true,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
            onUpdate: 'CURRENT_TIMESTAMP',
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
        foreignKeys: [
          {
            columnNames: ['building_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'buildings',
            onDelete: 'CASCADE',
          },
        ],
        indices: [
          {
            name: 'idx_monthly_fees_building_id',
            columnNames: ['building_id'],
          },
          {
            name: 'idx_monthly_fees_target_month',
            columnNames: ['target_month'],
          },
          {
            name: 'idx_monthly_fees_active',
            columnNames: ['is_active'],
          },
        ],
      }),
      true,
    );

    // Create monthly_fee_apartments table
    await queryRunner.createTable(
      new Table({
        name: 'monthly_fee_apartments',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'monthly_fee_id',
            type: 'uuid',
            isNullable: false,
          },
          {
            name: 'apartment_id',
            type: 'uuid',
            isNullable: false,
          },
          {
            name: 'coefficient',
            type: 'decimal',
            precision: 5,
            scale: 2,
            default: 1,
          },
          {
            name: 'calculated_amount',
            type: 'decimal',
            precision: 10,
            scale: 2,
            isNullable: false,
          },
          {
            name: 'description',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
            onUpdate: 'CURRENT_TIMESTAMP',
          },
        ],
        foreignKeys: [
          {
            columnNames: ['monthly_fee_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'monthly_fees',
            onDelete: 'CASCADE',
          },
          {
            columnNames: ['apartment_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'apartments',
            onDelete: 'CASCADE',
          },
        ],
        indices: [
          {
            name: 'idx_monthly_fee_apartments_fee_id',
            columnNames: ['monthly_fee_id'],
          },
          {
            name: 'idx_monthly_fee_apartments_apartment_id',
            columnNames: ['apartment_id'],
          },
        ],
        uniques: [
          {
            name: 'unique_fee_apartment',
            columnNames: ['monthly_fee_id', 'apartment_id'],
          },
        ],
      }),
      true,
    );

    // Create apartment_monthly_payments table
    await queryRunner.createTable(
      new Table({
        name: 'apartment_monthly_payments',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'apartment_id',
            type: 'uuid',
            isNullable: false,
          },
          {
            name: 'monthly_fee_id',
            type: 'uuid',
            isNullable: false,
          },
          {
            name: 'payment_month',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'amount_owed',
            type: 'decimal',
            precision: 10,
            scale: 2,
            isNullable: false,
          },
          {
            name: 'amount_paid',
            type: 'decimal',
            precision: 10,
            scale: 2,
            default: 0,
          },
          {
            name: 'balance',
            type: 'decimal',
            precision: 10,
            scale: 2,
            default: 0,
          },
          {
            name: 'status',
            type: 'enum',
            enum: ['pending', 'paid', 'overdue', 'partially_paid'],
            default: "'pending'",
          },
          {
            name: 'due_date',
            type: 'date',
            isNullable: false,
          },
          {
            name: 'paid_date',
            type: 'date',
            isNullable: true,
          },
          {
            name: 'user_payment_method_id',
            type: 'uuid',
            isNullable: true,
          },
          {
            name: 'notes',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
            onUpdate: 'CURRENT_TIMESTAMP',
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
        foreignKeys: [
          {
            columnNames: ['apartment_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'apartments',
            onDelete: 'CASCADE',
          },
          {
            columnNames: ['monthly_fee_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'monthly_fees',
            onDelete: 'CASCADE',
          },
          {
            columnNames: ['user_payment_method_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'user_payment_methods',
            onDelete: 'SET NULL',
          },
        ],
        indices: [
          {
            name: 'idx_apartment_monthly_payments_apartment_id',
            columnNames: ['apartment_id'],
          },
          {
            name: 'idx_apartment_monthly_payments_fee_id',
            columnNames: ['monthly_fee_id'],
          },
          {
            name: 'idx_apartment_monthly_payments_month',
            columnNames: ['payment_month'],
          },
          {
            name: 'idx_apartment_monthly_payments_status',
            columnNames: ['status'],
          },
          {
            name: 'idx_apartment_monthly_payments_apt_month',
            columnNames: ['apartment_id', 'payment_month'],
          },
        ],
        uniques: [
          {
            name: 'unique_apartment_fee_month',
            columnNames: ['apartment_id', 'monthly_fee_id', 'payment_month'],
          },
        ],
      }),
      true,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('apartment_monthly_payments');
    await queryRunner.dropTable('monthly_fee_apartments');
    await queryRunner.dropTable('monthly_fees');
  }
}
