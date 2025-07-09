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
import { ApartmentType, ApartmentStatus } from '@repo/interfaces';
import { BuildingEntity } from './building.entity';

@Entity('apartments')
export class ApartmentEntity {
  @ApiProperty({
    description: 'Unique identifier',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    description: 'Building ID this apartment belongs to',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @Column({ type: 'uuid', name: 'building_id' })
  buildingId: string;

  @ApiProperty({
    description: 'Apartment type',
    enum: ApartmentType,
    example: ApartmentType.APARTMENT,
  })
  @Column({ type: 'enum', enum: ApartmentType, name: 'type' })
  type: ApartmentType;

  @ApiProperty({
    description: 'Apartment number',
    example: '12A',
  })
  @Column({ type: 'varchar', name: 'number' })
  number: string;

  @ApiProperty({
    description: 'Floor number',
    example: 3,
  })
  @Column({ type: 'integer', name: 'floor' })
  floor: number;

  @ApiProperty({
    description: 'Apartment quadrature in square meters',
    example: 85.5,
  })
  @Column({ type: 'numeric', name: 'quadrature' })
  quadrature: number;

  @ApiProperty({
    description: 'Common parts area in square meters',
    example: 12.5,
  })
  @Column({ type: 'numeric', name: 'common_parts', nullable: true })
  commonParts?: number;

  @ApiProperty({
    description: 'Ideal parts area in square meters',
    example: 8.3,
  })
  @Column({ type: 'numeric', name: 'ideal_parts', nullable: true })
  idealParts?: number;

  @ApiProperty({
    description: 'Number of residents',
    example: 3,
  })
  @Column({ type: 'integer', name: 'residents_count', default: 0 })
  residentsCount: number;

  @ApiProperty({
    description: 'Number of pets',
    example: 1,
  })
  @Column({ type: 'integer', name: 'pets', default: 0 })
  pets: number;

  @ApiProperty({
    description: 'Apartment status',
    enum: ApartmentStatus,
    example: ApartmentStatus.OCCUPIED,
  })
  @Column({
    type: 'enum',
    enum: ApartmentStatus,
    name: 'status',
    default: ApartmentStatus.VACANT,
  })
  status: ApartmentStatus;

  @ApiProperty({
    description: 'Whether invoice generation is enabled',
    example: true,
  })
  @Column({ type: 'boolean', name: 'invoice_enabled', default: false })
  invoiceEnabled: boolean;

  @ApiProperty({
    description: 'Whether apartment is blocked for payment',
    example: false,
  })
  @Column({ type: 'boolean', name: 'block_for_payment', default: false })
  blockForPayment: boolean;

  @ApiProperty({
    description: 'Note visible to cashier',
    example: 'Special payment arrangement',
  })
  @Column({ type: 'text', name: 'cashier_note', nullable: true })
  cashierNote?: string;

  @ApiProperty({
    description: 'Monthly rent amount',
    example: 800,
  })
  @Column({ type: 'numeric', name: 'monthly_rent', nullable: true })
  monthlyRent?: number;

  @ApiProperty({
    description: 'Monthly maintenance fee',
    example: 50,
  })
  @Column({ type: 'numeric', name: 'maintenance_fee', nullable: true })
  maintenanceFee?: number;

  @ApiProperty({
    description: 'Current debt amount',
    example: 150,
  })
  @Column({ type: 'numeric', name: 'debt', nullable: true, default: 0 })
  debt?: number;

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

  // Relationships
  @ManyToOne(() => BuildingEntity, (building) => building.apartments, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'building_id' })
  building: BuildingEntity;

  @OneToMany('ResidentEntity', 'apartment', {
    cascade: true,
  })
  residents: any[];

  // Computed property for full apartment identifier
  get fullNumber(): string {
    return `Floor ${this.floor}, Apt ${this.number}`;
  }
}
