import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BuildingsController } from './buildings.controller';
import { BuildingsService } from './buildings.service';
import { BuildingRepository } from '../../database/repositories/building.repository';
import { BuildingEntity } from '../../database/entities/building.entity';
import { InventoriesModule } from '../inventories/inventories.module';

@Module({
  imports: [TypeOrmModule.forFeature([BuildingEntity]), InventoriesModule],
  controllers: [BuildingsController],
  providers: [BuildingsService, BuildingRepository],
  exports: [BuildingsService, BuildingRepository],
})
export class BuildingsModule {}
