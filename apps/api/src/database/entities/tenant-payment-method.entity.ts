import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { TenantPaymentMethod, PaymentMethodStatus } from '@repo/interfaces';

@Entity('tenant_payment_methods')
export class TenantPaymentMethodEntity {
  @ApiProperty({
    description: 'Unique identifier',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    description: 'Payment method type',
    enum: TenantPaymentMethod,
    example: TenantPaymentMethod.CASHIER,
  })
  @Column({ type: 'enum', enum: TenantPaymentMethod, name: 'method' })
  method: TenantPaymentMethod;

  @ApiProperty({
    description: 'Display name for the payment method',
    example: 'Касиер',
  })
  @Column({ type: 'varchar', name: 'display_name' })
  displayName: string;

  @ApiProperty({
    description: 'Payment method description',
    example: 'Плащане в брой на касиера',
  })
  @Column({ type: 'text', name: 'description', nullable: true })
  description?: string;

  @ApiProperty({
    description: 'Payment method status',
    enum: PaymentMethodStatus,
    example: PaymentMethodStatus.ACTIVE,
  })
  @Column({
    type: 'enum',
    enum: PaymentMethodStatus,
    name: 'status',
    default: PaymentMethodStatus.ACTIVE,
  })
  status: PaymentMethodStatus;

  @ApiProperty({
    description: 'Whether this is the default payment method',
    example: false,
  })
  @Column({ type: 'boolean', name: 'is_default', default: false })
  isDefault: boolean;

  @ApiProperty({
    description: 'Creation timestamp',
    example: '2024-01-15T10:30:00Z',
  })
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @ApiProperty({
    description: 'Last update timestamp',
    example: '2024-01-15T10:30:00Z',
  })
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ApiProperty({
    description: 'User who created the record',
    example: 'user123',
    required: false,
  })
  @Column({ type: 'uuid', name: 'created_by', nullable: true })
  createdBy?: string;

  @ApiProperty({
    description: 'User who last updated the record',
    example: 'user456',
    required: false,
  })
  @Column({ type: 'uuid', name: 'updated_by', nullable: true })
  updatedBy?: string;
}
