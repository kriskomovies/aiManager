import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class UpdateRecurringExpensesTable1753400000000
  implements MigrationInterface
{
  name = 'UpdateRecurringExpensesTable1753400000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Make monthly_fee_id nullable
    await queryRunner.changeColumn(
      'recurring_expenses',
      'monthly_fee_id',
      new TableColumn({
        name: 'monthly_fee_id',
        type: 'uuid',
        isNullable: true,
      }),
    );

    // Add new columns
    await queryRunner.addColumns('recurring_expenses', [
      new TableColumn({
        name: 'contractor',
        type: 'varchar',
        isNullable: true,
      }),
      new TableColumn({
        name: 'payment_date',
        type: 'date',
        isNullable: true,
      }),
      new TableColumn({
        name: 'reason',
        type: 'text',
        isNullable: true,
      }),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Remove new columns
    await queryRunner.dropColumns('recurring_expenses', [
      'contractor',
      'payment_date',
      'reason',
    ]);

    // Make monthly_fee_id non-nullable again
    await queryRunner.changeColumn(
      'recurring_expenses',
      'monthly_fee_id',
      new TableColumn({
        name: 'monthly_fee_id',
        type: 'uuid',
        isNullable: false,
      }),
    );
  }
}
