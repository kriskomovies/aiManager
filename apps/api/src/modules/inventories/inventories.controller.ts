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
import { InventoriesService } from './inventories.service';
import { CreateInventoryDto } from './dto/create-inventory.dto';
import { UpdateInventoryDto } from './dto/update-inventory.dto';
import { InventoryTransferDto } from './dto/inventory-transfer.dto';
import { InventoryQueryDto } from './dto/inventory-query.dto';
import { InventoryEntity } from '../../database/entities/inventory.entity';
import { InventoryTransactionEntity } from '../../database/entities/inventory-transaction.entity';
import { ApiPaginatedResponse } from '../../common/decorators/api-paginated-response.decorator';
import { IInventoryStats } from '@repo/interfaces';

@ApiTags('Inventories')
@Controller('inventories')
export class InventoriesController {
  constructor(private readonly inventoriesService: InventoriesService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new custom inventory' })
  @ApiBody({ type: CreateInventoryDto })
  @ApiResponse({
    status: 201,
    description: 'Inventory created successfully',
    type: InventoryEntity,
  })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @ApiResponse({
    status: 409,
    description: 'Conflict - Main inventory already exists',
  })
  async createInventory(
    @Body() createInventoryDto: CreateInventoryDto,
  ): Promise<InventoryEntity> {
    return this.inventoriesService.createInventory(createInventoryDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Get all inventories with pagination and filtering',
  })
  @ApiQuery({ type: InventoryQueryDto })
  @ApiPaginatedResponse(InventoryEntity)
  async getAllInventories(@Query() queryDto: InventoryQueryDto) {
    return this.inventoriesService.getAllInventories(queryDto);
  }

  @Get('building/:buildingId')
  @ApiOperation({ summary: 'Get all inventories for a specific building' })
  @ApiParam({ name: 'buildingId', description: 'Building ID' })
  @ApiResponse({
    status: 200,
    description: 'Inventories retrieved successfully',
    type: [InventoryEntity],
  })
  async getInventoriesByBuilding(
    @Param('buildingId') buildingId: string,
  ): Promise<InventoryEntity[]> {
    return this.inventoriesService.getInventoriesByBuilding(buildingId);
  }

  @Get('building/:buildingId/stats')
  @ApiOperation({ summary: 'Get inventory statistics for a building' })
  @ApiParam({ name: 'buildingId', description: 'Building ID' })
  @ApiResponse({
    status: 200,
    description: 'Inventory statistics retrieved successfully',
  })
  async getInventoryStats(
    @Param('buildingId') buildingId: string,
  ): Promise<IInventoryStats> {
    return this.inventoriesService.getInventoryStats(buildingId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get inventory by ID' })
  @ApiParam({ name: 'id', description: 'Inventory ID' })
  @ApiResponse({
    status: 200,
    description: 'Inventory retrieved successfully',
    type: InventoryEntity,
  })
  @ApiResponse({ status: 404, description: 'Inventory not found' })
  async getInventoryById(@Param('id') id: string): Promise<InventoryEntity> {
    return this.inventoriesService.getInventoryById(id);
  }

  @Get(':id/transactions')
  @ApiOperation({ summary: 'Get transactions for a specific inventory' })
  @ApiParam({ name: 'id', description: 'Inventory ID' })
  @ApiPaginatedResponse(InventoryTransactionEntity)
  async getInventoryTransactions(
    @Param('id') id: string,
    @Query() queryDto: any,
  ) {
    return this.inventoriesService.getInventoryTransactions(id, queryDto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an inventory' })
  @ApiParam({ name: 'id', description: 'Inventory ID' })
  @ApiBody({ type: UpdateInventoryDto })
  @ApiResponse({
    status: 200,
    description: 'Inventory updated successfully',
    type: InventoryEntity,
  })
  @ApiResponse({ status: 404, description: 'Inventory not found' })
  @ApiResponse({
    status: 400,
    description: 'Invalid input data or cannot update main inventory',
  })
  async updateInventory(
    @Param('id') id: string,
    @Body() updateInventoryDto: UpdateInventoryDto,
  ): Promise<InventoryEntity> {
    return this.inventoriesService.updateInventory(id, updateInventoryDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a custom inventory' })
  @ApiParam({ name: 'id', description: 'Inventory ID' })
  @ApiResponse({
    status: 204,
    description: 'Inventory deleted successfully',
  })
  @ApiResponse({ status: 404, description: 'Inventory not found' })
  @ApiResponse({
    status: 400,
    description:
      'Cannot delete main inventory or inventory with remaining balance',
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteInventory(@Param('id') id: string): Promise<void> {
    return this.inventoriesService.deleteInventory(id);
  }

  @Post('transfer')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Transfer money between inventories' })
  @ApiBody({ type: InventoryTransferDto })
  @ApiResponse({
    status: 201,
    description: 'Money transferred successfully',
    type: InventoryTransactionEntity,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid transfer data or insufficient funds',
  })
  @ApiResponse({ status: 404, description: 'Inventory not found' })
  async transferMoney(
    @Body() transferDto: InventoryTransferDto,
  ): Promise<InventoryTransactionEntity> {
    return this.inventoriesService.transferMoney(transferDto);
  }
}
