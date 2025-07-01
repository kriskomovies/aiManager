import { Injectable } from '@nestjs/common';
import { BaseService } from '../../common/abstracts/base-service.abstract';
import { BuildingEntity } from '../../database/entities/building.entity';
import { BuildingRepository } from '../../database/repositories/building.repository';
import { CreateBuildingDto } from './dto/create-building.dto';
import { UpdateBuildingDto } from './dto/update-building.dto';
import { BuildingQueryDto } from './dto/building-query.dto';
import { BuildingStatsDto } from './dto/building-stats.dto';
import { IPaginatedResult } from '../../common/abstracts/base-repository.abstract';
import { BuildingStatus } from '@repo/interfaces';

@Injectable()
export class BuildingsService extends BaseService<BuildingEntity> {
  constructor(private readonly buildingRepository: BuildingRepository) {
    super(buildingRepository);
  }

  async createBuilding(
    createBuildingDto: CreateBuildingDto,
  ): Promise<BuildingEntity> {
    // Convert DTO to entity data
    const buildingData: Partial<BuildingEntity> = {
      ...createBuildingDto,
      nextTaxDate: new Date(createBuildingDto.nextTaxDate),
    };

    return await this.repository.create(buildingData);
  }

  async updateBuilding(
    id: string,
    updateBuildingDto: UpdateBuildingDto,
  ): Promise<BuildingEntity> {
    // Extract nextTaxDate to handle separately
    const { nextTaxDate, ...restDto } = updateBuildingDto;

    // Convert date string to Date if provided
    const updateData: Partial<BuildingEntity> = {
      ...restDto,
    };

    // Handle date conversion separately
    if (nextTaxDate) {
      updateData.nextTaxDate = new Date(String(nextTaxDate));
    }

    return await this.update(id, updateData);
  }

  async findAllBuildings(
    queryDto: BuildingQueryDto,
  ): Promise<IPaginatedResult<BuildingEntity>> {
    return await this.buildingRepository.findAllWithFilters(queryDto);
  }

  async getBuildingStats(id: string): Promise<BuildingStatsDto> {
    const building = await this.findById(id);

    const stats: BuildingStatsDto = {
      buildingId: building.id,
      buildingName: building.name,
      totalUnits: building.totalUnits,
      occupiedUnits: building.occupiedUnits,
      vacantUnits: building.getVacantUnits(),
      occupancyRate: building.calculateOccupancyRate(),
      monthlyRevenue: building.calculateMonthlyRevenue(),
      annualRevenue: building.calculateAnnualRevenue(),
      isFullyOccupied: building.isFullyOccupied(),
      canGenerateTax: building.canGenerateTax(),
      nextTaxDate: building.nextTaxDate,
    };

    return stats;
  }

  async updateBuildingOccupancy(
    id: string,
    occupiedUnits: number,
  ): Promise<BuildingEntity> {
    const building = await this.findById(id);
    building.updateOccupancy(occupiedUnits);
    return await this.update(id, { occupiedUnits });
  }

  async generateNextTaxDate(id: string): Promise<BuildingEntity> {
    const building = await this.findById(id);
    building.updateNextTaxDate();
    return await this.update(id, { nextTaxDate: building.nextTaxDate });
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
    const allBuildings = await this.buildingRepository.findAll({
      page: 1,
      limit: 10000,
    });
    const buildings = allBuildings.data;

    const totalMonthlyRevenue = buildings.reduce(
      (sum, building) => sum + building.calculateMonthlyRevenue(),
      0,
    );

    const totalAnnualRevenue = totalMonthlyRevenue * 12;

    const averageOccupancyRate =
      buildings.length > 0
        ? buildings.reduce(
            (sum, building) => sum + building.calculateOccupancyRate(),
            0,
          ) / buildings.length
        : 0;

    const activeBuildings = buildings.filter((building) =>
      building.isActive(),
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
