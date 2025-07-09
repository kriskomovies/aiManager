import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateApartmentsAndResidentsTable1752079698197
  implements MigrationInterface
{
  name = 'CreateApartmentsAndResidentsTable1752079698197';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "public"."IDX_BUILDINGS_NAME"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_BUILDINGS_TYPE"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_BUILDINGS_STATUS"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_BUILDINGS_CITY"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_BUILDINGS_DISTRICT"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_BUILDINGS_CREATED_AT"`);
    await queryRunner.query(
      `CREATE TYPE "public"."apartments_type_enum" AS ENUM('apartment', 'atelier', 'office', 'garage', 'shop', 'other')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."apartments_status_enum" AS ENUM('occupied', 'vacant', 'maintenance', 'reserved')`,
    );
    await queryRunner.query(
      `CREATE TABLE "apartments" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "building_id" uuid NOT NULL, "type" "public"."apartments_type_enum" NOT NULL, "number" character varying NOT NULL, "floor" integer NOT NULL, "quadrature" numeric NOT NULL, "common_parts" numeric, "ideal_parts" numeric, "residents_count" integer NOT NULL DEFAULT '0', "pets" integer NOT NULL DEFAULT '0', "status" "public"."apartments_status_enum" NOT NULL DEFAULT 'vacant', "invoice_enabled" boolean NOT NULL DEFAULT false, "block_for_payment" boolean NOT NULL DEFAULT false, "cashier_note" text, "monthly_rent" numeric, "maintenance_fee" numeric, "debt" numeric DEFAULT '0', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "created_by" uuid, "updated_by" uuid, CONSTRAINT "PK_f6058e85d6d715dbe22b72fe722" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."residents_role_enum" AS ENUM('owner', 'tenant', 'guest')`,
    );
    await queryRunner.query(
      `CREATE TABLE "residents" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "apartment_id" uuid NOT NULL, "name" character varying NOT NULL, "surname" character varying NOT NULL, "phone" character varying NOT NULL, "email" character varying NOT NULL, "role" "public"."residents_role_enum" NOT NULL, "is_main_contact" boolean NOT NULL DEFAULT false, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_4c8d0413ee0e9a4ebbf500f7365" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TYPE "public"."building_type_enum" RENAME TO "building_type_enum_old"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."buildings_type_enum" AS ENUM('residential', 'commercial', 'office', 'mixed')`,
    );
    await queryRunner.query(
      `ALTER TABLE "buildings" ALTER COLUMN "type" TYPE "public"."buildings_type_enum" USING "type"::"text"::"public"."buildings_type_enum"`,
    );
    await queryRunner.query(`DROP TYPE "public"."building_type_enum_old"`);
    await queryRunner.query(
      `ALTER TYPE "public"."building_status_enum" RENAME TO "building_status_enum_old"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."buildings_status_enum" AS ENUM('active', 'inactive', 'maintenance')`,
    );
    await queryRunner.query(
      `ALTER TABLE "buildings" ALTER COLUMN "status" TYPE "public"."buildings_status_enum" USING "status"::"text"::"public"."buildings_status_enum"`,
    );
    await queryRunner.query(`DROP TYPE "public"."building_status_enum_old"`);
    await queryRunner.query(
      `ALTER TYPE "public"."tax_generation_period_enum" RENAME TO "tax_generation_period_enum_old"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."buildings_tax_generation_period_enum" AS ENUM('monthly', 'quarterly', 'yearly')`,
    );
    await queryRunner.query(
      `ALTER TABLE "buildings" ALTER COLUMN "tax_generation_period" TYPE "public"."buildings_tax_generation_period_enum" USING "tax_generation_period"::"text"::"public"."buildings_tax_generation_period_enum"`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."tax_generation_period_enum_old"`,
    );
    await queryRunner.query(
      `ALTER TABLE "apartments" ADD CONSTRAINT "FK_ea42a4fe9d90b4885bc87ba6dc3" FOREIGN KEY ("building_id") REFERENCES "buildings"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "residents" ADD CONSTRAINT "FK_cd6313a860ece9aafa0636a66a1" FOREIGN KEY ("apartment_id") REFERENCES "apartments"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "residents" DROP CONSTRAINT "FK_cd6313a860ece9aafa0636a66a1"`,
    );
    await queryRunner.query(
      `ALTER TABLE "apartments" DROP CONSTRAINT "FK_ea42a4fe9d90b4885bc87ba6dc3"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."tax_generation_period_enum_old" AS ENUM('monthly', 'quarterly', 'yearly')`,
    );
    await queryRunner.query(
      `ALTER TABLE "buildings" ALTER COLUMN "tax_generation_period" TYPE "public"."tax_generation_period_enum_old" USING "tax_generation_period"::"text"::"public"."tax_generation_period_enum_old"`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."buildings_tax_generation_period_enum"`,
    );
    await queryRunner.query(
      `ALTER TYPE "public"."tax_generation_period_enum_old" RENAME TO "tax_generation_period_enum"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."building_status_enum_old" AS ENUM('active', 'inactive', 'maintenance')`,
    );
    await queryRunner.query(
      `ALTER TABLE "buildings" ALTER COLUMN "status" TYPE "public"."building_status_enum_old" USING "status"::"text"::"public"."building_status_enum_old"`,
    );
    await queryRunner.query(`DROP TYPE "public"."buildings_status_enum"`);
    await queryRunner.query(
      `ALTER TYPE "public"."building_status_enum_old" RENAME TO "building_status_enum"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."building_type_enum_old" AS ENUM('residential', 'commercial', 'office', 'mixed')`,
    );
    await queryRunner.query(
      `ALTER TABLE "buildings" ALTER COLUMN "type" TYPE "public"."building_type_enum_old" USING "type"::"text"::"public"."building_type_enum_old"`,
    );
    await queryRunner.query(`DROP TYPE "public"."buildings_type_enum"`);
    await queryRunner.query(
      `ALTER TYPE "public"."building_type_enum_old" RENAME TO "building_type_enum"`,
    );
    await queryRunner.query(`DROP TABLE "residents"`);
    await queryRunner.query(`DROP TYPE "public"."residents_role_enum"`);
    await queryRunner.query(`DROP TABLE "apartments"`);
    await queryRunner.query(`DROP TYPE "public"."apartments_status_enum"`);
    await queryRunner.query(`DROP TYPE "public"."apartments_type_enum"`);
    await queryRunner.query(
      `CREATE INDEX "IDX_BUILDINGS_CREATED_AT" ON "buildings" ("created_at") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_BUILDINGS_DISTRICT" ON "buildings" ("district") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_BUILDINGS_CITY" ON "buildings" ("city") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_BUILDINGS_STATUS" ON "buildings" ("status") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_BUILDINGS_TYPE" ON "buildings" ("type") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_BUILDINGS_NAME" ON "buildings" ("name") `,
    );
  }
}
