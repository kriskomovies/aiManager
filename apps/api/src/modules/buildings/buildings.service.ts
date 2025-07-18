import { Injectable, NotFoundException } from '@nestjs/common';
import { BuildingEntity } from '../../database/entities/building.entity';
import { BuildingRepository } from '../../database/repositories/building.repository';
import { InventoriesService } from '../inventories/inventories.service';
import { CreateBuildingDto } from './dto/create-building.dto';
import { UpdateBuildingDto } from './dto/update-building.dto';
import { BuildingQueryDto } from './dto/building-query.dto';
import { BuildingStatsDto } from './dto/building-stats.dto';
import { IPaginatedResult } from '../../common/abstracts/base-repository.abstract';
import { BuildingStatus } from '@repo/interfaces';

@Injectable()
export class BuildingsService {
  constructor(
    private readonly buildingRepository: BuildingRepository,
    private readonly inventoriesService: InventoriesService,
  ) {}

  async createBuilding(
    createBuildingDto: CreateBuildingDto,
  ): Promise<BuildingEntity> {
    // Convert DTO to entity data
    const buildingData: Partial<BuildingEntity> = {
      ...createBuildingDto,
      homebookStartDate: new Date(createBuildingDto.homebookStartDate),
      // Set default values for fields not in DTO but required by database
      status: BuildingStatus.ACTIVE,
      balance: 0,
      monthlyFee: 0,
      debt: 0,
      totalUnits: 0,
      occupiedUnits: 0,
      irregularities: 0,
      occupancyRate: 0,
      monthlyRevenue: 0,
      annualRevenue: 0,
    };

    const building = await this.buildingRepository.create(buildingData);

    // Create main inventory for the building
    await this.inventoriesService.createMainInventoryForBuilding(building.id);

    return building;
  }

  async findById(id: string): Promise<BuildingEntity> {
    const building = await this.buildingRepository.findById(id);
    if (!building) {
      throw new NotFoundException(`Building with ID ${id} not found`);
    }
    return building;
  }

  async updateBuilding(
    id: string,
    updateBuildingDto: UpdateBuildingDto,
  ): Promise<BuildingEntity> {
    // Check if building exists
    await this.findById(id);

    // Extract fields that need special handling or should be excluded
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { homebookStartDate, peopleWithAccess, ...restDto } =
      updateBuildingDto;

    // Convert date string to Date if provided
    const updateData: Partial<BuildingEntity> = {
      ...restDto,
    };

    // Handle date conversion separately
    if (homebookStartDate) {
      updateData.homebookStartDate = new Date(String(homebookStartDate));
    }

    const updated = await this.buildingRepository.update(id, updateData);
    if (!updated) {
      throw new NotFoundException(`Building with ID ${id} not found`);
    }
    return updated;
  }

  async deleteBuilding(id: string): Promise<void> {
    const exists = await this.buildingRepository.exists(id);
    if (!exists) {
      throw new NotFoundException(`Building with ID ${id} not found`);
    }

    const deleted = await this.buildingRepository.delete(id);
    if (!deleted) {
      throw new NotFoundException(`Failed to delete building with ID ${id}`);
    }
  }

  async findAllBuildings(
    queryDto: BuildingQueryDto,
  ): Promise<IPaginatedResult<BuildingEntity>> {
    return await this.buildingRepository.findAllWithFilters(queryDto);
  }

  async getBuildingStats(id: string): Promise<BuildingStatsDto> {
    const building = await this.findById(id);

    // Calculate vacancy with null checks
    const totalUnits = building.totalUnits || 0;
    const occupiedUnits = building.occupiedUnits || 0;
    const vacantUnits = totalUnits - occupiedUnits;

    // Calculate occupancy rate
    const occupancyRate =
      totalUnits > 0 ? Math.round((occupiedUnits / totalUnits) * 100) : 0;

    // Calculate revenues
    const monthlyRevenue = building.monthlyRevenue || 0;
    const annualRevenue = monthlyRevenue * 12;

    const stats: BuildingStatsDto = {
      buildingId: building.id,
      buildingName: building.name,
      totalUnits,
      occupiedUnits,
      vacantUnits,
      occupancyRate,
      monthlyRevenue,
      annualRevenue,
      isFullyOccupied: occupiedUnits === totalUnits && totalUnits > 0,
      canGenerateTax: building.status === BuildingStatus.ACTIVE,
      nextTaxDate:
        building.nextTaxDate?.toISOString() || new Date().toISOString(),
    };

    return stats;
  }

  async updateBuildingOccupancy(
    id: string,
    occupiedUnits: number,
  ): Promise<BuildingEntity> {
    await this.findById(id); // Check if exists
    const updated = await this.buildingRepository.update(id, { occupiedUnits });
    if (!updated) {
      throw new NotFoundException(`Building with ID ${id} not found`);
    }
    return updated;
  }

  async getActiveBuildings(): Promise<BuildingEntity[]> {
    const result = await this.buildingRepository.findAllWithFilters({
      status: BuildingStatus.ACTIVE,
      page: 1,
      limit: 1000, // Get all active buildings
    });
    return result.data;
  }

  async getBuildingsByType(type: string): Promise<BuildingEntity[]> {
    const result = await this.buildingRepository.findAllWithFilters({
      type: type as never,
      page: 1,
      limit: 1000,
    });
    return result.data;
  }

  async getBuildingsWithLowOccupancy(
    threshold: number = 80,
  ): Promise<BuildingEntity[]> {
    const result = await this.buildingRepository.findAllWithFilters({
      maxOccupancyRate: threshold,
      page: 1,
      limit: 1000,
    });
    return result.data;
  }

  async getTotalRevenue(): Promise<{
    totalMonthlyRevenue: number;
    totalAnnualRevenue: number;
    averageOccupancyRate: number;
    totalBuildings: number;
    activeBuildings: number;
  }> {
    const buildings = await this.buildingRepository.findAll();

    const totalMonthlyRevenue = buildings.reduce(
      (sum, building) => sum + Number(building.monthlyRevenue || 0),
      0,
    );

    const totalAnnualRevenue = totalMonthlyRevenue * 12;

    const averageOccupancyRate =
      buildings.length > 0
        ? buildings.reduce((sum, building) => {
            const totalUnits = building.totalUnits || 0;
            const occupiedUnits = building.occupiedUnits || 0;
            const occupancyRate =
              totalUnits > 0 ? (occupiedUnits / totalUnits) * 100 : 0;
            return sum + occupancyRate;
          }, 0) / buildings.length
        : 0;

    const activeBuildings = buildings.filter(
      (building) => building.status === BuildingStatus.ACTIVE,
    ).length;

    return {
      totalMonthlyRevenue,
      totalAnnualRevenue,
      averageOccupancyRate: Math.round(averageOccupancyRate * 100) / 100,
      totalBuildings: buildings.length,
      activeBuildings,
    };
  }
}
