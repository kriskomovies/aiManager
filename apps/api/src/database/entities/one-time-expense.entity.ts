import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('one_time_expenses')
export class OneTimeExpenseEntity {
  @ApiProperty({
    description: 'Unique identifier',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: 'Expense name', example: 'Repair fee' })
  @Column({ type: 'varchar', name: 'name' })
  name: string;

  @ApiProperty({
    description: 'Contragent ID',
    example: 'contragent-uuid',
    required: false,
  })
  @Column({ type: 'uuid', name: 'contragent_id', nullable: true })
  contragentId?: string | null;

  @ApiProperty({
    description: 'Expense date',
    example: '2024-07-18T17:27:44.895Z',
  })
  @Column({ type: 'timestamp', name: 'expense_date' })
  expenseDate: Date;

  @ApiProperty({ description: 'Amount', example: 100.5 })
  @Column({ type: 'decimal', name: 'amount' })
  amount: number;

  @ApiProperty({ description: 'Inventory ID', example: 'inventory-uuid' })
  @Column({ type: 'uuid', name: 'inventory_id' })
  inventoryId: string;

  @ApiProperty({
    description: 'User payment method ID',
    example: 'user-payment-method-uuid',
  })
  @Column({ type: 'uuid', name: 'user_payment_method_id' })
  userPaymentMethodId: string;

  @ApiProperty({
    description: 'Note',
    example: 'Paid for urgent repair',
    required: false,
  })
  @Column({ type: 'text', name: 'note', nullable: true })
  note?: string;

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
}
