import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
  ApiQuery,
} from '@nestjs/swagger';
import { CalendarEventsService } from './calendar-events.service';
import { CreateCalendarEventDto } from './dto/create-calendar-event.dto';
import { UpdateCalendarEventDto } from './dto/update-calendar-event.dto';
import { CalendarEventQueryDto } from './dto/calendar-event-query.dto';
import { CalendarEventEntity } from '../../database/entities/calendar-event.entity';
import { ApiPaginatedResponse } from '../../common/decorators/api-paginated-response.decorator';

@ApiTags('Calendar Events')
@Controller('calendar-events')
export class CalendarEventsController {
  constructor(private readonly calendarEventsService: CalendarEventsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new calendar event' })
  @ApiBody({ type: CreateCalendarEventDto })
  @ApiResponse({
    status: 201,
    description: 'Calendar event created successfully',
    type: CalendarEventEntity,
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async create(
    @Body() createCalendarEventDto: CreateCalendarEventDto,
  ): Promise<CalendarEventEntity> {
    return await this.calendarEventsService.create(createCalendarEventDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Get all calendar events with pagination and filtering',
  })
  @ApiPaginatedResponse(CalendarEventEntity)
  @ApiQuery({ type: CalendarEventQueryDto })
  async findAll(@Query() query: CalendarEventQueryDto) {
    return await this.calendarEventsService.findAll(query);
  }

  @Get('building/:buildingId')
  @ApiOperation({ summary: 'Get all events for a specific building' })
  @ApiParam({
    name: 'buildingId',
    description: 'Building ID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiResponse({
    status: 200,
    description: 'Events retrieved successfully',
    type: [CalendarEventEntity],
  })
  async findByBuildingId(
    @Param('buildingId') buildingId: string,
  ): Promise<CalendarEventEntity[]> {
    return await this.calendarEventsService.findByBuildingId(buildingId);
  }

  @Get('building/:buildingId/upcoming')
  @ApiOperation({ summary: 'Get upcoming events for a specific building' })
  @ApiParam({
    name: 'buildingId',
    description: 'Building ID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiQuery({
    name: 'limit',
    description: 'Maximum number of events to return',
    example: 5,
    required: false,
  })
  @ApiResponse({
    status: 200,
    description: 'Upcoming events retrieved successfully',
    type: [CalendarEventEntity],
  })
  async findUpcomingByBuildingId(
    @Param('buildingId') buildingId: string,
    @Query('limit') limit?: number,
  ): Promise<CalendarEventEntity[]> {
    return await this.calendarEventsService.findUpcomingByBuildingId(
      buildingId,
      limit,
    );
  }

  @Get('building/:buildingId/date-range')
  @ApiOperation({ summary: 'Get events for a building within a date range' })
  @ApiParam({
    name: 'buildingId',
    description: 'Building ID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiQuery({
    name: 'startDate',
    description: 'Start date (ISO string)',
    example: '2024-01-01T00:00:00.000Z',
  })
  @ApiQuery({
    name: 'endDate',
    description: 'End date (ISO string)',
    example: '2024-12-31T23:59:59.999Z',
  })
  @ApiResponse({
    status: 200,
    description: 'Events in date range retrieved successfully',
    type: [CalendarEventEntity],
  })
  async findByDateRange(
    @Param('buildingId') buildingId: string,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ): Promise<CalendarEventEntity[]> {
    return await this.calendarEventsService.findByDateRange(
      buildingId,
      startDate,
      endDate,
    );
  }

  @Get('building/:buildingId/apartments')
  @ApiOperation({ summary: 'Get events for specific apartments in a building' })
  @ApiParam({
    name: 'buildingId',
    description: 'Building ID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiQuery({
    name: 'apartmentIds',
    description: 'Comma-separated apartment IDs',
    example: 'apt1,apt2,apt3',
  })
  @ApiResponse({
    status: 200,
    description: 'Events for apartments retrieved successfully',
    type: [CalendarEventEntity],
  })
  async findByApartmentIds(
    @Param('buildingId') buildingId: string,
    @Query('apartmentIds') apartmentIds: string,
  ): Promise<CalendarEventEntity[]> {
    const apartmentIdArray = apartmentIds.split(',').map((id) => id.trim());
    return await this.calendarEventsService.findByApartmentIds(
      buildingId,
      apartmentIdArray,
    );
  }

  @Get('stats')
  @ApiOperation({ summary: 'Get calendar event statistics' })
  @ApiQuery({
    name: 'buildingId',
    description:
      'Building ID (optional - if not provided, returns overall stats)',
    example: '550e8400-e29b-41d4-a716-446655440000',
    required: false,
  })
  @ApiResponse({
    status: 200,
    description: 'Event statistics retrieved successfully',
  })
  async getEventStats(@Query('buildingId') buildingId?: string) {
    return await this.calendarEventsService.getEventStats(buildingId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a calendar event by ID' })
  @ApiParam({
    name: 'id',
    description: 'Calendar event ID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiResponse({
    status: 200,
    description: 'Calendar event retrieved successfully',
    type: CalendarEventEntity,
  })
  @ApiResponse({ status: 404, description: 'Calendar event not found' })
  async findOne(@Param('id') id: string): Promise<CalendarEventEntity> {
    return await this.calendarEventsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a calendar event' })
  @ApiParam({
    name: 'id',
    description: 'Calendar event ID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiBody({ type: UpdateCalendarEventDto })
  @ApiResponse({
    status: 200,
    description: 'Calendar event updated successfully',
    type: CalendarEventEntity,
  })
  @ApiResponse({ status: 404, description: 'Calendar event not found' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async update(
    @Param('id') id: string,
    @Body() updateCalendarEventDto: UpdateCalendarEventDto,
  ): Promise<CalendarEventEntity> {
    return await this.calendarEventsService.update(id, updateCalendarEventDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a calendar event' })
  @ApiParam({
    name: 'id',
    description: 'Calendar event ID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiResponse({
    status: 204,
    description: 'Calendar event deleted successfully',
  })
  @ApiResponse({ status: 404, description: 'Calendar event not found' })
  async remove(@Param('id') id: string): Promise<void> {
    return await this.calendarEventsService.remove(id);
  }
}
