import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
  TableForeignKey,
} from 'typeorm';

export class AddUserPaymentMethodToInventoryTransactions1752100000000
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Add the user_payment_method_id column
    await queryRunner.addColumn(
      'inventory_transactions',
      new TableColumn({
        name: 'user_payment_method_id',
        type: 'uuid',
        isNullable: true,
      }),
    );

    // Add foreign key constraint
    await queryRunner.createForeignKey(
      'inventory_transactions',
      new TableForeignKey({
        columnNames: ['user_payment_method_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'user_payment_methods',
        onDelete: 'SET NULL',
        name: 'FK_inventory_transactions_user_payment_method',
      }),
    );

    // Add index for better query performance
    await queryRunner.query(`
      CREATE INDEX "IDX_inventory_transactions_user_payment_method_id" 
      ON "inventory_transactions" ("user_payment_method_id")
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop the index first
    await queryRunner.query(`
      DROP INDEX IF EXISTS "IDX_inventory_transactions_user_payment_method_id"
    `);

    // Drop the foreign key constraint
    await queryRunner.dropForeignKey(
      'inventory_transactions',
      'FK_inventory_transactions_user_payment_method',
    );

    // Drop the column
    await queryRunner.dropColumn(
      'inventory_transactions',
      'user_payment_method_id',
    );
  }
}
