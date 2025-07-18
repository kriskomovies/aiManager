import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateInventoriesAndTransactions1752080000000
  implements MigrationInterface
{
  name = 'CreateInventoriesAndTransactions1752080000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create TransactionType enum
    await queryRunner.query(`
      CREATE TYPE "transaction_type_enum" AS ENUM(
        'transfer', 
        'deposit', 
        'withdrawal', 
        'payment_received', 
        'expense_paid'
      )
    `);

    // Create inventories table
    await queryRunner.query(`
      CREATE TABLE "inventories" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "building_id" uuid NOT NULL,
        "name" character varying NOT NULL,
        "title" character varying,
        "description" text,
        "amount" numeric(10,2) NOT NULL DEFAULT '0',
        "is_main" boolean NOT NULL DEFAULT false,
        "visible_in_app" boolean NOT NULL DEFAULT true,
        "is_active" boolean NOT NULL DEFAULT true,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        "created_by" uuid,
        "updated_by" uuid,
        CONSTRAINT "PK_inventories" PRIMARY KEY ("id")
      )
    `);

    // Create inventory_transactions table
    await queryRunner.query(`
      CREATE TABLE "inventory_transactions" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "from_inventory_id" uuid,
        "to_inventory_id" uuid,
        "type" "transaction_type_enum" NOT NULL,
        "amount" numeric(10,2) NOT NULL,
        "description" text,
        "reference_id" character varying,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "created_by" uuid,
        CONSTRAINT "PK_inventory_transactions" PRIMARY KEY ("id")
      )
    `);

    // Add foreign key constraints
    await queryRunner.query(`
      ALTER TABLE "inventories" 
      ADD CONSTRAINT "FK_inventories_building_id" 
      FOREIGN KEY ("building_id") REFERENCES "buildings"("id") ON DELETE CASCADE
    `);

    await queryRunner.query(`
      ALTER TABLE "inventory_transactions" 
      ADD CONSTRAINT "FK_inventory_transactions_from_inventory_id" 
      FOREIGN KEY ("from_inventory_id") REFERENCES "inventories"("id") ON DELETE CASCADE
    `);

    await queryRunner.query(`
      ALTER TABLE "inventory_transactions" 
      ADD CONSTRAINT "FK_inventory_transactions_to_inventory_id" 
      FOREIGN KEY ("to_inventory_id") REFERENCES "inventories"("id") ON DELETE CASCADE
    `);

    // Create indexes for better performance
    await queryRunner.query(
      `CREATE INDEX "IDX_inventories_building_id" ON "inventories" ("building_id")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_inventories_is_main" ON "inventories" ("is_main")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_inventory_transactions_from_inventory_id" ON "inventory_transactions" ("from_inventory_id")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_inventory_transactions_to_inventory_id" ON "inventory_transactions" ("to_inventory_id")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_inventory_transactions_type" ON "inventory_transactions" ("type")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_inventory_transactions_created_at" ON "inventory_transactions" ("created_at")`,
    );

    // Ensure each building has only one main inventory
    await queryRunner.query(`
      CREATE UNIQUE INDEX "IDX_inventories_building_main" 
      ON "inventories" ("building_id") 
      WHERE "is_main" = true
    `);

    // Create main inventories for existing buildings
    await queryRunner.query(`
      INSERT INTO "inventories" ("building_id", "name", "title", "description", "is_main", "visible_in_app", "amount")
      SELECT 
        id, 
        'Основна Каса', 
        'Основна Каса за Сграда', 
        'Основна каса за всички общи разходи и приходи на сградата',
        true,
        true,
        COALESCE(balance, 0)
      FROM "buildings"
      WHERE NOT EXISTS (
        SELECT 1 FROM "inventories" 
        WHERE "inventories"."building_id" = "buildings"."id" 
        AND "inventories"."is_main" = true
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop indexes
    await queryRunner.query(`DROP INDEX "IDX_inventories_building_main"`);
    await queryRunner.query(
      `DROP INDEX "IDX_inventory_transactions_created_at"`,
    );
    await queryRunner.query(`DROP INDEX "IDX_inventory_transactions_type"`);
    await queryRunner.query(
      `DROP INDEX "IDX_inventory_transactions_to_inventory_id"`,
    );
    await queryRunner.query(
      `DROP INDEX "IDX_inventory_transactions_from_inventory_id"`,
    );
    await queryRunner.query(`DROP INDEX "IDX_inventories_is_main"`);
    await queryRunner.query(`DROP INDEX "IDX_inventories_building_id"`);

    // Drop foreign key constraints
    await queryRunner.query(
      `ALTER TABLE "inventory_transactions" DROP CONSTRAINT "FK_inventory_transactions_to_inventory_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "inventory_transactions" DROP CONSTRAINT "FK_inventory_transactions_from_inventory_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "inventories" DROP CONSTRAINT "FK_inventories_building_id"`,
    );

    // Drop tables
    await queryRunner.query(`DROP TABLE "inventory_transactions"`);
    await queryRunner.query(`DROP TABLE "inventories"`);

    // Drop enum
    await queryRunner.query(`DROP TYPE "transaction_type_enum"`);
  }
}
