import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { UserStatus } from '@repo/interfaces';
import { UserRoleEntity } from './user-role.entity';
import { ResidentEntity } from './resident.entity';

@Entity('users')
@Index(['email'], { unique: true })
export class UserEntity {
  @ApiProperty({
    description: 'Unique identifier',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    description: 'User email address',
    example: 'admin@building.com',
  })
  @Column({ type: 'varchar', name: 'email', unique: true })
  email: string;

  @Exclude() // Exclude from API responses
  @Column({ type: 'varchar', name: 'password_hash' })
  passwordHash: string;

  @ApiProperty({
    description: 'User first name',
    example: 'Иван',
  })
  @Column({ type: 'varchar', name: 'name' })
  name: string;

  @ApiProperty({
    description: 'User surname',
    example: 'Петров',
  })
  @Column({ type: 'varchar', name: 'surname' })
  surname: string;

  @ApiProperty({
    description: 'User phone number',
    example: '+359888123456',
  })
  @Column({ type: 'varchar', name: 'phone', nullable: true })
  phone?: string;

  @ApiProperty({
    description: 'Role ID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @Column({ type: 'uuid', name: 'role_id' })
  roleId: string;

  @ApiProperty({
    description: 'Resident ID if user is a resident',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @Column({ type: 'uuid', name: 'resident_id', nullable: true })
  residentId?: string;

  @ApiProperty({
    description: 'User account status',
    enum: UserStatus,
    example: UserStatus.ACTIVE,
  })
  @Column({
    type: 'enum',
    enum: UserStatus,
    name: 'status',
    default: UserStatus.ACTIVE,
  })
  status: UserStatus;

  @ApiProperty({
    description: 'Buildings this user has access to',
    type: [String],
  })
  @Column({ type: 'simple-array', name: 'building_access', nullable: true })
  buildingAccess?: string[];

  @ApiProperty({
    description: 'User avatar URL',
    example: '/uploads/avatars/user-avatar.jpg',
  })
  @Column({ type: 'varchar', name: 'avatar_url', nullable: true })
  avatarUrl?: string;

  @ApiProperty({
    description: 'Whether user is using mobile app',
    example: true,
  })
  @Column({ type: 'boolean', name: 'is_using_mobile_app', default: false })
  isUsingMobileApp: boolean;

  @ApiProperty({
    description: 'Last login timestamp',
    example: '2024-01-15T10:30:00Z',
  })
  @Column({ type: 'timestamp', name: 'last_login_at', nullable: true })
  lastLoginAt?: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @Column({ type: 'uuid', name: 'created_by', nullable: true })
  createdBy?: string;

  @Column({ type: 'uuid', name: 'updated_by', nullable: true })
  updatedBy?: string;

  // Relationships
  @ManyToOne(() => UserRoleEntity, (role) => role.users, {
    eager: true, // Always load role with user
    onDelete: 'RESTRICT', // Prevent deletion of roles that have users
  })
  @JoinColumn({ name: 'role_id' })
  role: UserRoleEntity;

  @ManyToOne(() => ResidentEntity, {
    nullable: true,
    onDelete: 'SET NULL', // If resident is deleted, set residentId to null
  })
  @JoinColumn({ name: 'resident_id' })
  resident?: ResidentEntity;

  // TODO: Add assignedIrregularities relationship when IrregularityEntity is implemented
  // @OneToMany('IrregularityEntity', 'assignedUser', { cascade: false })
  // assignedIrregularities: any[];

  // Computed properties
  get fullName(): string {
    return `${this.name} ${this.surname}`;
  }

  get isResident(): boolean {
    return !!this.residentId;
  }

  // Permission helpers
  hasPermission(permission: string): boolean {
    return this.role?.hasPermission(permission) || false;
  }

  hasAnyPermission(permissions: string[]): boolean {
    return this.role?.hasAnyPermission(permissions) || false;
  }

  canAccessBuilding(buildingId: string): boolean {
    // Admin can access all buildings
    if (this.role?.name === 'admin') {
      return true;
    }

    // Check explicit building access
    if (this.buildingAccess?.includes(buildingId)) {
      return true;
    }

    // Check if resident has access through their apartment
    return false;
  }
}
