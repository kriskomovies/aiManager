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
import { BuildingsService } from './buildings.service';
import { CreateBuildingDto } from './dto/create-building.dto';
import { UpdateBuildingDto } from './dto/update-building.dto';
import { BuildingQueryDto } from './dto/building-query.dto';
import { BuildingStatsDto } from './dto/building-stats.dto';
import { BuildingEntity } from '../../database/entities/building.entity';
import { ApiPaginatedResponse } from '../../common/decorators/api-paginated-response.decorator';

@ApiTags('Buildings')
@Controller('buildings')
export class BuildingsController {
  constructor(private readonly buildingsService: BuildingsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new building' })
  @ApiBody({ type: CreateBuildingDto })
  @ApiResponse({
    status: 201,
    description: 'Building created successfully',
    type: BuildingEntity,
  })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  async create(
    @Body() createBuildingDto: CreateBuildingDto,
  ): Promise<BuildingEntity> {
    return this.buildingsService.createBuilding(createBuildingDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all buildings with pagination and filtering' })
  @ApiQuery({ type: BuildingQueryDto })
  @ApiPaginatedResponse(BuildingEntity)
  async findAll(@Query() queryDto: BuildingQueryDto) {
    return this.buildingsService.findAllBuildings(queryDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a building by ID' })
  @ApiParam({ name: 'id', description: 'Building ID' })
  @ApiResponse({
    status: 200,
    description: 'Building found',
    type: BuildingEntity,
  })
  @ApiResponse({ status: 404, description: 'Building not found' })
  async findOne(@Param('id') id: string): Promise<BuildingEntity> {
    return this.buildingsService.findById(id);
  }

  @Get(':id/stats')
  @ApiOperation({ summary: 'Get building statistics' })
  @ApiParam({ name: 'id', description: 'Building ID' })
  @ApiResponse({
    status: 200,
    description: 'Building statistics',
    type: BuildingStatsDto,
  })
  @ApiResponse({ status: 404, description: 'Building not found' })
  async getBuildingStats(@Param('id') id: string): Promise<BuildingStatsDto> {
    return this.buildingsService.getBuildingStats(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a building' })
  @ApiParam({ name: 'id', description: 'Building ID' })
  @ApiBody({ type: UpdateBuildingDto })
  @ApiResponse({
    status: 200,
    description: 'Building updated successfully',
    type: BuildingEntity,
  })
  @ApiResponse({ status: 404, description: 'Building not found' })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  async update(
    @Param('id') id: string,
    @Body() updateBuildingDto: UpdateBuildingDto,
  ): Promise<BuildingEntity> {
    return this.buildingsService.updateBuilding(id, updateBuildingDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a building' })
  @ApiParam({ name: 'id', description: 'Building ID' })
  @ApiResponse({ status: 204, description: 'Building deleted successfully' })
  @ApiResponse({ status: 404, description: 'Building not found' })
  async remove(@Param('id') id: string): Promise<void> {
    return this.buildingsService.deleteBuilding(id);
  }
}
