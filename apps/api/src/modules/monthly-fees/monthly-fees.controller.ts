import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { MonthlyFeesService } from './monthly-fees.service';
import { CreateMonthlyFeeDto } from './dto/create-monthly-fee.dto';
import { MonthlyFeeEntity } from '../../database/entities/monthly-fee.entity';
import { IBuildingApartmentFeesResponse } from '@repo/interfaces';

@ApiTags('Monthly Fees')
@Controller('monthly-fees')
export class MonthlyFeesController {
  constructor(private readonly monthlyFeesService: MonthlyFeesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new monthly fee' })
  @ApiResponse({
    status: 201,
    description: 'Monthly fee created successfully',
    type: MonthlyFeeEntity,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request - Invalid input data',
  })
  async create(
    @Body() createMonthlyFeeDto: CreateMonthlyFeeDto,
  ): Promise<MonthlyFeeEntity> {
    return await this.monthlyFeesService.create(createMonthlyFeeDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all monthly fees' })
  @ApiResponse({
    status: 200,
    description: 'Monthly fees retrieved successfully',
    type: [MonthlyFeeEntity],
  })
  async findAll(): Promise<MonthlyFeeEntity[]> {
    return await this.monthlyFeesService.findAll();
  }

  @Get('building/:buildingId')
  @ApiOperation({ summary: 'Get monthly fees for a specific building' })
  @ApiParam({
    name: 'buildingId',
    description: 'Building ID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiResponse({
    status: 200,
    description: 'Monthly fees retrieved successfully',
    type: [MonthlyFeeEntity],
  })
  async findByBuildingId(
    @Param('buildingId') buildingId: string,
  ): Promise<MonthlyFeeEntity[]> {
    return await this.monthlyFeesService.findByBuildingId(buildingId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific monthly fee by ID' })
  @ApiParam({
    name: 'id',
    description: 'Monthly fee ID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiResponse({
    status: 200,
    description: 'Monthly fee retrieved successfully',
    type: MonthlyFeeEntity,
  })
  @ApiResponse({
    status: 404,
    description: 'Monthly fee not found',
  })
  async findById(@Param('id') id: string): Promise<MonthlyFeeEntity> {
    return await this.monthlyFeesService.findById(id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Soft delete a monthly fee' })
  @ApiParam({
    name: 'id',
    description: 'Monthly fee ID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiResponse({
    status: 204,
    description: 'Monthly fee deleted successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Monthly fee not found',
  })
  async remove(@Param('id') id: string): Promise<void> {
    return await this.monthlyFeesService.remove(id);
  }

  @Get('apartment/:apartmentId/payments')
  @ApiOperation({ summary: 'Get monthly payment summary for an apartment' })
  @ApiParam({
    name: 'apartmentId',
    description: 'Apartment ID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiResponse({
    status: 200,
    description: 'Apartment payment summary retrieved successfully',
  })
  async getApartmentPaymentSummary(@Param('apartmentId') apartmentId: string) {
    return await this.monthlyFeesService.getApartmentPaymentSummary(
      apartmentId,
    );
  }

  @Get('building/:buildingId/apartment-fees')
  @ApiOperation({
    summary: 'Get fee breakdown for each apartment in a building',
  })
  @ApiParam({
    name: 'buildingId',
    description: 'Building ID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiResponse({
    status: 200,
    description: 'Apartment fees retrieved successfully',
  })
  async getBuildingApartmentFees(
    @Param('buildingId') buildingId: string,
  ): Promise<IBuildingApartmentFeesResponse[]> {
    return await this.monthlyFeesService.getBuildingApartmentFees(buildingId);
  }
}
