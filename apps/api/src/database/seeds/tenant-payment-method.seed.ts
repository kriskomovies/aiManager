import { TenantPaymentMethodEntity } from '../entities/tenant-payment-method.entity';
import { TenantPaymentMethod, PaymentMethodStatus } from '@repo/interfaces';
import { BaseSeed } from './base-seed';

export class TenantPaymentMethodSeed extends BaseSeed {
  async run(): Promise<void> {
    const tenantPaymentMethodRepository = await this.getRepository(
      TenantPaymentMethodEntity,
    );

    // Check if seeds already exist
    const existing = await tenantPaymentMethodRepository.count();
    if (existing > 0) {
      console.log('Tenant payment methods already seeded, skipping...');
      return;
    }

    const tenantPaymentMethods = [
      {
        id: 'f82dbcfb-195f-4fda-b1d9-3085786a68a6',
        method: TenantPaymentMethod.CASHIER,
        displayName: 'Касиер',
        description: 'Плащане в брой на касиера',
        status: PaymentMethodStatus.ACTIVE,
        isDefault: false,
        createdAt: new Date('2025-07-18T17:27:44.895668Z'),
        updatedAt: new Date('2025-07-18T17:27:44.895668Z'),
      },
      {
        id: 'd54fbf6c-70cb-44ad-a4cc-1abfcfae48cb',
        method: TenantPaymentMethod.DEPOSIT,
        displayName: 'Плащане от депозит',
        description: 'Плащане от депозит на клиента',
        status: PaymentMethodStatus.ACTIVE,
        isDefault: false,
        createdAt: new Date('2025-07-18T17:27:44.895668Z'),
        updatedAt: new Date('2025-07-18T17:27:44.895668Z'),
      },
      {
        id: '7dd59e82-ebc1-4751-9e59-c741b109af2c',
        method: TenantPaymentMethod.BANK_ACCOUNT,
        displayName: 'По сметка',
        description: 'Банково плащане по сметка',
        status: PaymentMethodStatus.ACTIVE,
        isDefault: true,
        createdAt: new Date('2025-07-18T17:27:44.895668Z'),
        updatedAt: new Date('2025-07-18T17:27:44.895668Z'),
      },
      {
        id: 'ee57660f-b7a4-463c-ac9a-f21e863d2581',
        method: TenantPaymentMethod.E_PAY,
        displayName: 'През Е-Пей',
        description: 'Онлайн плащане през Е-Пей',
        status: PaymentMethodStatus.ACTIVE,
        isDefault: false,
        createdAt: new Date('2025-07-18T17:27:44.895668Z'),
        updatedAt: new Date('2025-07-18T17:27:44.895668Z'),
      },
      {
        id: '4854c038-faba-4bee-abc3-16c2aec603bc',
        method: TenantPaymentMethod.EASY_PAY,
        displayName: 'През Изи-Пей',
        description: 'Онлайн плащане през Изи-Пей',
        status: PaymentMethodStatus.ACTIVE,
        isDefault: false,
        createdAt: new Date('2025-07-18T17:27:44.895668Z'),
        updatedAt: new Date('2025-07-18T17:27:44.895668Z'),
      },
      {
        id: '570b1dd5-f24f-4a7c-aa85-e75e87c05d58',
        method: TenantPaymentMethod.EXPENSE_REFUND,
        displayName: 'Възстановяване от разход',
        description: 'Възстановяване на сума от разход',
        status: PaymentMethodStatus.ACTIVE,
        isDefault: false,
        createdAt: new Date('2025-07-18T17:27:44.895668Z'),
        updatedAt: new Date('2025-07-18T17:27:44.895668Z'),
      },
      {
        id: 'bad4bd53-418e-4dea-b82a-871420387cf8',
        method: TenantPaymentMethod.APP_PAYMENT,
        displayName: 'Плащане през приложение',
        description: 'Плащане директно през мобилното приложение',
        status: PaymentMethodStatus.ACTIVE,
        isDefault: false,
        createdAt: new Date('2025-07-18T17:27:44.895668Z'),
        updatedAt: new Date('2025-07-18T17:27:44.895668Z'),
      },
    ];

    await tenantPaymentMethodRepository.save(tenantPaymentMethods);
    console.log(`Seeded ${tenantPaymentMethods.length} tenant payment methods`);
  }
}
