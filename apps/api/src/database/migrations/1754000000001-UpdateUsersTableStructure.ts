import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
  TableIndex,
} from 'typeorm';

export class UpdateUsersTableStructure1754000000001
  implements MigrationInterface
{
  name = 'UpdateUsersTableStructure1754000000001';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // First, create user_roles table
    await queryRunner.createTable(
      new Table({
        name: 'user_roles',
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
            length: '50',
            isUnique: true,
            isNullable: false,
          },
          {
            name: 'description',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'permissions',
            type: 'text',
            isNullable: false,
          },
          {
            name: 'is_active',
            type: 'boolean',
            default: true,
            isNullable: false,
          },
          {
            name: 'is_system',
            type: 'boolean',
            default: false,
            isNullable: false,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
            isNullable: false,
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
            onUpdate: 'CURRENT_TIMESTAMP',
            isNullable: false,
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

    // Create user_status_enum
    await queryRunner.query(`
      CREATE TYPE "user_status_enum" AS ENUM('active', 'inactive', 'suspended');
    `);

    // Add new columns to existing users table
    await queryRunner.query(`
      ALTER TABLE "users" 
      ADD COLUMN "password_hash" character varying,
      ADD COLUMN "surname" character varying,
      ADD COLUMN "phone" character varying,
      ADD COLUMN "role_id" uuid,
      ADD COLUMN "resident_id" uuid,
      ADD COLUMN "status" "user_status_enum" DEFAULT 'active',
      ADD COLUMN "building_access" text,
      ADD COLUMN "avatar_url" character varying,
      ADD COLUMN "is_using_mobile_app" boolean DEFAULT false,
      ADD COLUMN "last_login_at" timestamp,
      ADD COLUMN "created_by" uuid,
      ADD COLUMN "updated_by" uuid;
    `);

    // Seed default roles first
    await this.insertDefaultRoles(queryRunner);

    // Get the default 'user' role ID to update existing users
    const defaultRoleResult = await queryRunner.query(`
      SELECT id FROM "user_roles" WHERE name = 'resident' LIMIT 1;
    `);
    const defaultRoleId = defaultRoleResult[0]?.id;

    if (defaultRoleId) {
      // Update existing users to have the default role_id and other required fields
      await queryRunner.query(
        `
        UPDATE "users" 
        SET 
          "role_id" = $1,
          "password_hash" = 'temp_hash_' || id::text,
          "surname" = 'Unknown',
          "status" = 'active'::user_status_enum,
          "is_using_mobile_app" = false
        WHERE "role_id" IS NULL;
      `,
        [defaultRoleId],
      );
    }

    // Make required columns NOT NULL after updating
    await queryRunner.query(`
      ALTER TABLE "users" 
      ALTER COLUMN "password_hash" SET NOT NULL,
      ALTER COLUMN "surname" SET NOT NULL,
      ALTER COLUMN "role_id" SET NOT NULL,
      ALTER COLUMN "status" SET NOT NULL,
      ALTER COLUMN "is_using_mobile_app" SET NOT NULL;
    `);

    // Drop the old role column and enum
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "role";`);
    await queryRunner.query(`DROP TYPE IF EXISTS "user_role_enum";`);

    // Add foreign key for role_id
    await queryRunner.createForeignKey(
      'users',
      new TableForeignKey({
        columnNames: ['role_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'user_roles',
        onDelete: 'RESTRICT',
      }),
    );

    // Add foreign key for resident_id (if residents table exists)
    const residentsTable = await queryRunner.hasTable('residents');
    if (residentsTable) {
      await queryRunner.createForeignKey(
        'users',
        new TableForeignKey({
          columnNames: ['resident_id'],
          referencedColumnNames: ['id'],
          referencedTableName: 'residents',
          onDelete: 'SET NULL',
        }),
      );
    }

    // Add indexes for performance
    await queryRunner.createIndex(
      'users',
      new TableIndex({
        columnNames: ['role_id'],
      }),
    );
    await queryRunner.createIndex(
      'users',
      new TableIndex({
        columnNames: ['resident_id'],
      }),
    );
    await queryRunner.createIndex(
      'users',
      new TableIndex({
        columnNames: ['status'],
      }),
    );
    await queryRunner.createIndex(
      'user_roles',
      new TableIndex({
        columnNames: ['name'],
        isUnique: true,
      }),
    );
    await queryRunner.createIndex(
      'user_roles',
      new TableIndex({
        columnNames: ['is_active'],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop foreign keys first
    const userTable = await queryRunner.getTable('users');
    if (userTable) {
      const roleFK = userTable.foreignKeys.find(
        (fk) => fk.columnNames.indexOf('role_id') !== -1,
      );
      if (roleFK) {
        await queryRunner.dropForeignKey('users', roleFK);
      }

      const residentFK = userTable.foreignKeys.find(
        (fk) => fk.columnNames.indexOf('resident_id') !== -1,
      );
      if (residentFK) {
        await queryRunner.dropForeignKey('users', residentFK);
      }
    }

    // Recreate the old user_role_enum
    await queryRunner.query(`
      CREATE TYPE "user_role_enum" AS ENUM('admin', 'user');
    `);

    // Add back the old role column
    await queryRunner.query(`
      ALTER TABLE "users" ADD COLUMN "role" "user_role_enum" DEFAULT 'user';
    `);

    // Remove the new columns
    await queryRunner.query(`
      ALTER TABLE "users" 
      DROP COLUMN "password_hash",
      DROP COLUMN "surname",
      DROP COLUMN "phone",
      DROP COLUMN "role_id",
      DROP COLUMN "resident_id",
      DROP COLUMN "status",
      DROP COLUMN "building_access",
      DROP COLUMN "avatar_url",
      DROP COLUMN "is_using_mobile_app",
      DROP COLUMN "last_login_at",
      DROP COLUMN "created_by",
      DROP COLUMN "updated_by";
    `);

    // Drop the new enum and table
    await queryRunner.query(`DROP TYPE "user_status_enum"`);
    await queryRunner.dropTable('user_roles', true, true, true);
  }

  private async insertDefaultRoles(queryRunner: QueryRunner): Promise<void> {
    const roles = [
      {
        id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
        name: 'admin',
        description: 'System Administrator with full access',
        permissions: '*',
        is_active: true,
        is_system: true,
      },
      {
        id: 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12',
        name: 'manager',
        description: 'Building Manager with management permissions',
        permissions:
          'buildings.read,buildings.write,apartments.read,apartments.write,irregularities.read,irregularities.write,finances.read,reports.read,partners.read',
        is_active: true,
        is_system: true,
      },
      {
        id: 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a13',
        name: 'accountant',
        description: 'Accountant with financial permissions',
        permissions:
          'finances.read,finances.write,reports.read,reports.generate',
        is_active: true,
        is_system: true,
      },
      {
        id: 'd0eebc99-9c0b-4ef8-bb6d-6bb9bd380a14',
        name: 'cashier',
        description: 'Cashier with payment processing permissions',
        permissions: 'finances.read,finances.write',
        is_active: true,
        is_system: true,
      },
      {
        id: 'e0eebc99-9c0b-4ef8-bb6d-6bb9bd380a15',
        name: 'resident',
        description:
          'Resident with basic access to their apartment and building info',
        permissions:
          'apartments.read,buildings.read,irregularities.read,irregularities.write',
        is_active: true,
        is_system: true,
      },
      {
        id: 'f0eebc99-9c0b-4ef8-bb6d-6bb9bd380a16',
        name: 'maintenance',
        description: 'Maintenance personnel with access to maintenance tasks',
        permissions:
          'irregularities.read,irregularities.write,irregularities.assign',
        is_active: true,
        is_system: true,
      },
    ];

    for (const role of roles) {
      await queryRunner.query(
        `INSERT INTO "user_roles" (id, name, description, permissions, is_active, is_system) VALUES ($1, $2, $3, $4, $5, $6)`,
        [
          role.id,
          role.name,
          role.description,
          role.permissions,
          role.is_active,
          role.is_system,
        ],
      );
    }
  }
}
