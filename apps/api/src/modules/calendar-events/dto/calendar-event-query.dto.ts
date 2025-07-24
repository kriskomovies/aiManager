import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsEnum,
  IsOptional,
  IsBoolean,
  IsDateString,
  IsUUID,
  IsInt,
  Min,
  Max,
} from 'class-validator';
import { Transform } from 'class-transformer';
import {
  CalendarEventType,
  CalendarEventStatus,
  CalendarEventPriority,
} from '@repo/interfaces';

export class CalendarEventQueryDto {
  @ApiProperty({
    description: 'Page number for pagination',
    example: 1,
    required: false,
  })
  @IsOptional()
  @Transform(({ value }) => parseInt(value as string, 10))
  @IsInt()
  @Min(1)
  page?: number;

  @ApiProperty({
    description: 'Number of items per page',
    example: 10,
    required: false,
  })
  @IsOptional()
  @Transform(({ value }) => parseInt(value as string, 10))
  @IsInt()
  @Min(1)
  @Max(1000)
  limit?: number;

  @ApiProperty({
    description: 'Sort field and direction (field:direction)',
    example: 'startDate:ASC',
    required: false,
  })
  @IsOptional()
  @IsString()
  sort?: string;

  @ApiProperty({
    description: 'Search term for title, description, or assigned person',
    example: 'meeting',
    required: false,
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiProperty({
    description: 'Building ID to filter events',
    example: '550e8400-e29b-41d4-a716-446655440000',
    required: false,
  })
  @IsOptional()
  @IsUUID()
  buildingId?: string;

  @ApiProperty({
    description: 'Event type filter',
    enum: CalendarEventType,
    example: CalendarEventType.MEETING,
    required: false,
  })
  @IsOptional()
  @IsEnum(CalendarEventType)
  type?: CalendarEventType;

  @ApiProperty({
    description: 'Event status filter',
    enum: CalendarEventStatus,
    example: CalendarEventStatus.SCHEDULED,
    required: false,
  })
  @IsOptional()
  @IsEnum(CalendarEventStatus)
  status?: CalendarEventStatus;

  @ApiProperty({
    description: 'Event priority filter',
    enum: CalendarEventPriority,
    example: CalendarEventPriority.MEDIUM,
    required: false,
  })
  @IsOptional()
  @IsEnum(CalendarEventPriority)
  priority?: CalendarEventPriority;

  @ApiProperty({
    description: 'Filter events starting from this date (ISO string)',
    example: '2024-01-01T00:00:00.000Z',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiProperty({
    description: 'Filter events ending before this date (ISO string)',
    example: '2024-12-31T23:59:59.999Z',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  endDate?: string;

  @ApiProperty({
    description: 'Filter by assigned person',
    example: 'John Doe',
    required: false,
  })
  @IsOptional()
  @IsString()
  assignedTo?: string;

  @ApiProperty({
    description: 'Filter events that apply to all apartments',
    example: true,
    required: false,
  })
  @IsOptional()
  @Transform(({ value }) => value === 'true')
  @IsBoolean()
  appliesToAllApartments?: boolean;
}
