import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsEmail,
  IsOptional,
  IsUUID,
  IsArray,
  IsBoolean,
  MinLength,
  MaxLength,
  Matches,
} from 'class-validator';
import { ICreateUserRequest } from '@repo/interfaces';

export class CreateUserDto implements ICreateUserRequest {
  @ApiProperty({
    description: 'User email address',
    example: 'admin@building.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'User password',
    example: 'SecurePassword123!',
    minLength: 8,
  })
  @IsString()
  @MinLength(8)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, {
    message:
      'Password must contain at least 1 uppercase letter, 1 lowercase letter, 1 number and 1 special character',
  })
  password: string;

  @ApiProperty({
    description: 'User first name',
    example: 'Иван',
  })
  @IsString()
  @MaxLength(100)
  name: string;

  @ApiProperty({
    description: 'User surname',
    example: 'Петров',
  })
  @IsString()
  @MaxLength(100)
  surname: string;

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
  })
  @IsUUID()
  roleId: string;

  @ApiProperty({
    description: 'Resident ID if user is a resident',
    example: '550e8400-e29b-41d4-a716-446655440000',
    required: false,
  })
  @IsOptional()
  @IsUUID()
  residentId?: string;

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
    description: 'Whether user is using mobile app',
    example: false,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  isUsingMobileApp?: boolean;
}
