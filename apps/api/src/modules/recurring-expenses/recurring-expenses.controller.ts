import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { RecurringExpensesService } from './recurring-expenses.service';
import { CreateRecurringExpenseDto } from './dto/create-recurring-expense.dto';
import { UpdateRecurringExpenseDto } from './dto/update-recurring-expense.dto';
import { RecurringExpenseEntity } from '../../database/entities/recurring-expense.entity';

@ApiTags('Recurring Expenses')
@Controller('recurring-expenses')
export class RecurringExpensesController {
  constructor(
    private readonly recurringExpensesService: RecurringExpensesService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new recurring expense' })
  @ApiResponse({
    status: 201,
    description: 'The recurring expense has been successfully created.',
    type: RecurringExpenseEntity,
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiResponse({
    status: 404,
    description: 'Monthly fee or building not found.',
  })
  async create(
    @Body() createRecurringExpenseDto: CreateRecurringExpenseDto,
  ): Promise<RecurringExpenseEntity> {
    return await this.recurringExpensesService.createRecurringExpense(
      createRecurringExpenseDto,
    );
  }

  @Get()
  @ApiOperation({ summary: 'Get all recurring expenses' })
  @ApiResponse({
    status: 200,
    description: 'List of all recurring expenses.',
    type: [RecurringExpenseEntity],
  })
  async findAll(): Promise<RecurringExpenseEntity[]> {
    return await this.recurringExpensesService.findAll();
  }

  @Get('building/:buildingId')
  @ApiOperation({
    summary: 'Get all recurring expenses for a specific building',
  })
  @ApiParam({
    name: 'buildingId',
    type: 'string',
    description: 'Building UUID',
  })
  @ApiResponse({
    status: 200,
    description: 'List of recurring expenses for the building.',
    type: [RecurringExpenseEntity],
  })
  async findByBuilding(
    @Param('buildingId', ParseUUIDPipe) buildingId: string,
  ): Promise<RecurringExpenseEntity[]> {
    return await this.recurringExpensesService.findByBuildingId(buildingId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a recurring expense by ID' })
  @ApiParam({
    name: 'id',
    type: 'string',
    description: 'Recurring expense UUID',
  })
  @ApiResponse({
    status: 200,
    description: 'The recurring expense details.',
    type: RecurringExpenseEntity,
  })
  @ApiResponse({ status: 404, description: 'Recurring expense not found.' })
  async findOne(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<RecurringExpenseEntity> {
    return await this.recurringExpensesService.findById(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a recurring expense' })
  @ApiParam({
    name: 'id',
    type: 'string',
    description: 'Recurring expense UUID',
  })
  @ApiResponse({
    status: 200,
    description: 'The recurring expense has been successfully updated.',
    type: RecurringExpenseEntity,
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiResponse({ status: 404, description: 'Recurring expense not found.' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateRecurringExpenseDto: UpdateRecurringExpenseDto,
  ): Promise<RecurringExpenseEntity> {
    return await this.recurringExpensesService.update(
      id,
      updateRecurringExpenseDto,
    );
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a recurring expense (soft delete)' })
  @ApiParam({
    name: 'id',
    type: 'string',
    description: 'Recurring expense UUID',
  })
  @ApiResponse({
    status: 204,
    description: 'The recurring expense has been successfully deleted.',
  })
  @ApiResponse({ status: 404, description: 'Recurring expense not found.' })
  async remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    await this.recurringExpensesService.remove(id);
  }
}
