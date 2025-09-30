import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsEmail,
  IsOptional,
  IsUUID,
  IsArray,
  IsBoolean,
  IsEnum,
  MaxLength,
} from 'class-validator';
import { UserStatus, IUpdateUserRequest } from '@repo/interfaces';

export class UpdateUserDto implements IUpdateUserRequest {
  @ApiProperty({
    description: 'User email address',
    example: 'admin@building.com',
    required: false,
  })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({
    description: 'User first name',
    example: 'Иван',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  name?: string;

  @ApiProperty({
    description: 'User surname',
    example: 'Петров',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  surname?: string;

  @ApiProperty({
    description: 'User phone number',
    example: '+359888123456',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  phone?: string;

  @ApiProperty({
    description: 'User role ID',
    example: '550e8400-e29b-41d4-a716-446655440000',
    required: false,
  })
  @IsOptional()
  @IsUUID()
  roleId?: string;

  @ApiProperty({
    description: 'Resident ID if user is a resident',
    example: '550e8400-e29b-41d4-a716-446655440000',
    required: false,
  })
  @IsOptional()
  @IsUUID()
  residentId?: string;

  @ApiProperty({
    description: 'User account status',
    enum: UserStatus,
    example: UserStatus.ACTIVE,
    required: false,
  })
  @IsOptional()
  @IsEnum(UserStatus)
  status?: UserStatus;

  @ApiProperty({
    description: 'Buildings this user has access to',
    example: ['550e8400-e29b-41d4-a716-446655440000'],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @IsUUID(4, { each: true })
  buildingAccess?: string[];

  @ApiProperty({
    description: 'User avatar URL',
    example: '/uploads/avatars/user-avatar.jpg',
    required: false,
  })
  @IsOptional()
  @IsString()
  avatarUrl?: string;

  @ApiProperty({
    description: 'Whether user is using mobile app',
    example: false,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  isUsingMobileApp?: boolean;
}
