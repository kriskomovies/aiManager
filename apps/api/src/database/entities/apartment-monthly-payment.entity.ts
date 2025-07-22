import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Unique,
  Index,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { ApartmentEntity } from './apartment.entity';
import { MonthlyFeeEntity } from './monthly-fee.entity';
import { UserPaymentMethodEntity } from './user-payment-method.entity';

export enum PaymentStatus {
  PENDING = 'pending',
  PAID = 'paid',
  OVERDUE = 'overdue',
  PARTIALLY_PAID = 'partially_paid',
}

@Entity('apartment_monthly_payments')
@Unique('unique_apartment_fee_month', [
  'apartmentId',
  'monthlyFeeId',
  'paymentMonth',
])
@Index(['apartmentId', 'paymentMonth'])
export class ApartmentMonthlyPaymentEntity {
  @ApiProperty({
    description: 'Unique identifier',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    description: 'Apartment ID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @Column({ type: 'uuid', name: 'apartment_id' })
  apartmentId: string;

  @ApiProperty({
    description: 'Monthly fee ID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @Column({ type: 'uuid', name: 'monthly_fee_id' })
  monthlyFeeId: string;

  @ApiProperty({
    description: 'Payment month (YYYY-MM format)',
    example: '2024-01',
  })
  @Column({ type: 'varchar', name: 'payment_month' })
  paymentMonth: string;

  @ApiProperty({
    description: 'Amount owed for this month',
    example: 37.75,
  })
  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    name: 'amount_owed',
  })
  amountOwed: number;

  @ApiProperty({
    description: 'Amount actually paid',
    example: 40.0,
  })
  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    name: 'amount_paid',
    default: '0',
  })
  amountPaid: number;

  @ApiProperty({
    description: 'Balance (amount_owed - amount_paid)',
    example: -2.25,
  })
  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    name: 'balance',
    default: 0,
  })
  balance: number;

  @ApiProperty({
    description: 'Payment status',
    enum: PaymentStatus,
    example: PaymentStatus.PAID,
  })
  @Column({
    type: 'enum',
    enum: PaymentStatus,
    name: 'status',
    default: PaymentStatus.PENDING,
  })
  status: PaymentStatus;

  @ApiProperty({
    description: 'Due date for this payment',
    example: '2024-01-31',
  })
  @Column({ type: 'date', name: 'due_date' })
  dueDate: Date;

  @ApiProperty({
    description: 'Date when payment was made',
    example: '2024-01-25',
    required: false,
  })
  @Column({ type: 'date', name: 'paid_date', nullable: true })
  paidDate?: Date;

  @ApiProperty({
    description: 'Payment method used',
    example: '550e8400-e29b-41d4-a716-446655440000',
    required: false,
  })
  @Column({ type: 'uuid', name: 'user_payment_method_id', nullable: true })
  userPaymentMethodId?: string;

  @ApiProperty({
    description: 'Payment notes',
    example: 'Paid via bank transfer',
    required: false,
  })
  @Column({ type: 'text', name: 'notes', nullable: true })
  notes?: string;

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

  // Relations
  @ManyToOne(() => ApartmentEntity, { eager: false })
  @JoinColumn({ name: 'apartment_id' })
  apartment: ApartmentEntity;

  @ManyToOne(() => MonthlyFeeEntity, { eager: false })
  @JoinColumn({ name: 'monthly_fee_id' })
  monthlyFee: MonthlyFeeEntity;

  @ManyToOne(() => UserPaymentMethodEntity, { eager: false })
  @JoinColumn({ name: 'user_payment_method_id' })
  userPaymentMethod?: UserPaymentMethodEntity;
}
