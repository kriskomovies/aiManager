import { UserPaymentMethodEntity } from '../entities/user-payment-method.entity';
import { UserPaymentMethod, PaymentMethodStatus } from '@repo/interfaces';
import { BaseSeed } from './base-seed';

export class UserPaymentMethodSeed extends BaseSeed {
  async run(): Promise<void> {
    const userPaymentMethodRepository = await this.getRepository(
      UserPaymentMethodEntity,
    );

    // Check if seeds already exist
    const existing = await userPaymentMethodRepository.count();
    if (existing > 0) {
      console.log('User payment methods already seeded, skipping...');
      return;
    }

    const userPaymentMethods = [
      {
        id: '99f0052c-fd6f-4293-a17e-ddf1f35504dd',
        method: UserPaymentMethod.BANK_ACCOUNT,
        displayName: 'Плащане по сметка',
        description: 'Банково плащане по сметка',
        status: PaymentMethodStatus.ACTIVE,
        isDefault: true,
        createdAt: new Date('2025-07-18T17:27:44.895668Z'),
        updatedAt: new Date('2025-07-18T17:27:44.895668Z'),
      },
      {
        id: '311105b5-3eb4-4d1f-bfa8-b4f2612f9902',
        method: UserPaymentMethod.CASH,
        displayName: 'Кеш',
        description: 'Плащане в брой',
        status: PaymentMethodStatus.ACTIVE,
        isDefault: false,
        createdAt: new Date('2025-07-18T17:27:44.895668Z'),
        updatedAt: new Date('2025-07-18T17:27:44.895668Z'),
      },
      {
        id: '5454f7ba-a9d2-4bf1-968c-f743b95364c8',
        method: UserPaymentMethod.EASY_PAY,
        displayName: 'Плащане през Изи-Пей',
        description: 'Онлайн плащане през Изи-Пей',
        status: PaymentMethodStatus.ACTIVE,
        isDefault: false,
        createdAt: new Date('2025-07-18T17:27:44.895668Z'),
        updatedAt: new Date('2025-07-18T17:27:44.895668Z'),
      },
      {
        id: '329e0850-dda0-4fe6-9995-bc3c0e96f3d8',
        method: UserPaymentMethod.E_PAY,
        displayName: 'Плащане през Е-пей',
        description: 'Онлайн плащане през Е-пей',
        status: PaymentMethodStatus.ACTIVE,
        isDefault: false,
        createdAt: new Date('2025-07-18T17:27:44.895668Z'),
        updatedAt: new Date('2025-07-18T17:27:44.895668Z'),
      },
    ];

    await userPaymentMethodRepository.save(userPaymentMethods);
    console.log(`Seeded ${userPaymentMethods.length} user payment methods`);
  }
}
