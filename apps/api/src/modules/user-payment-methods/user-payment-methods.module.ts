import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserPaymentMethodsController } from './user-payment-methods.controller';
import { UserPaymentMethodsService } from './user-payment-methods.service';
import { UserPaymentMethodRepository } from '../../database/repositories/user-payment-method.repository';
import { UserPaymentMethodEntity } from '../../database/entities/user-payment-method.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserPaymentMethodEntity])],
  controllers: [UserPaymentMethodsController],
  providers: [UserPaymentMethodsService, UserPaymentMethodRepository],
  exports: [UserPaymentMethodsService, UserPaymentMethodRepository],
})
export class UserPaymentMethodsModule {} 