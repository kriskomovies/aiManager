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
import { UserPaymentMethodsService } from './user-payment-methods.service';
import { CreateUserPaymentMethodDto } from './dto/create-user-payment-method.dto';
import { UpdateUserPaymentMethodDto } from './dto/update-user-payment-method.dto';
import { UserPaymentMethodQueryDto } from './dto/user-payment-method-query.dto';
import { UserPaymentMethodEntity } from '../../database/entities/user-payment-method.entity';
import { ApiPaginatedResponse } from '../../common/decorators/api-paginated-response.decorator';

@ApiTags('User Payment Methods')
@Controller('user-payment-methods')
export class UserPaymentMethodsController {
  constructor(
    private readonly userPaymentMethodsService: UserPaymentMethodsService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new user payment method' })
  @ApiBody({ type: CreateUserPaymentMethodDto })
  @ApiResponse({
    status: 201,
    description: 'User payment method created successfully',
    type: UserPaymentMethodEntity,
  })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  async create(
    @Body() createUserPaymentMethodDto: CreateUserPaymentMethodDto,
  ): Promise<UserPaymentMethodEntity> {
    return this.userPaymentMethodsService.createUserPaymentMethod(
      createUserPaymentMethodDto,
    );
  }

  @Get()
  @ApiOperation({
    summary: 'Get all user payment methods with pagination and filtering',
  })
  @ApiQuery({ type: UserPaymentMethodQueryDto })
  @ApiPaginatedResponse(UserPaymentMethodEntity)
  async findAll(@Query() queryDto: UserPaymentMethodQueryDto) {
    return this.userPaymentMethodsService.findAllUserPaymentMethods(queryDto);
  }

  @Get('active')
  @ApiOperation({ summary: 'Get all active user payment methods' })
  @ApiResponse({
    status: 200,
    description: 'Active user payment methods found',
    type: [UserPaymentMethodEntity],
  })
  async findAllActive(): Promise<UserPaymentMethodEntity[]> {
    return this.userPaymentMethodsService.findAllActive();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a user payment method by ID' })
  @ApiParam({ name: 'id', description: 'User payment method ID' })
  @ApiResponse({
    status: 200,
    description: 'User payment method found',
    type: UserPaymentMethodEntity,
  })
  @ApiResponse({ status: 404, description: 'User payment method not found' })
  async findOne(@Param('id') id: string): Promise<UserPaymentMethodEntity> {
    return this.userPaymentMethodsService.findById(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a user payment method' })
  @ApiParam({ name: 'id', description: 'User payment method ID' })
  @ApiBody({ type: UpdateUserPaymentMethodDto })
  @ApiResponse({
    status: 200,
    description: 'User payment method updated successfully',
    type: UserPaymentMethodEntity,
  })
  @ApiResponse({ status: 404, description: 'User payment method not found' })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  async update(
    @Param('id') id: string,
    @Body() updateUserPaymentMethodDto: UpdateUserPaymentMethodDto,
  ): Promise<UserPaymentMethodEntity> {
    return this.userPaymentMethodsService.updateUserPaymentMethod(
      id,
      updateUserPaymentMethodDto,
    );
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a user payment method' })
  @ApiParam({ name: 'id', description: 'User payment method ID' })
  @ApiResponse({
    status: 204,
    description: 'User payment method deleted successfully',
  })
  @ApiResponse({ status: 404, description: 'User payment method not found' })
  async remove(@Param('id') id: string): Promise<void> {
    return this.userPaymentMethodsService.deleteUserPaymentMethod(id);
  }
}
