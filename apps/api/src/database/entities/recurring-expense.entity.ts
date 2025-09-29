import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { BuildingEntity } from './building.entity';
import { MonthlyFeeEntity } from './monthly-fee.entity';
import { UserPaymentMethodEntity } from './user-payment-method.entity';

@Entity('recurring_expenses')
export class RecurringExpenseEntity {
  @ApiProperty({
    description: 'Unique identifier',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    description: 'Building ID this recurring expense belongs to',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @Column({ type: 'uuid', name: 'building_id' })
  buildingId: string;

  @ApiProperty({ description: 'Expense name', example: 'Elevator Maintenance' })
  @Column({ type: 'varchar', name: 'name' })
  name: string;

  @ApiProperty({
    description: 'Monthly amount for this recurring expense',
    example: 585.0,
  })
  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    name: 'monthly_amount',
  })
  monthlyAmount: number;

  @ApiProperty({
    description: 'User payment method ID used for this expense',
    example: 'user-payment-method-uuid',
  })
  @Column({ type: 'uuid', name: 'user_payment_method_id' })
  userPaymentMethodId: string;

  @ApiProperty({
    description:
      'Whether this recurring expense was added as a new monthly fee (true) or linked to existing (false)',
    example: false,
  })
  @Column({ type: 'boolean', name: 'add_to_monthly_fees', default: false })
  addToMonthlyFees: boolean;

  @ApiProperty({
    description:
      'Related monthly fee ID - either existing or newly created (optional)',
    example: '550e8400-e29b-41d4-a716-446655440000',
    required: false,
  })
  @Column({ type: 'uuid', name: 'monthly_fee_id', nullable: true })
  monthlyFeeId?: string;

  @ApiProperty({
    description: 'Whether this recurring expense is active',
    example: true,
  })
  @Column({ type: 'boolean', name: 'is_active', default: true })
  isActive: boolean;

  @ApiProperty({
    description: 'Creation timestamp',
    example: '2024-07-18T17:27:44.895Z',
  })
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @ApiProperty({
    description: 'Last update timestamp',
    example: '2024-07-18T17:27:44.895Z',
  })
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ApiProperty({ description: 'User who created the record', required: false })
  @Column({ type: 'uuid', name: 'created_by', nullable: true })
  createdBy?: string;

  @ApiProperty({
    description: 'User who last updated the record',
    required: false,
  })
  @Column({ type: 'uuid', name: 'updated_by', nullable: true })
  updatedBy?: string;

  @ApiProperty({
    description: 'Contractor name',
    example: 'ABC Maintenance Ltd.',
    required: false,
  })
  @Column({ type: 'varchar', name: 'contractor', nullable: true })
  contractor?: string;

  @ApiProperty({
    description: 'Payment date',
    example: '2024-01-15',
    required: false,
  })
  @Column({ type: 'date', name: 'payment_date', nullable: true })
  paymentDate?: Date;

  @ApiProperty({
    description: 'Reason/purpose for the expense',
    example: 'Monthly elevator maintenance',
    required: false,
  })
  @Column({ type: 'text', name: 'reason', nullable: true })
  reason?: string;

  // Relations
  @ManyToOne(() => BuildingEntity, { eager: false })
  @JoinColumn({ name: 'building_id' })
  building: BuildingEntity;

  @ManyToOne(() => MonthlyFeeEntity, { eager: false, nullable: true })
  @JoinColumn({ name: 'monthly_fee_id' })
  monthlyFee?: MonthlyFeeEntity;

  @ManyToOne(() => UserPaymentMethodEntity, { eager: false })
  @JoinColumn({ name: 'user_payment_method_id' })
  userPaymentMethod: UserPaymentMethodEntity;
}
