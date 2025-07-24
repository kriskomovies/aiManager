import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateCalendarEventsTable1753300000000
  implements MigrationInterface
{
  name = 'CreateCalendarEventsTable1753300000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create enum types for calendar events
    await queryRunner.query(`
      CREATE TYPE "calendar_event_type_enum" AS ENUM(
        'meeting', 
        'maintenance', 
        'inspection', 
        'payment', 
        'repair'
      )
    `);

    await queryRunner.query(`
      CREATE TYPE "calendar_event_status_enum" AS ENUM(
        'scheduled', 
        'in-progress', 
        'completed', 
        'cancelled'
      )
    `);

    await queryRunner.query(`
      CREATE TYPE "calendar_event_priority_enum" AS ENUM(
        'low', 
        'medium', 
        'high', 
        'urgent'
      )
    `);

    // Create calendar_events table
    await queryRunner.query(`
      CREATE TABLE "calendar_events" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "title" character varying NOT NULL,
        "type" "calendar_event_type_enum" NOT NULL,
        "start_date" TIMESTAMP NOT NULL,
        "end_date" TIMESTAMP NOT NULL,
        "description" text,
        "status" "calendar_event_status_enum" NOT NULL DEFAULT 'scheduled',
        "priority" "calendar_event_priority_enum" NOT NULL DEFAULT 'medium',
        "assigned_to" character varying,
        "building_id" uuid NOT NULL,
        "applies_to_all_apartments" boolean NOT NULL DEFAULT false,
        "target_apartment_ids" json,
        "location" character varying,
        "notes" text,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        "created_by" uuid,
        "updated_by" uuid,
        CONSTRAINT "PK_calendar_events" PRIMARY KEY ("id")
      )
    `);

    // Add foreign key constraint to buildings table
    await queryRunner.query(`
      ALTER TABLE "calendar_events" 
      ADD CONSTRAINT "FK_calendar_events_building_id" 
      FOREIGN KEY ("building_id") REFERENCES "buildings"("id") ON DELETE CASCADE
    `);

    // Create indexes for better query performance
    await queryRunner.query(`
      CREATE INDEX "IDX_calendar_events_building_id" ON "calendar_events" ("building_id")
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_calendar_events_type" ON "calendar_events" ("type")
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_calendar_events_status" ON "calendar_events" ("status")
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_calendar_events_priority" ON "calendar_events" ("priority")
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_calendar_events_start_date" ON "calendar_events" ("start_date")
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_calendar_events_end_date" ON "calendar_events" ("end_date")
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_calendar_events_created_at" ON "calendar_events" ("created_at")
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_calendar_events_applies_to_all" ON "calendar_events" ("applies_to_all_apartments")
    `);

    // Create a composite index for building + date range queries
    await queryRunner.query(`
      CREATE INDEX "IDX_calendar_events_building_date_range" 
      ON "calendar_events" ("building_id", "start_date", "end_date")
    `);

    // Create index for searching by assigned person
    await queryRunner.query(`
      CREATE INDEX "IDX_calendar_events_assigned_to" ON "calendar_events" ("assigned_to")
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop indexes
    await queryRunner.query(`DROP INDEX "IDX_calendar_events_assigned_to"`);
    await queryRunner.query(
      `DROP INDEX "IDX_calendar_events_building_date_range"`,
    );
    await queryRunner.query(`DROP INDEX "IDX_calendar_events_applies_to_all"`);
    await queryRunner.query(`DROP INDEX "IDX_calendar_events_created_at"`);
    await queryRunner.query(`DROP INDEX "IDX_calendar_events_end_date"`);
    await queryRunner.query(`DROP INDEX "IDX_calendar_events_start_date"`);
    await queryRunner.query(`DROP INDEX "IDX_calendar_events_priority"`);
    await queryRunner.query(`DROP INDEX "IDX_calendar_events_status"`);
    await queryRunner.query(`DROP INDEX "IDX_calendar_events_type"`);
    await queryRunner.query(`DROP INDEX "IDX_calendar_events_building_id"`);

    // Drop foreign key constraint
    await queryRunner.query(`
      ALTER TABLE "calendar_events" DROP CONSTRAINT "FK_calendar_events_building_id"
    `);

    // Drop table
    await queryRunner.query(`DROP TABLE "calendar_events"`);

    // Drop enum types
    await queryRunner.query(`DROP TYPE "calendar_event_priority_enum"`);
    await queryRunner.query(`DROP TYPE "calendar_event_status_enum"`);
    await queryRunner.query(`DROP TYPE "calendar_event_type_enum"`);
  }
}
