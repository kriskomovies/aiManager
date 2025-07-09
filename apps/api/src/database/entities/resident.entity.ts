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
import { ResidentRole } from '@repo/interfaces';

@Entity('residents')
export class ResidentEntity {
  @ApiProperty({
    description: 'Unique identifier',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    description: 'Apartment ID this resident belongs to',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @Column({ type: 'uuid', name: 'apartment_id' })
  apartmentId: string;

  @ApiProperty({
    description: 'Resident first name',
    example: 'John',
  })
  @Column({ type: 'varchar', name: 'name' })
  name: string;

  @ApiProperty({
    description: 'Resident surname',
    example: 'Doe',
  })
  @Column({ type: 'varchar', name: 'surname' })
  surname: string;

  @ApiProperty({
    description: 'Resident phone number',
    example: '+359888123456',
  })
  @Column({ type: 'varchar', name: 'phone' })
  phone: string;

  @ApiProperty({
    description: 'Resident email address',
    example: 'john.doe@example.com',
  })
  @Column({ type: 'varchar', name: 'email' })
  email: string;

  @ApiProperty({
    description: 'Resident role',
    enum: ResidentRole,
    example: ResidentRole.OWNER,
  })
  @Column({ type: 'enum', enum: ResidentRole, name: 'role' })
  role: ResidentRole;

  @ApiProperty({
    description: 'Whether this resident is the main contact',
    example: true,
  })
  @Column({ type: 'boolean', name: 'is_main_contact', default: false })
  isMainContact: boolean;

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

  // Relationships
  @ManyToOne('ApartmentEntity', 'residents', {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'apartment_id' })
  apartment: any;

  // Computed property for full name
  get fullName(): string {
    return `${this.name} ${this.surname}`;
  }
}
