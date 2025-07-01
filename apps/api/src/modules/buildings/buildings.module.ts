import { Module } from '@nestjs/common';
import { BuildingsController } from './buildings.controller';
import { BuildingsService } from './buildings.service';
import { BuildingRepository } from '../../database/repositories/building.repository';

@Module({
  controllers: [BuildingsController],
  providers: [BuildingsService, BuildingRepository],
  exports: [BuildingsService, BuildingRepository],
})
export class BuildingsModule {}
