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
import { BuildingEntity } from './building.entity';

@Entity('inventories')
export class InventoryEntity {
  @ApiProperty({
    description: 'Unique identifier',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    description: 'Building ID this inventory belongs to',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @Column({ type: 'uuid', name: 'building_id' })
  buildingId: string;

  @ApiProperty({
    description: 'Inventory name',
    example: 'Основна Каса',
  })
  @Column({ type: 'varchar', name: 'name' })
  name: string;

  @ApiProperty({
    description: 'Inventory title',
    example: 'Основна Каса за Сграда',
  })
  @Column({ type: 'varchar', name: 'title', nullable: true })
  title?: string;

  @ApiProperty({
    description: 'Inventory description',
    example: 'Основна каса за всички общи разходи и приходи на сградата',
  })
  @Column({ type: 'text', name: 'description', nullable: true })
  description?: string;

  @ApiProperty({
    description: 'Current amount in the inventory',
    example: 585.0,
  })
  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    name: 'amount',
    default: 0,
  })
  amount: number;

  @ApiProperty({
    description: 'Whether this is the main inventory for the building',
    example: true,
  })
  @Column({ type: 'boolean', name: 'is_main', default: false })
  isMain: boolean;

  @ApiProperty({
    description: 'Whether inventory is visible in the application',
    example: true,
  })
  @Column({ type: 'boolean', name: 'visible_in_app', default: true })
  visibleInApp: boolean;

  @ApiProperty({
    description: 'Whether inventory is active',
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

  // Relationships
  @ManyToOne(() => BuildingEntity, (building) => building.inventories, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'building_id' })
  building: BuildingEntity;

  // Computed property for inventory type display
  get inventoryType(): string {
    return this.isMain ? 'Основна Каса' : 'Потребителска Каса';
  }
}
