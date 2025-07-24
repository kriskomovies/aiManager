import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { CalendarEventEntity } from '../entities/calendar-event.entity';
import { IPaginatedResult } from '../../common/abstracts/base-repository.abstract';

// Create a proper query interface that matches the backend DTO
export interface CalendarEventQueryParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
  search?: string;
  buildingId?: string;
  type?: string;
  status?: string;
  priority?: string;
  startDate?: string;
  endDate?: string;
  assignedTo?: string;
  appliesToAllApartments?: boolean;
}

@Injectable()
export class CalendarEventRepository {
  constructor(
    @InjectRepository(CalendarEventEntity)
    private readonly repository: Repository<CalendarEventEntity>,
  ) {}

  async create(
    createData: Partial<CalendarEventEntity>,
  ): Promise<CalendarEventEntity> {
    const entity = this.repository.create(createData);
    return await this.repository.save(entity);
  }

  async findById(id: string): Promise<CalendarEventEntity | null> {
    return await this.repository.findOne({
      where: { id },
      relations: ['building'],
    });
  }

  async findAll(): Promise<CalendarEventEntity[]> {
    return await this.repository.find({
      relations: ['building'],
      order: { startDate: 'ASC' },
    });
  }

  async findByBuildingId(buildingId: string): Promise<CalendarEventEntity[]> {
    return await this.repository.find({
      where: { buildingId },
      relations: ['building'],
      order: { startDate: 'ASC' },
    });
  }

  async findAllWithFilters(
    queryDto: CalendarEventQueryParams,
  ): Promise<IPaginatedResult<CalendarEventEntity>> {
    const queryBuilder = this.repository.createQueryBuilder('event');

    // Always join building for eager loading
    queryBuilder.leftJoinAndSelect('event.building', 'building');

    // Apply search filters
    if (queryDto.search) {
      queryBuilder.andWhere(
        '(event.title ILIKE :search OR event.description ILIKE :search OR event.assignedTo ILIKE :search)',
        { search: `%${queryDto.search}%` },
      );
    }

    // Building filter
    if (queryDto.buildingId) {
      queryBuilder.andWhere('event.buildingId = :buildingId', {
        buildingId: queryDto.buildingId,
      });
    }

    // Type filter
    if (queryDto.type) {
      queryBuilder.andWhere('event.type = :type', {
        type: queryDto.type,
      });
    }

    // Status filter
    if (queryDto.status) {
      queryBuilder.andWhere('event.status = :status', {
        status: queryDto.status,
      });
    }

    // Priority filter
    if (queryDto.priority) {
      queryBuilder.andWhere('event.priority = :priority', {
        priority: queryDto.priority,
      });
    }

    // Date range filter
    if (queryDto.startDate && queryDto.endDate) {
      queryBuilder.andWhere(
        'event.startDate >= :startDate AND event.endDate <= :endDate',
        {
          startDate: queryDto.startDate,
          endDate: queryDto.endDate,
        },
      );
    } else if (queryDto.startDate) {
      queryBuilder.andWhere('event.startDate >= :startDate', {
        startDate: queryDto.startDate,
      });
    } else if (queryDto.endDate) {
      queryBuilder.andWhere('event.endDate <= :endDate', {
        endDate: queryDto.endDate,
      });
    }

    // Assigned to filter
    if (queryDto.assignedTo) {
      queryBuilder.andWhere('event.assignedTo ILIKE :assignedTo', {
        assignedTo: `%${queryDto.assignedTo}%`,
      });
    }

    // Applies to all apartments filter
    if (queryDto.appliesToAllApartments !== undefined) {
      queryBuilder.andWhere(
        'event.appliesToAllApartments = :appliesToAllApartments',
        {
          appliesToAllApartments: queryDto.appliesToAllApartments,
        },
      );
    }

    // Apply sorting
    const sortBy = queryDto.sortBy || 'startDate';
    const sortOrder = queryDto.sortOrder || 'ASC';

    queryBuilder.orderBy(`event.${sortBy}`, sortOrder);

    // Apply pagination
    const page = queryDto.page || 1;
    const limit = queryDto.limit || 10;
    const skip = (page - 1) * limit;

    queryBuilder.skip(skip).take(limit);

    const [data, total] = await queryBuilder.getManyAndCount();

    return this.createPaginatedResult(data, total, page, limit);
  }

  async findUpcomingByBuildingId(
    buildingId: string,
    limit = 5,
  ): Promise<CalendarEventEntity[]> {
    const now = new Date();
    return await this.repository.find({
      where: {
        buildingId,
        startDate: Between(
          now,
          new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000),
        ), // Next 30 days
      },
      relations: ['building'],
      order: { startDate: 'ASC' },
      take: limit,
    });
  }

  async findByDateRange(
    buildingId: string,
    startDate: Date,
    endDate: Date,
  ): Promise<CalendarEventEntity[]> {
    return await this.repository.find({
      where: {
        buildingId,
        startDate: Between(startDate, endDate),
      },
      relations: ['building'],
      order: { startDate: 'ASC' },
    });
  }

  async findByApartmentIds(
    buildingId: string,
    apartmentIds: string[],
  ): Promise<CalendarEventEntity[]> {
    const queryBuilder = this.repository.createQueryBuilder('event');
    queryBuilder.leftJoinAndSelect('event.building', 'building');

    queryBuilder.where('event.buildingId = :buildingId', { buildingId });
    queryBuilder.andWhere(
      '(event.appliesToAllApartments = true OR event.targetApartmentIds ?| array[:apartmentIds])',
      { apartmentIds },
    );

    queryBuilder.orderBy('event.startDate', 'ASC');

    return await queryBuilder.getMany();
  }

  async update(
    id: string,
    updateData: Partial<CalendarEventEntity>,
  ): Promise<CalendarEventEntity | null> {
    await this.repository.update(id, updateData);
    return await this.findById(id);
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.repository.delete(id);
    return result.affected ? result.affected > 0 : false;
  }

  async exists(id: string): Promise<boolean> {
    const count = await this.repository.count({ where: { id } });
    return count > 0;
  }

  async count(buildingId?: string): Promise<number> {
    if (buildingId) {
      return await this.repository.count({ where: { buildingId } });
    }
    return await this.repository.count();
  }

  async getEventStatsByBuilding(buildingId: string) {
    const queryBuilder = this.repository.createQueryBuilder('event');
    queryBuilder.where('event.buildingId = :buildingId', { buildingId });

    const [
      totalEvents,
      scheduledEvents,
      inProgressEvents,
      completedEvents,
      cancelledEvents,
    ] = await Promise.all([
      queryBuilder.getCount(),
      queryBuilder
        .clone()
        .andWhere('event.status = :status', { status: 'scheduled' })
        .getCount(),
      queryBuilder
        .clone()
        .andWhere('event.status = :status', { status: 'in-progress' })
        .getCount(),
      queryBuilder
        .clone()
        .andWhere('event.status = :status', { status: 'completed' })
        .getCount(),
      queryBuilder
        .clone()
        .andWhere('event.status = :status', { status: 'cancelled' })
        .getCount(),
    ]);

    // Get upcoming events (next 7 days)
    const now = new Date();
    const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    const upcomingEvents = await queryBuilder
      .clone()
      .andWhere('event.startDate BETWEEN :now AND :nextWeek', { now, nextWeek })
      .andWhere('event.status = :status', { status: 'scheduled' })
      .getCount();

    // Get overdue events
    const overdueEvents = await queryBuilder
      .clone()
      .andWhere('event.endDate < :now', { now })
      .andWhere('event.status = :status', { status: 'scheduled' })
      .getCount();

    return {
      totalEvents,
      scheduledEvents,
      inProgressEvents,
      completedEvents,
      cancelledEvents,
      upcomingEvents,
      overdueEvents,
    };
  }

  private createPaginatedResult<T>(
    data: T[],
    total: number,
    page: number,
    limit: number,
  ): IPaginatedResult<T> {
    const totalPages = Math.ceil(total / limit);
    const hasNext = page < totalPages;
    const hasPrev = page > 1;

    return {
      data,
      total,
      page,
      limit,
      totalPages,
      hasNext,
      hasPrev,
    };
  }
}
