import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateRecurringExpensePaymentsTable1753500000000
  implements MigrationInterface
{
  name = 'CreateRecurringExpensePaymentsTable1753500000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'recurring_expenses_payments',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'gen_random_uuid()',
          },
          {
            name: 'name',
            type: 'varchar',
            length: '255',
          },
          {
            name: 'amount',
            type: 'decimal',
            precision: 10,
            scale: 2,
          },
          {
            name: 'recurring_expense_id',
            type: 'uuid',
          },
          {
            name: 'user_payment_method_id',
            type: 'uuid',
          },
          {
            name: 'connect_payment',
            type: 'boolean',
            default: false,
          },
          {
            name: 'monthly_fee_id',
            type: 'uuid',
            isNullable: true,
          },
          {
            name: 'reason',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'payment_date',
            type: 'date',
          },
          {
            name: 'issue_document',
            type: 'boolean',
            default: false,
          },
          {
            name: 'document_type',
            type: 'enum',
            enum: ['invoice', 'receipt'],
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
            columnNames: ['recurring_expense_id'],
            referencedTableName: 'recurring_expenses',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
          },
          {
            columnNames: ['user_payment_method_id'],
            referencedTableName: 'user_payment_methods',
            referencedColumnNames: ['id'],
            onDelete: 'RESTRICT',
          },
          {
            columnNames: ['monthly_fee_id'],
            referencedTableName: 'monthly_fees',
            referencedColumnNames: ['id'],
            onDelete: 'SET NULL',
          },
        ],
        indices: [
          {
            name: 'IDX_recurring_expense_payment_recurring_expense',
            columnNames: ['recurring_expense_id'],
          },
          {
            name: 'IDX_recurring_expense_payment_user_payment_method',
            columnNames: ['user_payment_method_id'],
          },
          {
            name: 'IDX_recurring_expense_payment_monthly_fee',
            columnNames: ['monthly_fee_id'],
          },
          {
            name: 'IDX_recurring_expense_payment_date',
            columnNames: ['payment_date'],
          },
        ],
      }),
      true,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('recurring_expenses_payments');
  }
}
