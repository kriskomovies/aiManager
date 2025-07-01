import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BuildingsController } from './buildings.controller';
import { BuildingsService } from './buildings.service';
import { BuildingRepository } from '../../database/repositories/building.repository';
import { BuildingEntity } from '../../database/entities/building.entity';

@Module({
  imports: [TypeOrmModule.forFeature([BuildingEntity])],
  controllers: [BuildingsController],
  providers: [BuildingsService, BuildingRepository],
  exports: [BuildingsService, BuildingRepository],
})
export class BuildingsModule {}
