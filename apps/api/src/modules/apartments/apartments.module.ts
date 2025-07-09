import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApartmentsController } from './apartments.controller';
import { ApartmentsService } from './apartments.service';
import { ApartmentRepository } from '../../database/repositories/apartment.repository';
import { BuildingRepository } from '../../database/repositories/building.repository';
import { ApartmentEntity } from '../../database/entities/apartment.entity';
import { ResidentEntity } from '../../database/entities/resident.entity';
import { BuildingEntity } from '../../database/entities/building.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([ApartmentEntity, ResidentEntity, BuildingEntity]),
  ],
  controllers: [ApartmentsController],
  providers: [ApartmentsService, ApartmentRepository, BuildingRepository],
  exports: [ApartmentsService, ApartmentRepository],
})
export class ApartmentsModule {}
