import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MonthlyFeesController } from './monthly-fees.controller';
import { MonthlyFeesService } from './monthly-fees.service';
import { MonthlyFeeRepository } from '../../database/repositories/monthly-fee.repository';
import { MonthlyFeeEntity } from '../../database/entities/monthly-fee.entity';
import { MonthlyFeeApartmentEntity } from '../../database/entities/monthly-fee-apartment.entity';
import { ApartmentMonthlyPaymentEntity } from '../../database/entities/apartment-monthly-payment.entity';
import { ApartmentEntity } from '../../database/entities/apartment.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      MonthlyFeeEntity,
      MonthlyFeeApartmentEntity,
      ApartmentMonthlyPaymentEntity,
      ApartmentEntity,
    ]),
  ],
  controllers: [MonthlyFeesController],
  providers: [MonthlyFeesService, MonthlyFeeRepository],
  exports: [MonthlyFeesService, MonthlyFeeRepository],
})
export class MonthlyFeesModule {}
