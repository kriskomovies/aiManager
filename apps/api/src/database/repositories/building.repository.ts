import { Injectable } from '@nestjs/common';
import {
  BaseRepository,
  IPaginationOptions,
  IPaginatedResult,
} from '../../common/abstracts/base-repository.abstract';
import { BuildingEntity } from '../entities/building.entity';
import { BuildingQueryDto } from '../../modules/buildings/dto/building-query.dto';

@Injectable()
export class BuildingRepository extends BaseRepository<BuildingEntity> {
  private buildings: BuildingEntity[] = [];
  private currentId = 1;

  async create(createData: Partial<BuildingEntity>): Promise<BuildingEntity> {
    const building = new BuildingEntity();

    // Set base entity fields
    building.id = this.generateId();
    building.createdAt = new Date();
    building.updatedAt = new Date();

    // Set building-specific fields
    Object.assign(building, createData);

    // Convert string date to Date object
    if (typeof createData.nextTaxDate === 'string') {
      building.nextTaxDate = new Date(createData.nextTaxDate);
    }

    this.buildings.push(building);
    return building;
  }

  async findById(id: string): Promise<BuildingEntity | null> {
    const building = this.buildings.find((b) => b.id === id);
    return building || null;
  }

  async findAll(
    options?: IPaginationOptions,
  ): Promise<IPaginatedResult<BuildingEntity>> {
    const filteredBuildings = [...this.buildings];

    // Apply sorting
    if (options?.sortBy) {
      const sortOrder = options.sortOrder || 'DESC';
      filteredBuildings.sort((a, b) => {
        const aValue = (a as unknown as Record<string, unknown>)[
          options.sortBy!
        ];
        const bValue = (b as unknown as Record<string, unknown>)[
          options.sortBy!
        ];

        if ((aValue as number) < (bValue as number))
          return sortOrder === 'ASC' ? -1 : 1;
        if ((aValue as number) > (bValue as number))
          return sortOrder === 'ASC' ? 1 : -1;
        return 0;
      });
    }

    // Apply pagination
    const page = options?.page || 1;
    const limit = options?.limit || 10;
    const skip = (page - 1) * limit;
    const paginatedBuildings = filteredBuildings.slice(skip, skip + limit);

    return this.createPaginatedResult(
      paginatedBuildings,
      filteredBuildings.length,
      page,
      limit,
    );
  }

  async findAllWithFilters(
    queryDto: BuildingQueryDto,
  ): Promise<IPaginatedResult<BuildingEntity>> {
    let filteredBuildings = [...this.buildings];

    // Apply search filter
    if (queryDto.search) {
      const searchTerm = queryDto.search.toLowerCase();
      filteredBuildings = filteredBuildings.filter(
        (building) =>
          building.name.toLowerCase().includes(searchTerm) ||
          building.address.toLowerCase().includes(searchTerm),
      );
    }

    // Apply type filter
    if (queryDto.type) {
      filteredBuildings = filteredBuildings.filter(
        (building) => building.type === queryDto.type,
      );
    }

    // Apply status filter
    if (queryDto.status) {
      filteredBuildings = filteredBuildings.filter(
        (building) => building.status === queryDto.status,
      );
    }

    // Apply occupancy rate filters
    if (
      queryDto.minOccupancyRate !== undefined ||
      queryDto.maxOccupancyRate !== undefined
    ) {
      filteredBuildings = filteredBuildings.filter((building) => {
        const occupancyRate = building.calculateOccupancyRate();
        const minRate = queryDto.minOccupancyRate ?? 0;
        const maxRate = queryDto.maxOccupancyRate ?? 100;
        return occupancyRate >= minRate && occupancyRate <= maxRate;
      });
    }

    // Apply sorting
    if (queryDto.sortBy) {
      const sortOrder = queryDto.sortOrder || 'DESC';
      filteredBuildings.sort((a, b) => {
        const aValue = (a as unknown as Record<string, unknown>)[
          queryDto.sortBy!
        ];
        const bValue = (b as unknown as Record<string, unknown>)[
          queryDto.sortBy!
        ];

        if ((aValue as number) < (bValue as number))
          return sortOrder === 'ASC' ? -1 : 1;
        if ((aValue as number) > (bValue as number))
          return sortOrder === 'ASC' ? 1 : -1;
        return 0;
      });
    }

    // Apply pagination
    const page = queryDto.page || 1;
    const limit = queryDto.limit || 10;
    const skip = (page - 1) * limit;
    const paginatedBuildings = filteredBuildings.slice(skip, skip + limit);

    return this.createPaginatedResult(
      paginatedBuildings,
      filteredBuildings.length,
      page,
      limit,
    );
  }

  async update(
    id: string,
    updates: Partial<BuildingEntity>,
  ): Promise<BuildingEntity | null> {
    const buildingIndex = this.buildings.findIndex((b) => b.id === id);
    if (buildingIndex === -1) {
      return null;
    }

    const building = this.buildings[buildingIndex];

    // Update fields
    Object.assign(building, updates);

    // Convert string date to Date object if needed
    if (updates.nextTaxDate && typeof updates.nextTaxDate === 'string') {
      building.nextTaxDate = new Date(updates.nextTaxDate);
    }

    // Update timestamp
    building.updateTimestamp();

    this.buildings[buildingIndex] = building;
    return building;
  }

  async delete(id: string): Promise<boolean> {
    const initialLength = this.buildings.length;
    this.buildings = this.buildings.filter((b) => b.id !== id);
    return this.buildings.length < initialLength;
  }

  async exists(id: string): Promise<boolean> {
    return this.buildings.some((b) => b.id === id);
  }

  private generateId(): string {
    return `building_${this.currentId++}_${Date.now()}`;
  }

  // Additional methods for testing/development
  async clear(): Promise<void> {
    this.buildings = [];
    this.currentId = 1;
  }

  async count(): Promise<number> {
    return this.buildings.length;
  }
}
