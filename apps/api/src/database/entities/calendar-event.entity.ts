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
import {
  CalendarEventType,
  CalendarEventStatus,
  CalendarEventPriority,
} from '@repo/interfaces';
import { BuildingEntity } from './building.entity';

@Entity('calendar_events')
export class CalendarEventEntity {
  @ApiProperty({
    description: 'Unique identifier',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    description: 'Event title',
    example: 'Monthly building meeting',
  })
  @Column({ type: 'varchar', name: 'title' })
  title: string;

  @ApiProperty({
    description: 'Event type',
    enum: CalendarEventType,
    example: CalendarEventType.MEETING,
  })
  @Column({ type: 'enum', enum: CalendarEventType, name: 'type' })
  type: CalendarEventType;

  @ApiProperty({
    description: 'Event start date and time',
    example: '2024-01-15T14:00:00Z',
  })
  @Column({ type: 'timestamp', name: 'start_date' })
  startDate: Date;

  @ApiProperty({
    description: 'Event end date and time',
    example: '2024-01-15T16:00:00Z',
  })
  @Column({ type: 'timestamp', name: 'end_date' })
  endDate: Date;

  @ApiProperty({
    description: 'Event description',
    example: 'Monthly meeting to discuss building matters',
    required: false,
  })
  @Column({ type: 'text', name: 'description', nullable: true })
  description?: string;

  @ApiProperty({
    description: 'Event status',
    enum: CalendarEventStatus,
    example: CalendarEventStatus.SCHEDULED,
  })
  @Column({
    type: 'enum',
    enum: CalendarEventStatus,
    name: 'status',
    default: CalendarEventStatus.SCHEDULED,
  })
  status: CalendarEventStatus;

  @ApiProperty({
    description: 'Event priority',
    enum: CalendarEventPriority,
    example: CalendarEventPriority.MEDIUM,
  })
  @Column({
    type: 'enum',
    enum: CalendarEventPriority,
    name: 'priority',
    default: CalendarEventPriority.MEDIUM,
  })
  priority: CalendarEventPriority;

  @ApiProperty({
    description: 'Person assigned to handle the event',
    example: 'John Doe',
    required: false,
  })
  @Column({ type: 'varchar', name: 'assigned_to', nullable: true })
  assignedTo?: string;

  @ApiProperty({
    description: 'Building ID where the event takes place - REQUIRED',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @Column({ type: 'uuid', name: 'building_id' })
  buildingId: string;

  @ApiProperty({
    description: 'Whether event applies to ALL apartments in the building',
    example: true,
  })
  @Column({
    type: 'boolean',
    name: 'applies_to_all_apartments',
    default: false,
  })
  appliesToAllApartments: boolean;

  @ApiProperty({
    description: 'Array of specific apartment IDs within the same building',
    example: ['apt1', 'apt2', 'apt3'],
    required: false,
  })
  @Column({ type: 'json', name: 'target_apartment_ids', nullable: true })
  targetApartmentIds?: string[];

  @ApiProperty({
    description: 'Event location within building',
    example: 'Main lobby, Conference room',
    required: false,
  })
  @Column({ type: 'varchar', name: 'location', nullable: true })
  location?: string;

  @ApiProperty({
    description: 'Additional notes or comments',
    example: 'Bring building documents',
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
    description: 'User who created the event',
    example: 'user123',
    required: false,
  })
  @Column({ type: 'uuid', name: 'created_by', nullable: true })
  createdBy?: string;

  @ApiProperty({
    description: 'User who last updated the event',
    example: 'user456',
    required: false,
  })
  @Column({ type: 'uuid', name: 'updated_by', nullable: true })
  updatedBy?: string;

  // Relationships
  @ManyToOne(() => BuildingEntity, { eager: true })
  @JoinColumn({ name: 'building_id' })
  building: BuildingEntity;

  // Helper methods
  getTargetedApartmentIds(): string[] | 'all' {
    if (this.appliesToAllApartments) {
      return 'all';
    }
    if (this.targetApartmentIds && this.targetApartmentIds.length > 0) {
      return this.targetApartmentIds;
    }
    return 'all'; // Default to all if nothing specified
  }

  isForSingleApartment(): boolean {
    return (
      !this.appliesToAllApartments &&
      this.targetApartmentIds !== null &&
      this.targetApartmentIds !== undefined &&
      this.targetApartmentIds.length === 1
    );
  }

  isForMultipleApartments(): boolean {
    return (
      !this.appliesToAllApartments &&
      this.targetApartmentIds !== null &&
      this.targetApartmentIds !== undefined &&
      this.targetApartmentIds.length > 1
    );
  }

  isForAllApartments(): boolean {
    return this.appliesToAllApartments;
  }
}
