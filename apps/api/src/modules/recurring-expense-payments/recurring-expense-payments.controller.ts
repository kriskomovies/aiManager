import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { RecurringExpensePaymentsService } from './recurring-expense-payments.service';
import { CreateRecurringExpensePaymentDto } from './dto/create-recurring-expense-payment.dto';
import { UpdateRecurringExpensePaymentDto } from './dto/update-recurring-expense-payment.dto';
import { RecurringExpensePaymentEntity } from '../../database/entities/recurring-expense-payment.entity';

@ApiTags('Recurring Expense Payments')
@Controller('recurring-expense-payments')
export class RecurringExpensePaymentsController {
  constructor(
    private readonly recurringExpensePaymentsService: RecurringExpensePaymentsService,
  ) {}

  @Post()
  @ApiOperation({
    summary: 'Create a new recurring expense payment',
  })
  @ApiResponse({
    status: 201,
    description: 'The payment has been successfully created.',
    type: RecurringExpensePaymentEntity,
  })
  async create(
    @Body() createRecurringExpensePaymentDto: CreateRecurringExpensePaymentDto,
  ): Promise<RecurringExpensePaymentEntity> {
    return this.recurringExpensePaymentsService.create(
      createRecurringExpensePaymentDto,
    );
  }

  @Get()
  @ApiOperation({
    summary: 'Get all recurring expense payments',
  })
  @ApiResponse({
    status: 200,
    description: 'List of all recurring expense payments.',
    type: [RecurringExpensePaymentEntity],
  })
  async findAll(): Promise<RecurringExpensePaymentEntity[]> {
    return this.recurringExpensePaymentsService.findAll();
  }

  @Get('recurring-expense/:recurringExpenseId')
  @ApiOperation({
    summary: 'Get all payments for a specific recurring expense',
  })
  @ApiParam({
    name: 'recurringExpenseId',
    description: 'UUID of the recurring expense',
  })
  @ApiResponse({
    status: 200,
    description: 'List of payments for the recurring expense.',
    type: [RecurringExpensePaymentEntity],
  })
  async findByRecurringExpense(
    @Param('recurringExpenseId', ParseUUIDPipe) recurringExpenseId: string,
  ): Promise<RecurringExpensePaymentEntity[]> {
    return this.recurringExpensePaymentsService.findByRecurringExpense(
      recurringExpenseId,
    );
  }

  @Get('by-expenses')
  @ApiOperation({
    summary: 'Get payments for multiple recurring expenses',
  })
  @ApiResponse({
    status: 200,
    description: 'List of payments for the specified recurring expenses.',
    type: [RecurringExpensePaymentEntity],
  })
  async findByRecurringExpenses(
    @Query('ids') ids: string,
  ): Promise<RecurringExpensePaymentEntity[]> {
    const expenseIds = ids.split(',').filter((id) => id.trim());
    return this.recurringExpensePaymentsService.findByRecurringExpenses(
      expenseIds,
    );
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get a specific recurring expense payment',
  })
  @ApiParam({
    name: 'id',
    description: 'UUID of the payment',
  })
  @ApiResponse({
    status: 200,
    description: 'The payment details.',
    type: RecurringExpensePaymentEntity,
  })
  async findOne(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<RecurringExpensePaymentEntity> {
    return this.recurringExpensePaymentsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update a recurring expense payment',
  })
  @ApiParam({
    name: 'id',
    description: 'UUID of the payment',
  })
  @ApiResponse({
    status: 200,
    description: 'The payment has been successfully updated.',
    type: RecurringExpensePaymentEntity,
  })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateRecurringExpensePaymentDto: UpdateRecurringExpensePaymentDto,
  ): Promise<RecurringExpensePaymentEntity> {
    return this.recurringExpensePaymentsService.update(
      id,
      updateRecurringExpensePaymentDto,
    );
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete a recurring expense payment',
  })
  @ApiParam({
    name: 'id',
    description: 'UUID of the payment',
  })
  @ApiResponse({
    status: 200,
    description: 'The payment has been successfully deleted.',
  })
  async remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.recurringExpensePaymentsService.remove(id);
  }
}
