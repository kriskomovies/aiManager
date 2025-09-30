import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { UserEntity } from './user.entity';

@Entity('user_roles')
export class UserRoleEntity {
  @ApiProperty({
    description: 'Unique identifier',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    description: 'Role name',
    example: 'admin',
  })
  @Column({ type: 'varchar', length: 50, name: 'name', unique: true })
  name: string;

  @ApiProperty({
    description: 'Role description',
    example: 'Full system access with all permissions',
  })
  @Column({ type: 'text', name: 'description', nullable: true })
  description?: string;

  @ApiProperty({
    description: 'Role permissions as JSON array',
    example: ['buildings.read', 'buildings.write', 'users.manage'],
  })
  @Column({ type: 'simple-array', name: 'permissions' })
  permissions: string[];

  @ApiProperty({
    description: 'Whether this role is active',
    example: true,
  })
  @Column({ type: 'boolean', name: 'is_active', default: true })
  isActive: boolean;

  @ApiProperty({
    description: 'Whether this role is a system role (cannot be deleted)',
    example: true,
  })
  @Column({ type: 'boolean', name: 'is_system', default: false })
  isSystem: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @Column({ type: 'uuid', name: 'created_by', nullable: true })
  createdBy?: string;

  @Column({ type: 'uuid', name: 'updated_by', nullable: true })
  updatedBy?: string;

  // Relationships
  @OneToMany(() => UserEntity, (user) => user.role)
  users: UserEntity[];

  // Helper methods
  hasPermission(permission: string): boolean {
    return (
      this.permissions.includes(permission) || this.permissions.includes('*')
    );
  }

  hasAnyPermission(permissions: string[]): boolean {
    return permissions.some((permission) => this.hasPermission(permission));
  }
}
