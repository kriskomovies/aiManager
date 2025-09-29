import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateRecurringExpensesTable1753300000000
  implements MigrationInterface
{
  name = 'CreateRecurringExpensesTable1753300000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'recurring_expenses',
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
            name: 'monthly_amount',
            type: 'decimal',
            precision: 10,
            scale: 2,
            isNullable: false,
          },
          {
            name: 'user_payment_method_id',
            type: 'uuid',
            isNullable: false,
          },
          {
            name: 'add_to_monthly_fees',
            type: 'boolean',
            default: false,
          },
          {
            name: 'monthly_fee_id',
            type: 'uuid',
            isNullable: false,
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
            referencedTableName: 'buildings',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
          },
          {
            columnNames: ['monthly_fee_id'],
            referencedTableName: 'monthly_fees',
            referencedColumnNames: ['id'],
            onDelete: 'RESTRICT', // Prevent deletion of monthly fee if recurring expenses exist
          },
          {
            columnNames: ['user_payment_method_id'],
            referencedTableName: 'user_payment_methods',
            referencedColumnNames: ['id'],
            onDelete: 'RESTRICT',
          },
        ],
        indices: [
          {
            name: 'idx_recurring_expenses_building_id',
            columnNames: ['building_id'],
          },
          {
            name: 'idx_recurring_expenses_monthly_fee_id',
            columnNames: ['monthly_fee_id'],
          },
        ],
      }),
      true,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('recurring_expenses');
  }
}
