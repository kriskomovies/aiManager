import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Unique,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { MonthlyFeeEntity } from './monthly-fee.entity';
import { ApartmentEntity } from './apartment.entity';

@Entity('monthly_fee_apartments')
@Unique('unique_fee_apartment', ['monthlyFeeId', 'apartmentId'])
export class MonthlyFeeApartmentEntity {
  @ApiProperty({
    description: 'Unique identifier',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    description: 'Monthly fee ID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @Column({ type: 'uuid', name: 'monthly_fee_id' })
  monthlyFeeId: string;

  @ApiProperty({
    description: 'Apartment ID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @Column({ type: 'uuid', name: 'apartment_id' })
  apartmentId: string;

  @ApiProperty({
    description: 'Coefficient for this apartment',
    example: 1.5,
  })
  @Column({
    type: 'decimal',
    precision: 5,
    scale: 2,
    name: 'coefficient',
    default: 1,
  })
  coefficient: number;

  @ApiProperty({
    description: 'Calculated amount for this apartment',
    example: 37.75,
  })
  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    name: 'calculated_amount',
  })
  calculatedAmount: number;

  @ApiProperty({
    description: 'Description for this apartment fee',
    example: 'Higher fee due to larger apartment',
    required: false,
  })
  @Column({ type: 'text', name: 'description', nullable: true })
  description?: string;

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

  // Relations
  @ManyToOne(() => MonthlyFeeEntity, 'apartments', {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'monthly_fee_id' })
  monthlyFee: MonthlyFeeEntity;

  @ManyToOne(() => ApartmentEntity, { eager: false })
  @JoinColumn({ name: 'apartment_id' })
  apartment: ApartmentEntity;
}
