import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { RecurringExpenseEntity } from './recurring-expense.entity';
import { UserPaymentMethodEntity } from './user-payment-method.entity';
import { MonthlyFeeEntity } from './monthly-fee.entity';

@Entity('recurring_expenses_payments')
export class RecurringExpensePaymentEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @Column({ type: 'uuid', name: 'recurring_expense_id' })
  recurringExpenseId: string;

  @Column({ type: 'uuid', name: 'user_payment_method_id' })
  userPaymentMethodId: string;

  @Column({ type: 'boolean', name: 'connect_payment', default: false })
  connectPayment: boolean;

  @Column({ type: 'uuid', name: 'monthly_fee_id', nullable: true })
  monthlyFeeId?: string;

  @Column({ type: 'text', name: 'reason', nullable: true })
  reason?: string;

  @Column({ type: 'date', name: 'payment_date' })
  paymentDate: Date;

  @Column({ type: 'boolean', name: 'issue_document', default: false })
  issueDocument: boolean;

  @Column({
    type: 'enum',
    enum: ['invoice', 'receipt'],
    name: 'document_type',
    nullable: true,
  })
  documentType?: 'invoice' | 'receipt';

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Relations
  @ManyToOne(() => RecurringExpenseEntity, { eager: false })
  @JoinColumn({ name: 'recurring_expense_id' })
  recurringExpense: RecurringExpenseEntity;

  @ManyToOne(() => UserPaymentMethodEntity, { eager: true })
  @JoinColumn({ name: 'user_payment_method_id' })
  userPaymentMethod: UserPaymentMethodEntity;

  @ManyToOne(() => MonthlyFeeEntity, { eager: false, nullable: true })
  @JoinColumn({ name: 'monthly_fee_id' })
  monthlyFee?: MonthlyFeeEntity;
}
