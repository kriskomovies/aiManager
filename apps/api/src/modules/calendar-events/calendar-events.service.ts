import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { CalendarEventEntity } from '../../database/entities/calendar-event.entity';
import {
  CalendarEventRepository,
  CalendarEventQueryParams,
} from '../../database/repositories/calendar-event.repository';
import { CreateCalendarEventDto } from './dto/create-calendar-event.dto';
import { UpdateCalendarEventDto } from './dto/update-calendar-event.dto';
import { CalendarEventQueryDto } from './dto/calendar-event-query.dto';
import { IPaginatedResult } from '../../common/abstracts/base-repository.abstract';
import { CalendarEventPriority } from '@repo/interfaces';

@Injectable()
export class CalendarEventsService {
  constructor(
    private readonly calendarEventRepository: CalendarEventRepository,
  ) {}

  async create(
    createCalendarEventDto: CreateCalendarEventDto,
  ): Promise<CalendarEventEntity> {
    // Validate apartment targeting logic
    this.validateApartmentTargeting(createCalendarEventDto);

    // Set default values
    const eventData: Partial<CalendarEventEntity> = {
      ...createCalendarEventDto,
      priority: createCalendarEventDto.priority || CalendarEventPriority.MEDIUM,
      appliesToAllApartments:
        createCalendarEventDto.appliesToAllApartments ?? false,
      startDate: new Date(createCalendarEventDto.startDate),
      endDate: new Date(createCalendarEventDto.endDate),
    };

    // Validate date logic
    if (eventData.startDate! >= eventData.endDate!) {
      throw new BadRequestException('Start date must be before end date');
    }

    return await this.calendarEventRepository.create(eventData);
  }

  async findAll(
    queryDto: CalendarEventQueryDto,
  ): Promise<IPaginatedResult<CalendarEventEntity>> {
    // Transform frontend DTO to backend query parameters
    const repositoryQuery: CalendarEventQueryParams = {
      page: queryDto.page,
      limit: queryDto.limit, // Use limit directly since DTO now has limit
      search: queryDto.search,
      buildingId: queryDto.buildingId,
      type: queryDto.type as string,
      status: queryDto.status as string,
      priority: queryDto.priority as string,
      startDate: queryDto.startDate,
      endDate: queryDto.endDate,
      assignedTo: queryDto.assignedTo,
      appliesToAllApartments: queryDto.appliesToAllApartments,
    };

    // Handle sorting
    if (queryDto.sort) {
      const [field, direction] = queryDto.sort.split(':');
      repositoryQuery.sortBy = field;
      repositoryQuery.sortOrder =
        (direction?.toUpperCase() as 'ASC' | 'DESC') || 'ASC';
    }

    return await this.calendarEventRepository.findAllWithFilters(
      repositoryQuery,
    );
  }

  async findByBuildingId(buildingId: string): Promise<CalendarEventEntity[]> {
    return await this.calendarEventRepository.findByBuildingId(buildingId);
  }

  async findUpcomingByBuildingId(
    buildingId: string,
    limit = 5,
  ): Promise<CalendarEventEntity[]> {
    return await this.calendarEventRepository.findUpcomingByBuildingId(
      buildingId,
      limit,
    );
  }

  async findByDateRange(
    buildingId: string,
    startDate: string,
    endDate: string,
  ): Promise<CalendarEventEntity[]> {
    return await this.calendarEventRepository.findByDateRange(
      buildingId,
      new Date(startDate),
      new Date(endDate),
    );
  }

  async findByApartmentIds(
    buildingId: string,
    apartmentIds: string[],
  ): Promise<CalendarEventEntity[]> {
    return await this.calendarEventRepository.findByApartmentIds(
      buildingId,
      apartmentIds,
    );
  }

  async findOne(id: string): Promise<CalendarEventEntity> {
    const event = await this.calendarEventRepository.findById(id);
    if (!event) {
      throw new NotFoundException(`Calendar event with ID ${id} not found`);
    }
    return event;
  }

  async update(
    id: string,
    updateCalendarEventDto: UpdateCalendarEventDto,
  ): Promise<CalendarEventEntity> {
    const existingEvent = await this.findOne(id);

    // Validate apartment targeting logic if provided
    if (
      updateCalendarEventDto.appliesToAllApartments !== undefined ||
      updateCalendarEventDto.targetApartmentIds !== undefined
    ) {
      this.validateApartmentTargeting({
        appliesToAllApartments:
          updateCalendarEventDto.appliesToAllApartments ??
          existingEvent.appliesToAllApartments,
        targetApartmentIds:
          updateCalendarEventDto.targetApartmentIds ??
          existingEvent.targetApartmentIds,
      });
    }

    // Prepare update data with proper type handling
    const updateData: Partial<CalendarEventEntity> = {};

    // Copy non-date fields
    if (updateCalendarEventDto.title !== undefined) {
      updateData.title = updateCalendarEventDto.title;
    }
    if (updateCalendarEventDto.type !== undefined) {
      updateData.type = updateCalendarEventDto.type;
    }
    if (updateCalendarEventDto.description !== undefined) {
      updateData.description = updateCalendarEventDto.description;
    }
    if (updateCalendarEventDto.status !== undefined) {
      updateData.status = updateCalendarEventDto.status;
    }
    if (updateCalendarEventDto.priority !== undefined) {
      updateData.priority = updateCalendarEventDto.priority;
    }
    if (updateCalendarEventDto.assignedTo !== undefined) {
      updateData.assignedTo = updateCalendarEventDto.assignedTo;
    }
    if (updateCalendarEventDto.appliesToAllApartments !== undefined) {
      updateData.appliesToAllApartments =
        updateCalendarEventDto.appliesToAllApartments;
    }
    if (updateCalendarEventDto.targetApartmentIds !== undefined) {
      updateData.targetApartmentIds = updateCalendarEventDto.targetApartmentIds;
    }
    if (updateCalendarEventDto.location !== undefined) {
      updateData.location = updateCalendarEventDto.location;
    }
    if (updateCalendarEventDto.notes !== undefined) {
      updateData.notes = updateCalendarEventDto.notes;
    }

    // Handle date updates
    if (updateCalendarEventDto.startDate) {
      updateData.startDate = new Date(updateCalendarEventDto.startDate);
    }
    if (updateCalendarEventDto.endDate) {
      updateData.endDate = new Date(updateCalendarEventDto.endDate);
    }

    // Validate date logic if both dates are being updated
    const finalStartDate = updateData.startDate || existingEvent.startDate;
    const finalEndDate = updateData.endDate || existingEvent.endDate;

    if (finalStartDate >= finalEndDate) {
      throw new BadRequestException('Start date must be before end date');
    }

    const updatedEvent = await this.calendarEventRepository.update(
      id,
      updateData,
    );

    if (!updatedEvent) {
      throw new NotFoundException(`Calendar event with ID ${id} not found`);
    }

    return updatedEvent;
  }

  async remove(id: string): Promise<void> {
    const exists = await this.calendarEventRepository.exists(id);
    if (!exists) {
      throw new NotFoundException(`Calendar event with ID ${id} not found`);
    }

    const deleted = await this.calendarEventRepository.delete(id);
    if (!deleted) {
      throw new BadRequestException('Failed to delete calendar event');
    }
  }

  async getEventStats(buildingId?: string) {
    if (buildingId) {
      return await this.calendarEventRepository.getEventStatsByBuilding(
        buildingId,
      );
    }

    // Get overall stats across all buildings
    const totalEvents = await this.calendarEventRepository.count();
    return {
      totalEvents,
      // Add more overall stats as needed
    };
  }

  private validateApartmentTargeting(data: {
    appliesToAllApartments?: boolean;
    targetApartmentIds?: string[];
  }): void {
    const { appliesToAllApartments, targetApartmentIds } = data;

    // If applies to all apartments, targetApartmentIds should be empty or undefined
    if (appliesToAllApartments && targetApartmentIds?.length) {
      throw new BadRequestException(
        'Cannot specify specific apartments when event applies to all apartments',
      );
    }

    // If not applies to all apartments, must have at least one target apartment
    if (
      !appliesToAllApartments &&
      (!targetApartmentIds || targetApartmentIds.length === 0)
    ) {
      throw new BadRequestException(
        'Must specify target apartments when event does not apply to all apartments',
      );
    }
  }
}
