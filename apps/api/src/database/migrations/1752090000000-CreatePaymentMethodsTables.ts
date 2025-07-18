import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreatePaymentMethodsTables1752090000000
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create tenant_payment_methods table
    await queryRunner.createTable(
      new Table({
        name: 'tenant_payment_methods',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'method',
            type: 'enum',
            enum: [
              'cashier',
              'deposit',
              'bank_account',
              'e_pay',
              'easy_pay',
              'expense_refund',
              'app_payment',
            ],
          },
          {
            name: 'display_name',
            type: 'varchar',
            length: '255',
          },
          {
            name: 'description',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'status',
            type: 'enum',
            enum: ['active', 'inactive'],
            default: "'active'",
          },
          {
            name: 'is_default',
            type: 'boolean',
            default: false,
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
        indices: [
          {
            name: 'IDX_tenant_payment_methods_method',
            columnNames: ['method'],
          },
          {
            name: 'IDX_tenant_payment_methods_status',
            columnNames: ['status'],
          },
          {
            name: 'IDX_tenant_payment_methods_is_default',
            columnNames: ['is_default'],
          },
        ],
      }),
      true,
    );

    // Create user_payment_methods table
    await queryRunner.createTable(
      new Table({
        name: 'user_payment_methods',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'method',
            type: 'enum',
            enum: ['bank_account', 'cash', 'easy_pay', 'e_pay'],
          },
          {
            name: 'display_name',
            type: 'varchar',
            length: '255',
          },
          {
            name: 'description',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'status',
            type: 'enum',
            enum: ['active', 'inactive'],
            default: "'active'",
          },
          {
            name: 'is_default',
            type: 'boolean',
            default: false,
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
        indices: [
          {
            name: 'IDX_user_payment_methods_method',
            columnNames: ['method'],
          },
          {
            name: 'IDX_user_payment_methods_status',
            columnNames: ['status'],
          },
          {
            name: 'IDX_user_payment_methods_is_default',
            columnNames: ['is_default'],
          },
        ],
      }),
      true,
    );

    // Insert default tenant payment methods
    await queryRunner.query(`
      INSERT INTO tenant_payment_methods (method, display_name, description, status, is_default) VALUES
      ('cashier', 'Касиер', 'Плащане в брой на касиера', 'active', false),
      ('deposit', 'Плащане от депозит', 'Плащане от депозит на клиента', 'active', false),
      ('bank_account', 'По сметка', 'Банково плащане по сметка', 'active', true),
      ('e_pay', 'През Е-Пей', 'Онлайн плащане през Е-Пей', 'active', false),
      ('easy_pay', 'През Изи-Пей', 'Онлайн плащане през Изи-Пей', 'active', false),
      ('expense_refund', 'Възстановяване от разход', 'Възстановяване на сума от разход', 'active', false),
      ('app_payment', 'Плащане през приложение', 'Плащане директно през мобилното приложение', 'active', false);
    `);

    // Insert default user payment methods
    await queryRunner.query(`
      INSERT INTO user_payment_methods (method, display_name, description, status, is_default) VALUES
      ('bank_account', 'Плащане по сметка', 'Банково плащане по сметка', 'active', true),
      ('cash', 'Кеш', 'Плащане в брой', 'active', false),
      ('easy_pay', 'Плащане през Изи-Пей', 'Онлайн плащане през Изи-Пей', 'active', false),
      ('e_pay', 'Плащане през Е-пей', 'Онлайн плащане през Е-пей', 'active', false);
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('user_payment_methods');
    await queryRunner.dropTable('tenant_payment_methods');
  }
}
