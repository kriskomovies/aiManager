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
import { ApartmentsService } from './apartments.service';
import { CreateApartmentDto } from './dto/create-apartment.dto';
import { UpdateApartmentDto } from './dto/update-apartment.dto';
import { ApartmentQueryDto } from './dto/apartment-query.dto';
import { ApartmentStatsDto } from './dto/apartment-stats.dto';
import { ApartmentEntity } from '../../database/entities/apartment.entity';
import { ApartmentStatus } from '@repo/interfaces';
import { ApiPaginatedResponse } from '../../common/decorators/api-paginated-response.decorator';

@ApiTags('Apartments')
@Controller('apartments')
export class ApartmentsController {
  constructor(private readonly apartmentsService: ApartmentsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new apartment' })
  @ApiBody({ type: CreateApartmentDto })
  @ApiResponse({
    status: 201,
    description: 'Apartment created successfully',
    type: ApartmentEntity,
  })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @ApiResponse({ status: 404, description: 'Building not found' })
  @ApiResponse({ status: 409, description: 'Apartment number already exists' })
  async create(
    @Body() createApartmentDto: CreateApartmentDto,
  ): Promise<ApartmentEntity> {
    return this.apartmentsService.createApartment(createApartmentDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all apartments with pagination and filtering' })
  @ApiQuery({ type: ApartmentQueryDto })
  @ApiPaginatedResponse(ApartmentEntity)
  async findAll(@Query() queryDto: ApartmentQueryDto) {
    return this.apartmentsService.findAllApartments(queryDto);
  }

  @Get('stats')
  @ApiOperation({ summary: 'Get apartment statistics' })
  @ApiQuery({
    name: 'buildingId',
    required: false,
    description: 'Filter statistics by building ID',
  })
  @ApiResponse({
    status: 200,
    description: 'Apartment statistics',
    type: ApartmentStatsDto,
  })
  async getStats(
    @Query('buildingId') buildingId?: string,
  ): Promise<ApartmentStatsDto> {
    return this.apartmentsService.getApartmentStats(buildingId);
  }

  @Get('building/:buildingId')
  @ApiOperation({ summary: 'Get all apartments in a building' })
  @ApiParam({ name: 'buildingId', description: 'Building ID' })
  @ApiResponse({
    status: 200,
    description: 'Apartments found',
    type: [ApartmentEntity],
  })
  @ApiResponse({ status: 404, description: 'Building not found' })
  async findByBuildingId(
    @Param('buildingId') buildingId: string,
  ): Promise<ApartmentEntity[]> {
    return this.apartmentsService.findByBuildingId(buildingId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get an apartment by ID' })
  @ApiParam({ name: 'id', description: 'Apartment ID' })
  @ApiResponse({
    status: 200,
    description: 'Apartment found',
    type: ApartmentEntity,
  })
  @ApiResponse({ status: 404, description: 'Apartment not found' })
  async findOne(@Param('id') id: string): Promise<ApartmentEntity> {
    return this.apartmentsService.findById(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an apartment' })
  @ApiParam({ name: 'id', description: 'Apartment ID' })
  @ApiBody({ type: UpdateApartmentDto })
  @ApiResponse({
    status: 200,
    description: 'Apartment updated successfully',
    type: ApartmentEntity,
  })
  @ApiResponse({ status: 404, description: 'Apartment not found' })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @ApiResponse({ status: 409, description: 'Apartment number already exists' })
  async update(
    @Param('id') id: string,
    @Body() updateApartmentDto: UpdateApartmentDto,
  ): Promise<ApartmentEntity> {
    return this.apartmentsService.updateApartment(id, updateApartmentDto);
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Update apartment status' })
  @ApiParam({ name: 'id', description: 'Apartment ID' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        status: {
          type: 'string',
          enum: Object.values(ApartmentStatus),
          description: 'New apartment status',
        },
      },
      required: ['status'],
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Apartment status updated successfully',
    type: ApartmentEntity,
  })
  @ApiResponse({ status: 404, description: 'Apartment not found' })
  @ApiResponse({ status: 400, description: 'Invalid status' })
  async updateStatus(
    @Param('id') id: string,
    @Body('status') status: ApartmentStatus,
  ): Promise<ApartmentEntity> {
    return this.apartmentsService.updateApartmentStatus(id, status);
  }

  @Patch(':id/debt/add')
  @ApiOperation({ summary: 'Add debt to apartment' })
  @ApiParam({ name: 'id', description: 'Apartment ID' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        amount: {
          type: 'number',
          minimum: 0,
          description: 'Amount to add to debt',
        },
      },
      required: ['amount'],
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Debt added successfully',
    type: ApartmentEntity,
  })
  @ApiResponse({ status: 404, description: 'Apartment not found' })
  @ApiResponse({ status: 400, description: 'Invalid amount' })
  async addDebt(
    @Param('id') id: string,
    @Body('amount') amount: number,
  ): Promise<ApartmentEntity> {
    return this.apartmentsService.addDebt(id, amount);
  }

  @Patch(':id/debt/pay')
  @ApiOperation({ summary: 'Pay apartment debt' })
  @ApiParam({ name: 'id', description: 'Apartment ID' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        amount: {
          type: 'number',
          minimum: 0,
          description: 'Amount to pay towards debt',
        },
      },
      required: ['amount'],
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Debt payment processed successfully',
    type: ApartmentEntity,
  })
  @ApiResponse({ status: 404, description: 'Apartment not found' })
  @ApiResponse({ status: 400, description: 'Invalid amount or exceeds debt' })
  async payDebt(
    @Param('id') id: string,
    @Body('amount') amount: number,
  ): Promise<ApartmentEntity> {
    return this.apartmentsService.payDebt(id, amount);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete an apartment' })
  @ApiParam({ name: 'id', description: 'Apartment ID' })
  @ApiResponse({ status: 204, description: 'Apartment deleted successfully' })
  @ApiResponse({ status: 404, description: 'Apartment not found' })
  async remove(@Param('id') id: string): Promise<void> {
    return this.apartmentsService.deleteApartment(id);
  }
}
