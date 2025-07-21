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
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
  ApiQuery,
} from '@nestjs/swagger';
import { OneTimeExpensesService } from './one-time-expenses.service';
import { CreateOneTimeExpenseDto } from './dto/create-one-time-expense.dto';
import { UpdateOneTimeExpenseDto } from './dto/update-one-time-expense.dto';
import { OneTimeExpenseQueryDto } from './dto/one-time-expense-query.dto';
import { OneTimeExpenseEntity } from '../../database/entities/one-time-expense.entity';
// import { ApiPaginatedResponse } from '../../common/decorators/api-paginated-response.decorator';

@ApiTags('OneTimeExpenses')
@Controller('one-time-expenses')
export class OneTimeExpensesController {
  constructor(
    private readonly oneTimeExpensesService: OneTimeExpensesService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new one-time expense' })
  @ApiBody({ type: CreateOneTimeExpenseDto })
  @ApiResponse({
    status: 201,
    description: 'One-time expense created successfully',
    type: OneTimeExpenseEntity,
  })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  async create(
    @Body() createDto: CreateOneTimeExpenseDto,
  ): Promise<OneTimeExpenseEntity> {
    return this.oneTimeExpensesService.createOneTimeExpense(createDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all one-time expenses' })
  @ApiQuery({ type: OneTimeExpenseQueryDto })
  async findAll() {
    return this.oneTimeExpensesService.findAllOneTimeExpenses();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a one-time expense by ID' })
  @ApiParam({ name: 'id', description: 'One-time expense ID' })
  @ApiResponse({
    status: 200,
    description: 'One-time expense found',
    type: OneTimeExpenseEntity,
  })
  @ApiResponse({ status: 404, description: 'One-time expense not found' })
  async findOne(@Param('id') id: string): Promise<OneTimeExpenseEntity> {
    return this.oneTimeExpensesService.findById(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a one-time expense' })
  @ApiParam({ name: 'id', description: 'One-time expense ID' })
  @ApiBody({ type: UpdateOneTimeExpenseDto })
  @ApiResponse({
    status: 200,
    description: 'One-time expense updated successfully',
    type: OneTimeExpenseEntity,
  })
  @ApiResponse({ status: 404, description: 'One-time expense not found' })
  async update(
    @Param('id') id: string,
    @Body() updateDto: UpdateOneTimeExpenseDto,
  ): Promise<OneTimeExpenseEntity> {
    return this.oneTimeExpensesService.updateOneTimeExpense(id, updateDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a one-time expense' })
  @ApiParam({ name: 'id', description: 'One-time expense ID' })
  @ApiResponse({
    status: 204,
    description: 'One-time expense deleted successfully',
  })
  @ApiResponse({ status: 404, description: 'One-time expense not found' })
  async remove(@Param('id') id: string): Promise<void> {
    return this.oneTimeExpensesService.deleteOneTimeExpense(id);
  }
}
