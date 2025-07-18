import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { TransactionType } from '@repo/interfaces';
import { InventoryEntity } from './inventory.entity';
import { UserPaymentMethodEntity } from './user-payment-method.entity';

@Entity('inventory_transactions')
export class InventoryTransactionEntity {
  @ApiProperty({
    description: 'Unique identifier',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    description: 'Source inventory ID (null for external deposits)',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @Column({ type: 'uuid', name: 'from_inventory_id', nullable: true })
  fromInventoryId?: string;

  @ApiProperty({
    description: 'Target inventory ID (null for external withdrawals)',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @Column({ type: 'uuid', name: 'to_inventory_id', nullable: true })
  toInventoryId?: string;

  @ApiProperty({
    description: 'User payment method ID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @Column({ type: 'uuid', name: 'user_payment_method_id', nullable: true })
  userPaymentMethodId?: string;

  @ApiProperty({
    description: 'Transaction type',
    enum: TransactionType,
    example: TransactionType.TRANSFER,
  })
  @Column({ type: 'enum', enum: TransactionType, name: 'type' })
  type: TransactionType;

  @ApiProperty({
    description: 'Transaction amount',
    example: 250.0,
  })
  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    name: 'amount',
  })
  amount: number;

  @ApiProperty({
    description: 'Transaction description',
    example: 'Transfer from main inventory to repair fund',
  })
  @Column({ type: 'text', name: 'description', nullable: true })
  description?: string;

  @ApiProperty({
    description: 'Reference ID for linking to payments, expenses, etc.',
    example: 'payment_123',
  })
  @Column({ type: 'varchar', name: 'reference_id', nullable: true })
  referenceId?: string;

  @ApiProperty({
    description: 'Creation timestamp',
    example: '2024-01-15T10:30:00Z',
  })
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @ApiProperty({
    description: 'User who created the transaction',
    example: 'user123',
  })
  @Column({ type: 'uuid', name: 'created_by', nullable: true })
  createdBy?: string;

  // Relationships
  @ManyToOne(() => InventoryEntity, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'from_inventory_id' })
  fromInventory?: InventoryEntity;

  @ManyToOne(() => InventoryEntity, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'to_inventory_id' })
  toInventory?: InventoryEntity;

  @ManyToOne(() => UserPaymentMethodEntity, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'user_payment_method_id' })
  userPaymentMethod?: UserPaymentMethodEntity;
}
