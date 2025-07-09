import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import {
  BuildingType,
  BuildingStatus,
  TaxGenerationPeriod,
} from '@repo/interfaces';
import { ApartmentEntity } from './apartment.entity';

@Entity('buildings')
export class BuildingEntity {
  @ApiProperty({
    description: 'Unique identifier',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    description: 'Building name',
    example: 'Sunset Apartments',
  })
  @Column({ type: 'varchar', name: 'name' })
  name: string;

  @ApiProperty({
    description: 'Building type',
    enum: BuildingType,
    example: BuildingType.RESIDENTIAL,
  })
  @Column({ type: 'enum', enum: BuildingType, name: 'type' })
  type: BuildingType;

  @ApiProperty({
    description: 'Building status',
    enum: BuildingStatus,
    example: BuildingStatus.ACTIVE,
  })
  @Column({
    type: 'enum',
    enum: BuildingStatus,
    name: 'status',
    nullable: true,
  })
  status?: BuildingStatus;

  @ApiProperty({
    description: 'City',
    example: 'Sofia',
  })
  @Column({ type: 'varchar', name: 'city' })
  city: string;

  @ApiProperty({
    description: 'District',
    example: 'Mladost',
  })
  @Column({ type: 'varchar', name: 'district' })
  district: string;

  @ApiProperty({
    description: 'Street',
    example: 'Aleksandar Malinov',
  })
  @Column({ type: 'varchar', name: 'street' })
  street: string;

  @ApiProperty({
    description: 'Building number',
    example: '78',
  })
  @Column({ type: 'varchar', name: 'number' })
  number: string;

  @ApiProperty({
    description: 'Entrance',
    example: 'A',
  })
  @Column({ type: 'varchar', name: 'entrance', nullable: true })
  entrance?: string;

  @ApiProperty({
    description: 'Postal code',
    example: '1712',
  })
  @Column({ type: 'varchar', name: 'postal_code' })
  postalCode: string;

  @ApiProperty({
    description: 'Common parts area',
    example: 150.5,
  })
  @Column({ type: 'numeric', name: 'common_parts_area', nullable: true })
  commonPartsArea?: number;

  @ApiProperty({
    description: 'Total quadrature',
    example: 2500,
  })
  @Column({ type: 'numeric', name: 'quadrature', nullable: true })
  quadrature?: number;

  @ApiProperty({
    description: 'Parking slots',
    example: 24,
  })
  @Column({ type: 'integer', name: 'parking_slots', nullable: true })
  parkingSlots?: number;

  @ApiProperty({
    description: 'Number of basements',
    example: 1,
  })
  @Column({ type: 'integer', name: 'basements', nullable: true })
  basements?: number;

  @ApiProperty({
    description: 'Total apartment count',
    example: 48,
  })
  @Column({ type: 'integer', name: 'apartment_count', nullable: true })
  apartmentCount?: number;

  @ApiProperty({
    description: 'Current balance',
    example: 15000.5,
  })
  @Column({ type: 'numeric', name: 'balance', nullable: true })
  balance?: number;

  @ApiProperty({
    description: 'Monthly fee',
    example: 25,
  })
  @Column({ type: 'numeric', name: 'monthly_fee', nullable: true })
  monthlyFee?: number;

  @ApiProperty({
    description: 'Total debt',
    example: 500,
  })
  @Column({ type: 'numeric', name: 'debt', nullable: true })
  debt?: number;

  @ApiProperty({
    description: 'Tax generation period',
    enum: TaxGenerationPeriod,
    example: TaxGenerationPeriod.MONTHLY,
  })
  @Column({
    type: 'enum',
    enum: TaxGenerationPeriod,
    name: 'tax_generation_period',
    nullable: true,
  })
  taxGenerationPeriod?: TaxGenerationPeriod;

  @ApiProperty({
    description: 'Tax generation day',
    example: 15,
  })
  @Column({ type: 'integer', name: 'tax_generation_day', nullable: true })
  taxGenerationDay?: number;

  @ApiProperty({
    description: 'Homebook start date',
    example: '2024-01-01',
  })
  @Column({ type: 'date', name: 'homebook_start_date' })
  homebookStartDate: Date;

  @ApiProperty({
    description: 'Next tax date',
    example: '2024-02-15',
  })
  @Column({ type: 'date', name: 'next_tax_date', nullable: true })
  nextTaxDate?: Date;

  @ApiProperty({
    description: 'Invoice enabled',
    example: true,
  })
  @Column({ type: 'boolean', name: 'invoice_enabled', nullable: true })
  invoiceEnabled?: boolean;

  @ApiProperty({
    description: 'Total units',
    example: 48,
  })
  @Column({ type: 'integer', name: 'total_units', nullable: true })
  totalUnits?: number;

  @ApiProperty({
    description: 'Occupied units',
    example: 45,
  })
  @Column({ type: 'integer', name: 'occupied_units', nullable: true })
  occupiedUnits?: number;

  @ApiProperty({
    description: 'Number of irregularities',
    example: 2,
  })
  @Column({ type: 'integer', name: 'irregularities', nullable: true })
  irregularities?: number;

  @ApiProperty({
    description: 'Occupancy rate',
    example: 93.75,
  })
  @Column({ type: 'numeric', name: 'occupancy_rate', nullable: true })
  occupancyRate?: number;

  @ApiProperty({
    description: 'Monthly revenue',
    example: 1200,
  })
  @Column({ type: 'numeric', name: 'monthly_revenue', nullable: true })
  monthlyRevenue?: number;

  @ApiProperty({
    description: 'Annual revenue',
    example: 14400,
  })
  @Column({ type: 'numeric', name: 'annual_revenue', nullable: true })
  annualRevenue?: number;

  @ApiProperty({
    description: 'Description',
    example: 'Modern residential building',
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
  @OneToMany(() => ApartmentEntity, (apartment) => apartment.building, {
    cascade: true,
  })
  apartments: ApartmentEntity[];

  // Computed property for address
  get address(): string {
    return `${this.street} ${this.number}${this.entrance ? `, Entrance ${this.entrance}` : ''}, ${this.district}, ${this.city} ${this.postalCode}`;
  }
}
