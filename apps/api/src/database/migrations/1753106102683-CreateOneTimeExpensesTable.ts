import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateOneTimeExpensesTable1753106102683
  implements MigrationInterface
{
  name = 'CreateOneTimeExpensesTable1753106102683';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "one_time_expenses" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "name" character varying NOT NULL,
        "contragent_id" uuid,
        "expense_date" TIMESTAMP NOT NULL,
        "amount" numeric NOT NULL,
        "inventory_id" uuid NOT NULL,
        "user_payment_method_id" uuid NOT NULL,
        "note" text,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        "created_by" uuid,
        "updated_by" uuid,
        CONSTRAINT "PK_one_time_expenses" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(`
      ALTER TABLE "one_time_expenses" 
      ADD CONSTRAINT "FK_one_time_expenses_inventory_id" 
      FOREIGN KEY ("inventory_id") REFERENCES "inventories"("id") ON DELETE CASCADE
    `);

    await queryRunner.query(`
      ALTER TABLE "one_time_expenses" 
      ADD CONSTRAINT "FK_one_time_expenses_user_payment_method_id" 
      FOREIGN KEY ("user_payment_method_id") REFERENCES "user_payment_methods"("id") ON DELETE SET NULL
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_one_time_expenses_inventory_id" ON "one_time_expenses" ("inventory_id")
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_one_time_expenses_expense_date" ON "one_time_expenses" ("expense_date")
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_one_time_expenses_created_at" ON "one_time_expenses" ("created_at")
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "IDX_one_time_expenses_created_at"`);
    await queryRunner.query(`DROP INDEX "IDX_one_time_expenses_expense_date"`);
    await queryRunner.query(`DROP INDEX "IDX_one_time_expenses_inventory_id"`);
    await queryRunner.query(`DROP TABLE "one_time_expenses"`);
  }
}
