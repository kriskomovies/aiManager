import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { FeePaymentBasis, FeeApplicationMode } from '@repo/interfaces';
import { BuildingEntity } from './building.entity';
import { MonthlyFeeApartmentEntity } from './monthly-fee-apartment.entity';

@Entity('monthly_fees')
export class MonthlyFeeEntity {
  @ApiProperty({
    description: 'Unique identifier',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    description: 'Building ID this fee belongs to',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @Column({ type: 'uuid', name: 'building_id' })
  buildingId: string;

  @ApiProperty({
    description: 'Fee name',
    example: 'Elevator Maintenance',
  })
  @Column({ type: 'varchar', name: 'name' })
  name: string;

  @ApiProperty({
    description: 'Payment basis for the fee',
    enum: FeePaymentBasis,
    example: FeePaymentBasis.APARTMENT,
  })
  @Column({ type: 'enum', enum: FeePaymentBasis, name: 'payment_basis' })
  paymentBasis: FeePaymentBasis;

  @ApiProperty({
    description: 'Application mode - monthly fee or total amount',
    enum: FeeApplicationMode,
    example: FeeApplicationMode.MONTHLY_FEE,
  })
  @Column({ type: 'enum', enum: FeeApplicationMode, name: 'application_mode' })
  applicationMode: FeeApplicationMode;

  @ApiProperty({
    description: 'Base amount for calculation',
    example: 25.5,
  })
  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    name: 'base_amount',
  })
  baseAmount: number;

  @ApiProperty({
    description: 'Whether fee is distributed evenly among apartments',
    example: true,
  })
  @Column({ type: 'boolean', name: 'is_distributed_evenly', default: true })
  isDistributedEvenly: boolean;

  @ApiProperty({
    description: 'Month this fee applies to (YYYY-MM format)',
    example: '2024-01',
    required: false,
  })
  @Column({ type: 'varchar', name: 'target_month', nullable: true })
  targetMonth?: string;

  @ApiProperty({
    description: 'Whether this fee is active',
    example: true,
  })
  @Column({ type: 'boolean', name: 'is_active', default: true })
  isActive: boolean;

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
  @ManyToOne(() => BuildingEntity, { eager: false })
  @JoinColumn({ name: 'building_id' })
  building: BuildingEntity;

  @OneToMany('MonthlyFeeApartmentEntity', 'monthlyFee', {
    cascade: true,
    eager: false,
  })
  apartments: MonthlyFeeApartmentEntity[];
}
