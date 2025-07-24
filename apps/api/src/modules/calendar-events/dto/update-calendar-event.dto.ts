import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsEnum,
  IsOptional,
  IsBoolean,
  IsArray,
  IsDateString,
} from 'class-validator';
import {
  CalendarEventType,
  CalendarEventStatus,
  CalendarEventPriority,
  IUpdateCalendarEventRequest,
} from '@repo/interfaces';

export class UpdateCalendarEventDto implements IUpdateCalendarEventRequest {
  @ApiProperty({
    description: 'Event title',
    example: 'Monthly building meeting',
    required: false,
  })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiProperty({
    description: 'Event type',
    enum: CalendarEventType,
    example: CalendarEventType.MEETING,
    required: false,
  })
  @IsOptional()
  @IsEnum(CalendarEventType)
  type?: CalendarEventType;

  @ApiProperty({
    description: 'Event start date and time (ISO string)',
    example: '2024-01-15T14:00:00.000Z',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiProperty({
    description: 'Event end date and time (ISO string)',
    example: '2024-01-15T16:00:00.000Z',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  endDate?: string;

  @ApiProperty({
    description: 'Event description',
    example: 'Monthly meeting to discuss building matters',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    description: 'Event status',
    enum: CalendarEventStatus,
    example: CalendarEventStatus.SCHEDULED,
    required: false,
  })
  @IsOptional()
  @IsEnum(CalendarEventStatus)
  status?: CalendarEventStatus;

  @ApiProperty({
    description: 'Event priority',
    enum: CalendarEventPriority,
    example: CalendarEventPriority.MEDIUM,
    required: false,
  })
  @IsOptional()
  @IsEnum(CalendarEventPriority)
  priority?: CalendarEventPriority;

  @ApiProperty({
    description: 'Person assigned to handle the event',
    example: 'John Doe',
    required: false,
  })
  @IsOptional()
  @IsString()
  assignedTo?: string;

  @ApiProperty({
    description: 'Whether event applies to all apartments in the building',
    example: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  appliesToAllApartments?: boolean;

  @ApiProperty({
    description: 'Array of specific apartment IDs to target',
    example: ['apt1', 'apt2', 'apt3'],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  targetApartmentIds?: string[];

  @ApiProperty({
    description: 'Event location within building',
    example: 'Main lobby',
    required: false,
  })
  @IsOptional()
  @IsString()
  location?: string;

  @ApiProperty({
    description: 'Additional notes or comments',
    example: 'Bring building documents',
    required: false,
  })
  @IsOptional()
  @IsString()
  notes?: string;
}
